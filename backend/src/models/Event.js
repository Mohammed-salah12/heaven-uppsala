const mongoose = require('mongoose');

/**
 * One event on the "Events" listing page (a live night, a themed party, a
 * seasonal celebration…). `dateLabel` is a free-text display string (e.g.
 * "Fredag 25 okt" or "Every Friday") rather than a strict Date, since events
 * are often recurring or announced without a fixed calendar date — same
 * free-text convention as `price` on MenuItem.
 */
const eventSchema = new mongoose.Schema(
  {
    order: { type: Number, default: 0 }, // display order on the events page
    dateLabel: { type: String, default: '' },
    // Map<langCode, { title, description }>
    translations: { type: Map, of: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

eventSchema.index({ order: 1 });

module.exports = mongoose.model('Event', eventSchema);
