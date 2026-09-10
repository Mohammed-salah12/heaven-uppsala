// Build the same payloads the Express API returns, but from embedded content —
// so the site works with NO backend (static GitHub Pages deploy).
import { pick, resolveDoc, mapToObject } from './resolve';
import { languages as LANGS, setting, locations as LOCS, pages as PAGES, ui as UI } from './content';

const enabled = LANGS.filter((l) => l.enabled !== false).sort((a, b) => a.sortOrder - b.sortOrder);
const defaultLang = (enabled.find((l) => l.isDefault) || {}).code || 'sv';
const uiDocs = Object.entries(UI).map(([key, translations]) => ({ key, translations }));

function activeCode(reqLang) {
  const r = (reqLang || defaultLang).toLowerCase();
  return enabled.find((l) => l.code === r) ? r : defaultLang;
}

function buildUi(a) {
  const ui = {};
  uiDocs.forEach((d) => {
    const o = mapToObject(d.translations);
    ui[d.key] = o[a] != null ? o[a] : o[defaultLang] != null ? o[defaultLang] : d.key;
  });
  return ui;
}

function resolveBlock(block, a) {
  const loc = pick(block.translations, a, defaultLang) || {};
  const base = { type: block.type, order: block.order || 0 };
  ['image', 'video', 'images', 'reverse', 'cta', 'anchor', 'source'].forEach((k) => {
    if (block[k] !== undefined) base[k] = block[k];
  });
  if (block.type === 'pricing') {
    const lt = loc.tiers || [];
    base.tiers = (block.tiers || []).map((t, i) => ({ ...t, ...(lt[i] || {}) }));
    const { tiers, ...rest } = loc; // eslint-disable-line no-unused-vars
    return { ...base, ...rest };
  }
  return { ...base, ...loc };
}

export function buildSite(lang) {
  const a = activeCode(lang);
  const al = enabled.find((l) => l.code === a);
  const ui = buildUi(a);
  return {
    lang: a,
    dir: al ? al.dir : 'ltr',
    defaultLang,
    languages: enabled,
    settings: setting,
    ui,
    nav: PAGES.filter((p) => p.inNav).sort((x, y) => x.order - y.order)
      .map((p) => ({ slug: p.slug, path: p.path, isAnchor: !!p.isAnchor, label: ui[p.navKey] || p.slug })),
    locations: LOCS.map((d) => resolveDoc(d, ['key', 'order', 'addressLine', 'mapUrl'], a, defaultLang)),
  };
}

export function buildPage(slug, lang) {
  const a = activeCode(lang);
  const page = PAGES.find((p) => p.slug === slug);
  if (!page || page.isAnchor) return null;
  const hero = pick(page.translations, a, defaultLang) || {};
  return {
    slug: page.slug,
    path: page.path,
    heroImageUrl: page.heroImageUrl || '',
    heroVideoUrl: page.heroVideoUrl || '',
    title: hero.title || '',
    subtitle: hero.subtitle || '',
    blocks: (page.blocks || []).map((b) => resolveBlock(b, a)).sort((x, y) => x.order - y.order),
  };
}

export const CONTENT_SLUGS = PAGES.filter((p) => !p.isAnchor).map((p) => p.slug);
