const MenuItem = require('../models/MenuItem');
const UiString = require('../models/UiString');
const Language = require('../models/Language');
const { pick, resolveDoc, mapToObject } = require('../utils/resolve');

async function activeLangs() {
  const languages = await Language.find({ enabled: true }).sort({ sortOrder: 1, name: 1 }).lean();
  const defaultLang = (languages.find((l) => l.isDefault) || {}).code || 'sv';
  return { languages, defaultLang };
}

/**
 * GET /api/menu/:page?lang=xx — the real, structured menu (dishes/drinks/wines)
 * for "mat-meny" or "drink-meny", grouped and localized. Public, no auth.
 * Response: [{ group, label, items: [{ id, name, description, price, order }] }]
 */
async function getMenu(req, res, next) {
  try {
    const page = req.params.page;
    if (!['mat-meny', 'drink-meny'].includes(page)) {
      return res.status(404).json({ error: 'Unknown menu page' });
    }
    const { defaultLang } = await activeLangs();
    const requested = (req.query.lang || defaultLang).toLowerCase();

    const [items, groupLabelDocs] = await Promise.all([
      MenuItem.find({ page }).sort({ groupOrder: 1, order: 1 }).lean(),
      UiString.find({ key: /^menu\.group\./ }).lean(),
    ]);

    const labels = {};
    groupLabelDocs.forEach((d) => {
      const o = mapToObject(d.translations);
      labels[d.key.replace('menu.group.', '')] = o[requested] != null ? o[requested] : o[defaultLang];
    });

    const groups = [];
    const byKey = new Map();
    items.forEach((item) => {
      const loc = pick(item.translations, requested, defaultLang) || {};
      const resolved = {
        id: item._id,
        order: item.order || 0,
        price: item.price || '',
        name: loc.name || '',
        description: loc.description || '',
      };
      if (!byKey.has(item.group)) {
        const g = { group: item.group, label: labels[item.group] || item.group, groupOrder: item.groupOrder || 0, items: [] };
        byKey.set(item.group, g);
        groups.push(g);
      }
      byKey.get(item.group).items.push(resolved);
    });
    groups.sort((a, b) => a.groupOrder - b.groupOrder);

    res.json(groups);
  } catch (err) { next(err); }
}

/** GET /api/admin/menu-items?page=mat-meny — raw (all languages) for the admin editor. */
async function listMenuItems(req, res, next) {
  try {
    const filter = {};
    if (req.query.page) filter.page = req.query.page;
    const items = await MenuItem.find(filter).sort({ page: 1, groupOrder: 1, order: 1 }).lean();
    res.json(items);
  } catch (err) { next(err); }
}

/** POST /api/admin/menu-items */
async function createMenuItem(req, res, next) {
  try {
    const { page, group, groupOrder, order, price, translations } = req.body;
    if (!page || !group) return res.status(400).json({ error: 'page and group are required' });
    const item = await MenuItem.create({
      page, group,
      groupOrder: groupOrder || 0,
      order: order || 0,
      price: price || '',
      translations: translations || {},
    });
    res.status(201).json(item);
  } catch (err) { next(err); }
}

/** PUT /api/admin/menu-items/:id */
async function updateMenuItem(req, res, next) {
  try {
    const allowed = ['page', 'group', 'groupOrder', 'order', 'price', 'translations'];
    const update = {};
    allowed.forEach((k) => { if (req.body[k] !== undefined) update[k] = req.body[k]; });
    const item = await MenuItem.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!item) return res.status(404).json({ error: 'Menu item not found' });
    res.json(item);
  } catch (err) { next(err); }
}

/** DELETE /api/admin/menu-items/:id */
async function deleteMenuItem(req, res, next) {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: 'Menu item not found' });
    res.json({ ok: true });
  } catch (err) { next(err); }
}

module.exports = { getMenu, listMenuItems, createMenuItem, updateMenuItem, deleteMenuItem };
