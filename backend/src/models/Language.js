const mongoose = require('mongoose');

/**
 * A language the site can be displayed in.
 * New languages can be added at runtime (see the admin routes),
 * which is what makes the site "dynamically" multilingual.
 */
const languageSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, lowercase: true, trim: true }, // e.g. "sv", "en", "pt", "ar"
    name: { type: String, required: true }, // English name, e.g. "Swedish"
    nativeName: { type: String, required: true }, // e.g. "Svenska"
    dir: { type: String, enum: ['ltr', 'rtl'], default: 'ltr' }, // "rtl" for Arabic/Hebrew, etc.
    flag: { type: String, default: '' }, // optional emoji flag, e.g. "🇸🇪"
    enabled: { type: Boolean, default: true },
    isDefault: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Language', languageSchema);
