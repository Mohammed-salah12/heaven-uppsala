const mongoose = require('mongoose');

/**
 * A party / conference booking inquiry submitted from the Festvåning or
 * Konferens page form. (Replaces the original Wix form — now actually stored.)
 */
const inquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, default: '', trim: true },
    email: { type: String, default: '', trim: true },
    guests: { type: Number, default: null },
    date: { type: String, default: '' },
    message: { type: String, default: '', trim: true },
    source: { type: String, default: 'festvaning' }, // which page/form
    handled: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Inquiry', inquirySchema);
