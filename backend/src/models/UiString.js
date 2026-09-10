const mongoose = require('mongoose');

/**
 * Short interface strings: navigation labels, buttons, section headings, etc.
 * translations: langCode -> string
 */
const uiStringSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true }, // e.g. "nav.menu", "cta.book"
    translations: {
      type: Map,
      of: String,
      default: {},
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('UiString', uiStringSchema);
