/**
 * No-database checks: translation resolution + seed-data integrity for the
 * multi-page model. Runs anywhere (no MongoDB). Run:  node test/logic.js
 */
const assert = require('assert');
const { pick, resolveDoc, mapToObject } = require('../src/utils/resolve');
const data = require('../src/seed/data');

let pass = 0;
const ok = (l) => { console.log(`   ✓ ${l}`); pass += 1; };
const LANGS = ['sv', 'en', 'pt'];

console.log('🧪  Logic & seed-data integrity (multi-page)\n');

// ── Resolver ──
assert.strictEqual(pick({ sv: { t: 'Hej' }, en: { t: 'Hi' } }, 'en', 'sv').t, 'Hi');
assert.strictEqual(pick({ sv: { t: 'Hej' } }, 'pt', 'sv').t, 'Hej');
const mp = new Map([['sv', { t: 'A' }]]);
assert.strictEqual(pick(mp, 'zz', 'sv').t, 'A');
assert.deepStrictEqual(mapToObject(mp), { sv: { t: 'A' } });
ok('pick()/mapToObject resolve + fall back (object + Map)');

const rd = resolveDoc({ key: 'main', addressLine: 'X', translations: new Map([['sv', { name: 'A' }]]) },
  ['key', 'addressLine'], 'sv', 'sv');
assert.strictEqual(rd.key, 'main'); assert.strictEqual(rd.name, 'A');
ok('resolveDoc() merges base + localized');

// ── Languages ──
assert.deepStrictEqual(data.languages.map((l) => l.code), LANGS);
assert.strictEqual(data.languages.filter((l) => l.isDefault).length, 1);
ok('languages: sv, en, pt (one default)');

// ── Pages / nav ──
const slugs = data.pages.map((p) => p.slug);
['home', 'bakfickan', 'konferens', 'festvaning', 'mat-meny', 'drink-meny', 'om-oss', 'kontakt']
  .forEach((s) => assert.ok(slugs.includes(s), `missing page ${s}`));
assert.ok(data.pages.every((p) => p.navKey && p.path), 'each page has navKey + path');
ok(`${data.pages.length} pages incl. all nav items (${slugs.join(', ')})`);

// Anchors have no blocks; content pages have hero translations in all languages
data.pages.forEach((p) => {
  if (p.isAnchor) { assert.strictEqual(p.blocks.length, 0, `${p.slug} anchor should have no blocks`); return; }
  LANGS.forEach((lc) => {
    assert.ok(p.translations[lc] && p.translations[lc].title, `${p.slug} hero.title missing ${lc}`);
  });
});
ok('content pages have hero title in all languages; anchors have no blocks');

// Every block translated in every language; media fields valid
let blockCount = 0;
data.pages.forEach((p) => (p.blocks || []).forEach((b) => {
  blockCount += 1;
  assert.ok(b.type && typeof b.order === 'number', `${p.slug} block needs type+order`);
  LANGS.forEach((lc) => assert.ok(b.translations[lc], `${p.slug}/${b.type} missing ${lc}`));
  if (b.image) assert.ok(/^https:\/\//.test(b.image));
  if (b.video) assert.ok(/^https:\/\//.test(b.video));
  (b.images || []).forEach((u) => assert.ok(/^https:\/\//.test(u)));
}));
ok(`${blockCount} content blocks translated in all languages, media https`);

// Pricing block merges base price + localized name across languages
const home = data.pages.find((p) => p.slug === 'home');
const pricing = home.blocks.find((b) => b.type === 'pricing');
assert.strictEqual(pricing.tiers[0].highlight, true);
assert.strictEqual(pricing.tiers[0].price, '449 kr');
assert.strictEqual(pricing.translations.sv.tiers[0].name, 'Grillbuffé inkl. vegetarisk buffé');
assert.strictEqual(pricing.translations.en.tiers[3].price, 'Free');
assert.strictEqual(pricing.translations.pt.tiers[3].price, 'Grátis');
ok('pricing block: base price + localized names (449 kr / Free / Grátis)');

// Videos present (hero + festvaning)
const allVideos = [];
data.pages.forEach((p) => { if (p.heroVideoUrl) allVideos.push(p.heroVideoUrl); (p.blocks || []).forEach((b) => b.video && allVideos.push(b.video)); });
assert.ok(allVideos.some((u) => u.includes('a6f92b_57c3e45914bb4a9db1a3004c393a1b0e')), 'hero video present');
assert.ok(allVideos.some((u) => u.includes('11062b_bae67404e0ff4b328ad6a95dab4d00db')), 'festvaning video present');
assert.ok(allVideos.every((u) => u.startsWith('https://video.wixstatic.com/')), 'videos are wix mp4');
ok(`videos wired up (${new Set(allVideos).size} unique, incl. Festvåning)`);

// Booking form + newsletter blocks exist
assert.ok(data.pages.find((p) => p.slug === 'festvaning').blocks.some((b) => b.type === 'booking'));
assert.ok(home.blocks.some((b) => b.type === 'newsletter'));
assert.ok(home.blocks.some((b) => b.type === 'contact' && b.anchor === 'kontakt'));
assert.ok(home.blocks.some((b) => b.anchor === 'ourstory'));
ok('booking + newsletter + contact/ourstory anchors present');

// Menu pages carry the real menu images
assert.ok(data.pages.find((p) => p.slug === 'mat-meny').blocks.some((b) => b.type === 'menu' && b.images.length >= 2));
assert.ok(data.pages.find((p) => p.slug === 'drink-meny').blocks.some((b) => b.type === 'menu' && b.images.length >= 3));
ok('mat-meny + drink-meny carry the menu images');

// Locations + UI strings
data.locations.forEach((loc) => LANGS.forEach((lc) => {
  assert.ok(loc.translations[lc].name && Array.isArray(loc.translations[lc].hours));
  assert.ok(loc.addressLine && loc.mapUrl);
}));
ok(`${data.locations.length} locations translated + address/map`);
Object.entries(data.ui).forEach(([k, v]) => LANGS.forEach((lc) => assert.ok(v[lc], `ui ${k} missing ${lc}`)));
ok(`${Object.keys(data.ui).length} UI strings translated in all languages`);

// Real content + socials
assert.strictEqual(data.setting.phone, '018-505500');
assert.ok(data.setting.social.tiktok.includes('tiktok.com'));
assert.ok(data.setting.social.instagram.includes('instagram.com'));
assert.ok(data.setting.heroVideoUrl.startsWith('https://video.wixstatic.com/'));
ok('settings: phone, socials (TikTok/IG/FB), hero video');

// Modules load
['../src/models/Language', '../src/models/Setting', '../src/models/Location',
  '../src/models/Page', '../src/models/UiString', '../src/models/Inquiry', '../src/models/Subscriber',
  '../src/controllers/siteController', '../src/controllers/adminController',
  '../src/controllers/formController', '../src/routes'].forEach((m) => require(m));
require('../src/server');
ok('all models, controllers, routes and server load cleanly');

console.log(`\n✅  All ${pass} logic/data checks passed.`);
process.exit(0);
