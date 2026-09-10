const Language = require('../models/Language');
const Setting = require('../models/Setting');
const Location = require('../models/Location');
const Page = require('../models/Page');
const UiString = require('../models/UiString');
const { pick, resolveDoc, mapToObject } = require('../utils/resolve');

async function activeLangs() {
  const languages = await Language.find({ enabled: true }).sort({ sortOrder: 1, name: 1 }).lean();
  const defaultLang = (languages.find((l) => l.isDefault) || {}).code || 'sv';
  return { languages, defaultLang };
}

function buildUi(uiDocs, active, defaultLang) {
  const ui = {};
  uiDocs.forEach((d) => {
    const o = mapToObject(d.translations);
    ui[d.key] = o[active] != null ? o[active] : o[defaultLang] != null ? o[defaultLang] : d.key;
  });
  return ui;
}

/** Resolve one content block for a language (merges media + localized fields). */
function resolveBlock(block, active, defaultLang) {
  const loc = pick(block.translations, active, defaultLang) || {};
  const base = { type: block.type, order: block.order || 0 };
  ['image', 'video', 'images', 'reverse', 'cta', 'anchor', 'source'].forEach((k) => {
    if (block[k] !== undefined) base[k] = block[k];
  });
  if (block.type === 'pricing') {
    const locTiers = loc.tiers || [];
    base.tiers = (block.tiers || []).map((t, i) => ({ ...t, ...(locTiers[i] || {}) }));
    const { tiers, ...rest } = loc; // eslint-disable-line no-unused-vars
    return { ...base, ...rest };
  }
  return { ...base, ...loc };
}

/** GET /api/languages */
async function listLanguages(req, res, next) {
  try {
    const { languages } = await activeLangs();
    res.json(languages);
  } catch (err) { next(err); }
}

/**
 * GET /api/site?lang=xx — global "chrome": languages, settings, UI strings,
 * the navigation (built from pages), and locations. Call once per page load.
 */
async function getSite(req, res, next) {
  try {
    const { languages, defaultLang } = await activeLangs();
    const requested = (req.query.lang || defaultLang).toLowerCase();
    const active = languages.find((l) => l.code === requested) ? requested : defaultLang;
    const activeLang = languages.find((l) => l.code === active);

    const [settingDoc, uiDocs, pageDocs, locationDocs] = await Promise.all([
      Setting.findOne({ key: 'site' }).lean(),
      UiString.find().lean(),
      Page.find({ inNav: true }).sort({ order: 1 }).lean(),
      Location.find().sort({ order: 1 }).lean(),
    ]);

    const ui = buildUi(uiDocs, active, defaultLang);
    const nav = pageDocs.map((p) => ({
      slug: p.slug, path: p.path, isAnchor: !!p.isAnchor, label: ui[p.navKey] || p.slug,
    }));
    const locations = locationDocs.map((d) =>
      resolveDoc(d, ['key', 'order', 'addressLine', 'mapUrl'], active, defaultLang));

    res.json({
      lang: active,
      dir: activeLang ? activeLang.dir : 'ltr',
      defaultLang,
      languages,
      settings: settingDoc || {},
      ui,
      nav,
      locations,
    });
  } catch (err) { next(err); }
}

/** GET /api/page/:slug?lang=xx — one page's hero + resolved content blocks. */
async function getPage(req, res, next) {
  try {
    const { languages, defaultLang } = await activeLangs();
    const requested = (req.query.lang || defaultLang).toLowerCase();
    const active = languages.find((l) => l.code === requested) ? requested : defaultLang;

    const page = await Page.findOne({ slug: req.params.slug }).lean();
    if (!page || page.isAnchor) return res.status(404).json({ error: 'Page not found' });

    const hero = pick(page.translations, active, defaultLang) || {};
    const blocks = (page.blocks || [])
      .map((b) => resolveBlock(b, active, defaultLang))
      .sort((a, b) => a.order - b.order);

    res.json({
      slug: page.slug,
      path: page.path,
      heroImageUrl: page.heroImageUrl || '',
      heroVideoUrl: page.heroVideoUrl || '',
      title: hero.title || '',
      subtitle: hero.subtitle || '',
      blocks,
    });
  } catch (err) { next(err); }
}

module.exports = { listLanguages, getSite, getPage };
