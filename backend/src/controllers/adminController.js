const Language = require('../models/Language');
const Location = require('../models/Location');
const Page = require('../models/Page');
const UiString = require('../models/UiString');
const MenuItem = require('../models/MenuItem');

// Models whose top-level `translations` Map is copied when adding a language.
const MAP_MODELS = [Location, UiString, MenuItem];

/**
 * POST /api/admin/languages
 * Body: { code, name, nativeName, dir?, flag?, sortOrder?, copyFrom? }
 *
 * Adds a language AND copies the default (or `copyFrom`) language across every
 * page, block, location and UI string — so the site works immediately in the
 * new language and can be translated field by field afterwards.
 */
async function addLanguage(req, res, next) {
  try {
    const { code, name, nativeName, dir, flag, sortOrder } = req.body;
    if (!code || !name || !nativeName) {
      return res.status(400).json({ error: 'code, name and nativeName are required' });
    }
    const lc = String(code).toLowerCase().trim();
    if (await Language.findOne({ code: lc })) {
      return res.status(409).json({ error: `Language "${lc}" already exists` });
    }

    const language = await Language.create({
      code: lc, name, nativeName,
      dir: dir === 'rtl' ? 'rtl' : 'ltr',
      flag: flag || '', enabled: true, isDefault: false,
      sortOrder: sortOrder != null ? sortOrder : 99,
    });

    let source = req.body.copyFrom;
    if (source === undefined || source === '') {
      const def = await Language.findOne({ isDefault: true }).lean();
      source = def ? def.code : null;
    }

    let copied = 0;
    if (source) {
      // Map-based models (Location, UiString)
      for (const Model of MAP_MODELS) {
        for (const doc of await Model.find()) {
          const src = doc.translations.get(source);
          if (src !== undefined && doc.translations.get(lc) === undefined) {
            doc.translations.set(lc, src);
            await doc.save();
            copied += 1;
          }
        }
      }
      // Pages: top-level translations Map + each block's translations object
      for (const page of await Page.find()) {
        let changed = false;
        const top = page.translations.get(source);
        if (top !== undefined && page.translations.get(lc) === undefined) {
          page.translations.set(lc, top);
          changed = true; copied += 1;
        }
        (page.blocks || []).forEach((block) => {
          if (block && block.translations && block.translations[source] !== undefined
              && block.translations[lc] === undefined) {
            block.translations[lc] = block.translations[source];
            changed = true; copied += 1;
          }
        });
        if (changed) { page.markModified('blocks'); await page.save(); }
      }
    }

    res.status(201).json({ language, copiedFrom: source, copiedDocuments: copied });
  } catch (err) { next(err); }
}

/** PATCH /api/admin/languages/:code */
async function updateLanguage(req, res, next) {
  try {
    const lc = req.params.code.toLowerCase();
    const allowed = ['name', 'nativeName', 'dir', 'flag', 'enabled', 'sortOrder'];
    const update = {};
    allowed.forEach((k) => { if (req.body[k] !== undefined) update[k] = req.body[k]; });
    const language = await Language.findOneAndUpdate({ code: lc }, update, { new: true });
    if (!language) return res.status(404).json({ error: 'Language not found' });
    res.json(language);
  } catch (err) { next(err); }
}

/**
 * PUT /api/admin/translations/:model/:key
 * Body: { lang, value }
 * model: "ui" | "location" | "page" (page sets the hero title/subtitle).
 */
async function upsertTranslation(req, res, next) {
  try {
    const { model, key } = req.params;
    const { lang, value } = req.body;
    if (!lang || value === undefined) return res.status(400).json({ error: 'lang and value are required' });
    const lc = lang.toLowerCase();

    if (model === 'ui' || model === 'location' || model === 'page') {
      const Model = model === 'ui' ? UiString : model === 'location' ? Location : Page;
      const doc = await Model.findOne({ [model === 'ui' ? 'key' : model === 'location' ? 'key' : 'slug']: key });
      if (!doc) return res.status(404).json({ error: `${model} "${key}" not found` });
      doc.translations.set(lc, value);
      await doc.save();
      return res.json({ ok: true, model, key, lang: lc });
    }
    return res.status(400).json({ error: 'Unknown model. Use ui | location | page' });
  } catch (err) { next(err); }
}

module.exports = { addLanguage, updateLanguage, upsertTranslation };
