const Event = require('../models/Event');
const Language = require('../models/Language');
const { pick } = require('../utils/resolve');

async function activeLangs() {
  const languages = await Language.find({ enabled: true }).sort({ sortOrder: 1, name: 1 }).lean();
  const defaultLang = (languages.find((l) => l.isDefault) || {}).code || 'sv';
  return { languages, defaultLang };
}

/**
 * GET /api/events?lang=xx — all events, localized, ordered. Public, no auth.
 * Response: [{ id, order, dateLabel, title, description }]
 */
async function getEvents(req, res, next) {
  try {
    const { defaultLang } = await activeLangs();
    const requested = (req.query.lang || defaultLang).toLowerCase();
    const events = await Event.find().sort({ order: 1 }).lean();
    const resolved = events.map((e) => {
      const loc = pick(e.translations, requested, defaultLang) || {};
      return {
        id: e._id,
        order: e.order || 0,
        dateLabel: e.dateLabel || '',
        title: loc.title || '',
        description: loc.description || '',
      };
    });
    res.json(resolved);
  } catch (err) { next(err); }
}

/** GET /api/admin/events — raw (all languages) for the admin editor. */
async function listEvents(req, res, next) {
  try {
    const events = await Event.find().sort({ order: 1 }).lean();
    res.json(events);
  } catch (err) { next(err); }
}

/** POST /api/admin/events */
async function createEvent(req, res, next) {
  try {
    const { order, dateLabel, translations } = req.body;
    const event = await Event.create({
      order: order || 0,
      dateLabel: dateLabel || '',
      translations: translations || {},
    });
    res.status(201).json(event);
  } catch (err) { next(err); }
}

/** PUT /api/admin/events/:id */
async function updateEvent(req, res, next) {
  try {
    const allowed = ['order', 'dateLabel', 'translations'];
    const update = {};
    allowed.forEach((k) => { if (req.body[k] !== undefined) update[k] = req.body[k]; });
    const event = await Event.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(event);
  } catch (err) { next(err); }
}

/** DELETE /api/admin/events/:id */
async function deleteEvent(req, res, next) {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json({ ok: true });
  } catch (err) { next(err); }
}

module.exports = { getEvents, listEvents, createEvent, updateEvent, deleteEvent };
