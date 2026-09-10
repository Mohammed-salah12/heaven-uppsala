/**
 * VERIFICATION ONLY — not part of the app.
 * A no-database API mirroring the real controllers' payloads (built from the
 * seed data with the real resolver), so the frontend can be verified without
 * MongoDB. Serves /api/site, /api/page/:slug, /api/languages, and accepts the
 * inquiry/newsletter POSTs.
 */
const express = require('express');
const cors = require('cors');
const { pick, resolveDoc, mapToObject } = require('../src/utils/resolve');
const data = require('../src/seed/data');

const app = express();
app.use(cors());
app.use(express.json());

const enabled = data.languages.filter((l) => l.enabled !== false).sort((a, b) => a.sortOrder - b.sortOrder);
const defaultLang = (enabled.find((l) => l.isDefault) || {}).code || 'sv';
const uiDocs = Object.entries(data.ui).map(([key, translations]) => ({ key, translations }));
const active = (q) => (enabled.find((l) => l.code === q) ? q : defaultLang);

function buildUi(a) {
  const ui = {};
  uiDocs.forEach((d) => { const o = mapToObject(d.translations); ui[d.key] = o[a] != null ? o[a] : o[defaultLang]; });
  return ui;
}
function resolveBlock(block, a) {
  const loc = pick(block.translations, a, defaultLang) || {};
  const base = { type: block.type, order: block.order || 0 };
  ['image', 'video', 'images', 'reverse', 'cta', 'anchor', 'source'].forEach((k) => { if (block[k] !== undefined) base[k] = block[k]; });
  if (block.type === 'pricing') {
    const lt = loc.tiers || [];
    base.tiers = (block.tiers || []).map((t, i) => ({ ...t, ...(lt[i] || {}) }));
    const { tiers, ...rest } = loc; return { ...base, ...rest };
  }
  return { ...base, ...loc };
}

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.get('/api/site', (req, res) => {
  const a = active((req.query.lang || defaultLang).toLowerCase());
  const al = enabled.find((l) => l.code === a);
  const ui = buildUi(a);
  res.json({
    lang: a, dir: al ? al.dir : 'ltr', defaultLang, languages: enabled,
    settings: data.setting,
    ui,
    nav: data.pages.filter((p) => p.inNav).sort((x, y) => x.order - y.order)
      .map((p) => ({ slug: p.slug, path: p.path, isAnchor: !!p.isAnchor, label: ui[p.navKey] || p.slug })),
    locations: data.locations.map((d) => resolveDoc(d, ['key', 'order', 'addressLine', 'mapUrl'], a, defaultLang)),
  });
});

app.get('/api/page/:slug', (req, res) => {
  const a = active((req.query.lang || defaultLang).toLowerCase());
  const page = data.pages.find((p) => p.slug === req.params.slug);
  if (!page || page.isAnchor) return res.status(404).json({ error: 'Page not found' });
  const hero = pick(page.translations, a, defaultLang) || {};
  res.json({
    slug: page.slug, path: page.path,
    heroImageUrl: page.heroImageUrl || '', heroVideoUrl: page.heroVideoUrl || '',
    title: hero.title || '', subtitle: hero.subtitle || '',
    blocks: (page.blocks || []).map((b) => resolveBlock(b, a)).sort((x, y) => x.order - y.order),
  });
});

app.post('/api/inquiries', (req, res) => res.status(201).json({ ok: true, id: 'mock' }));
app.post('/api/subscribers', (req, res) => res.status(201).json({ ok: true }));

// ── Menu items (in-memory, mirrors menuController.getMenu) ──
let menuItems = data.menuItems.map((m, i) => ({ ...m, _id: `mi${i}` }));
app.get('/api/menu/:page', (req, res) => {
  const page = req.params.page;
  if (!['mat-meny', 'drink-meny'].includes(page)) return res.status(404).json({ error: 'Unknown menu page' });
  const a = active((req.query.lang || defaultLang).toLowerCase());
  const ui = buildUi(a);
  const items = menuItems.filter((m) => m.page === page).slice().sort((x, y) => (x.groupOrder - y.groupOrder) || (x.order - y.order));
  const groups = []; const byKey = new Map();
  items.forEach((item) => {
    const loc = pick(item.translations, a, defaultLang) || {};
    const resolved = { id: item._id, order: item.order || 0, price: item.price || '', name: loc.name || '', description: loc.description || '' };
    if (!byKey.has(item.group)) {
      const g = { group: item.group, label: ui[`menu.group.${item.group}`] || item.group, groupOrder: item.groupOrder || 0, items: [] };
      byKey.set(item.group, g); groups.push(g);
    }
    byKey.get(item.group).items.push(resolved);
  });
  groups.sort((g1, g2) => g1.groupOrder - g2.groupOrder);
  res.json(groups);
});

// ── Admin (verification-only, in-memory) ──
const TOKEN = process.env.ADMIN_TOKEN || 'demo-token';
const langs = [...enabled];
const sampleInquiries = [
  { _id: '1', createdAt: '2026-09-08T18:20:00Z', name: 'Anna Lind', phone: '070-123 45 67', email: 'anna@example.se', guests: 40, date: '2026-10-12', message: 'Företagsfest, gärna med musikquiz.', source: 'festvaning' },
  { _id: '2', createdAt: '2026-09-09T10:05:00Z', name: 'João Silva', phone: '073-987 65 43', email: 'joao@example.com', guests: 120, date: '2026-11-03', message: 'Conference for our team, need projector + BOSE.', source: 'konferens' },
];
const sampleSubs = [
  { _id: 's1', createdAt: '2026-09-09T09:00:00Z', email: 'guest@example.se', lang: 'sv' },
  { _id: 's2', createdAt: '2026-09-08T21:14:00Z', email: 'visitor@example.com', lang: 'en' },
];
const admin = (req, res, next) => (req.get('x-admin-token') === TOKEN ? next() : res.status(401).json({ error: 'Unauthorized' }));
app.get('/api/admin/inquiries', admin, (req, res) => res.json(sampleInquiries));
app.get('/api/admin/subscribers', admin, (req, res) => res.json(sampleSubs));
app.post('/api/admin/languages', admin, (req, res) => {
  const { code, name, nativeName, dir, flag } = req.body;
  langs.push({ code, name, nativeName, dir: dir || 'ltr', flag: flag || '', enabled: true, isDefault: false, sortOrder: 99 });
  res.status(201).json({ language: { code }, copiedFrom: defaultLang, copiedDocuments: 42 });
});
app.patch('/api/admin/languages/:code', admin, (req, res) => {
  const l = langs.find((x) => x.code === req.params.code);
  if (l) Object.assign(l, req.body);
  res.json(l || {});
});
app.get('/api/languages', (req, res) => res.json(langs));
app.put('/api/admin/translations/:model/:key', admin, (req, res) => res.json({ ok: true }));

app.get('/api/admin/menu-items', admin, (req, res) => {
  const items = req.query.page ? menuItems.filter((m) => m.page === req.query.page) : menuItems;
  res.json(items);
});
app.post('/api/admin/menu-items', admin, (req, res) => {
  const item = { _id: `mi${menuItems.length}-${Date.now()}`, groupOrder: 0, order: 0, price: '', translations: {}, ...req.body };
  menuItems.push(item);
  res.status(201).json(item);
});
app.put('/api/admin/menu-items/:id', admin, (req, res) => {
  const item = menuItems.find((m) => m._id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Menu item not found' });
  Object.assign(item, req.body);
  res.json(item);
});
app.delete('/api/admin/menu-items/:id', admin, (req, res) => {
  const before = menuItems.length;
  menuItems = menuItems.filter((m) => m._id !== req.params.id);
  if (menuItems.length === before) return res.status(404).json({ error: 'Menu item not found' });
  res.json({ ok: true });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`mock API on ${PORT}`));
