const Inquiry = require('../models/Inquiry');
const Subscriber = require('../models/Subscriber');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** POST /api/inquiries — party / conference booking inquiry (Festvåning form). */
async function createInquiry(req, res, next) {
  try {
    const { name, phone, email, guests, date, message, source } = req.body;
    if (!name || (!phone && !email)) {
      return res.status(400).json({ error: 'Please provide a name and a phone or email.' });
    }
    if (email && !EMAIL_RE.test(email)) return res.status(400).json({ error: 'Invalid email.' });
    const inquiry = await Inquiry.create({
      name, phone, email,
      guests: guests ? Number(guests) : null,
      date: date || '',
      message: message || '',
      source: source || 'festvaning',
    });
    res.status(201).json({ ok: true, id: inquiry._id });
  } catch (err) { next(err); }
}

/** POST /api/subscribers — newsletter signup. */
async function createSubscriber(req, res, next) {
  try {
    const { email, lang } = req.body;
    if (!email || !EMAIL_RE.test(email)) return res.status(400).json({ error: 'Invalid email.' });
    await Subscriber.updateOne(
      { email: email.toLowerCase() },
      { $set: { email: email.toLowerCase(), lang: lang || '' } },
      { upsert: true }
    );
    res.status(201).json({ ok: true });
  } catch (err) { next(err); }
}

/** GET /api/admin/inquiries — list inquiries (admin). */
async function listInquiries(req, res, next) {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 }).limit(200).lean();
    res.json(inquiries);
  } catch (err) { next(err); }
}

/** GET /api/admin/subscribers — list subscribers (admin). */
async function listSubscribers(req, res, next) {
  try {
    const subscribers = await Subscriber.find().sort({ createdAt: -1 }).limit(500).lean();
    res.json(subscribers);
  } catch (err) { next(err); }
}

module.exports = { createInquiry, createSubscriber, listInquiries, listSubscribers };
