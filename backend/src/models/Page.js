const mongoose = require('mongoose');

/**
 * A page of the site (home, bakfickan, konferens, festvaning, mat-meny, drink-meny).
 * The nav is built from these. Om oss / Kontakt are in-page anchors on the home
 * page (isAnchor + path like "/#ourstory").
 *
 * Each page has an ordered list of typed content `blocks`. Blocks are flexible
 * (Mixed) so any block shape can be seeded; each block carries its own
 * `translations` map (langCode -> localized fields), resolved with fallback to
 * the default language — so adding a language never leaves blanks.
 *
 * Block `type` values the frontend understands:
 *   split | rich | pricing | gallery | menu | faq | contact | newsletter | booking
 * Language‑independent media lives on the block: image, video, images[], reverse.
 */
const pageSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true }, // "home", "bakfickan", ...
    order: { type: Number, default: 0 },
    inNav: { type: Boolean, default: true },
    navKey: { type: String, default: '' }, // UiString key for the nav label
    path: { type: String, default: '' }, // route, e.g. "/bakfickan" or "/#kontakt"
    isAnchor: { type: Boolean, default: false }, // nav item that scrolls the home page
    heroImageUrl: { type: String, default: '' },
    heroVideoUrl: { type: String, default: '' },
    // Map<langCode, { title, subtitle }>
    translations: { type: Map, of: mongoose.Schema.Types.Mixed, default: {} },
    blocks: { type: [mongoose.Schema.Types.Mixed], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Page', pageSchema);
