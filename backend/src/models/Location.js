const mongoose = require('mongoose');

/**
 * A physical location (main restaurant, Bakfickan).
 * Address is language-independent; the translated part is the display name,
 * the "opening hours" label and the list of hour rows (day names differ per language).
 * translations: langCode -> { name, hoursTitle, hours: [{ label, value }], note }
 */
const locationSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true }, // e.g. "main", "bakfickan"
    order: { type: Number, default: 0 },
    addressLine: { type: String, default: '' }, // e.g. "Drottninggatan 3, 753 10, Uppsala"
    mapUrl: { type: String, default: '' },
    translations: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Location', locationSchema);
