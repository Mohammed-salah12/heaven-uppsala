const mongoose = require('mongoose');

/**
 * One real, structured menu item (a dish, a drink, a wine) — replaces the old
 * "photograph of the printed menu" block. Items are grouped by `group` (a
 * stable key like "buffet" or "wineGlassRed" whose display label is a normal
 * UiString translated like everything else: "menu.group.<group>"), which lets
 * staff add/edit items from the admin dashboard without touching code.
 *
 * `price` is a free-text display string (e.g. "159 kr" or "99/395 kr" for a
 * glass/bottle wine) — same convention as the pricing-tier blocks elsewhere,
 * so it isn't translated per language.
 */
const menuItemSchema = new mongoose.Schema(
  {
    page: { type: String, required: true, enum: ['mat-meny', 'drink-meny'], index: true },
    group: { type: String, required: true }, // e.g. "buffet", "dessert", "wineGlassRed"
    groupOrder: { type: Number, default: 0 }, // display order of the group on the page
    order: { type: Number, default: 0 }, // display order within the group
    price: { type: String, default: '' },
    // Map<langCode, { name, description }>
    translations: { type: Map, of: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

menuItemSchema.index({ page: 1, groupOrder: 1, order: 1 });

module.exports = mongoose.model('MenuItem', menuItemSchema);
