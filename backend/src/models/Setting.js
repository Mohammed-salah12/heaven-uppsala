const mongoose = require('mongoose');

/**
 * Site-wide, mostly language-independent configuration.
 * Stored as a single document (key: "site").
 */
const settingSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: 'site' },
    restaurantName: { type: String, default: 'Restaurang Heaven' },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    bookingUrl: { type: String, default: '' }, // TheFork widget etc.
    logoUrl: { type: String, default: '' },
    heroImageUrl: { type: String, default: '' },
    heroVideoUrl: { type: String, default: '' }, // background video (mp4)
    social: {
      instagram: { type: String, default: '' },
      facebook: { type: String, default: '' },
      tiktok: { type: String, default: '' },
    },
    // Image galleries for the menu pages (the real site uses photos of the menus)
    foodMenuImages: [{ type: String }],
    drinkMenuImages: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Setting', settingSchema);
