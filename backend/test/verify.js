/**
 * End-to-end smoke test (needs a running Mongo, or set MONGODB_URI; otherwise
 * uses an in-memory MongoDB where the binary is downloadable).
 * Seeds, boots the API, checks pages in all languages, adds Arabic (RTL) at
 * runtime, submits an inquiry + newsletter signup, and checks admin auth.
 *
 * Run:  node test/verify.js     (or: MONGODB_URI=... node test/verify.js)
 */
if (!process.env.MONGODB_URI) process.env.USE_MEMORY_DB = 'true';
process.env.ADMIN_TOKEN = 'test-token';

const assert = require('assert');
const { connectDB, disconnectDB } = require('../src/config/db');
const Language = require('../src/models/Language');
const Setting = require('../src/models/Setting');
const Location = require('../src/models/Location');
const Page = require('../src/models/Page');
const UiString = require('../src/models/UiString');
const Inquiry = require('../src/models/Inquiry');
const Subscriber = require('../src/models/Subscriber');
const data = require('../src/seed/data');

let pass = 0;
const ok = (l) => { console.log(`   ✓ ${l}`); pass += 1; };

async function seed() {
  await Promise.all([Language.deleteMany({}), Setting.deleteMany({}), Location.deleteMany({}),
    Page.deleteMany({}), UiString.deleteMany({}), Inquiry.deleteMany({}), Subscriber.deleteMany({})]);
  await Language.insertMany(data.languages);
  await Setting.create(data.setting);
  await Location.insertMany(data.locations);
  await Page.insertMany(data.pages);
  await UiString.insertMany(Object.entries(data.ui).map(([key, translations]) => ({ key, translations })));
}

async function main() {
  console.log('🧪  Verifying Restaurang Heaven API (multi-page)…\n');
  await connectDB();
  await seed();
  ok('Seeded in-memory database');

  const app = require('../src/server');
  const server = app.listen(0);
  await new Promise((r) => server.on('listening', r));
  const base = `http://127.0.0.1:${server.address().port}`;
  const req = async (p, opts) => { const r = await fetch(base + p, opts); return { status: r.status, body: await r.json() }; };
  const J = (b, t) => ({ method: 'POST', headers: { 'Content-Type': 'application/json', ...(t ? { 'x-admin-token': t } : {}) }, body: JSON.stringify(b) });

  assert.strictEqual((await req('/api/health')).body.status, 'ok');
  ok('GET /api/health');

  const site = (await req('/api/site?lang=sv')).body;
  assert.strictEqual(site.nav.length, 8);
  assert.ok(site.nav.find((n) => n.slug === 'festvaning').label === 'Festvåning');
  ok(`GET /api/site (nav: ${site.nav.map((n) => n.slug).join(', ')})`);

  const homeSv = (await req('/api/page/home?lang=sv')).body;
  assert.ok(homeSv.heroVideoUrl.includes('a6f92b_57c3'));
  const pr = homeSv.blocks.find((b) => b.type === 'pricing');
  assert.strictEqual(pr.tiers[0].price, '449 kr');
  assert.strictEqual(pr.tiers[0].name, 'Grillbuffé inkl. vegetarisk buffé');
  ok('GET /api/page/home?lang=sv (hero video + pricing merged)');

  const homeEn = (await req('/api/page/home?lang=en')).body;
  assert.ok(homeEn.blocks.find((b) => b.anchor === 'ourstory').heading.length > 0);
  assert.strictEqual(homeEn.blocks.find((b) => b.type === 'pricing').tiers[3].price, 'Free');
  ok('GET /api/page/home?lang=en (blocks translated)');

  const fest = (await req('/api/page/festvaning?lang=pt')).body;
  assert.ok(fest.blocks.some((b) => b.type === 'booking'));
  assert.ok(fest.blocks.some((b) => b.video && b.video.includes('11062b_bae67404')));
  ok('GET /api/page/festvaning?lang=pt (booking + video)');

  // Add Arabic (RTL) at runtime → copies default across pages/blocks
  const add = await req('/api/admin/languages', J({ code: 'ar', name: 'Arabic', nativeName: 'العربية', dir: 'rtl', flag: '🇸🇦' }, 'test-token'));
  assert.strictEqual(add.status, 201);
  assert.ok(add.body.copiedDocuments > 0);
  ok(`POST /api/admin/languages ar (copied ${add.body.copiedDocuments} docs)`);
  const ar = (await req('/api/page/home?lang=ar')).body;
  assert.ok(ar.blocks.find((b) => b.type === 'pricing').tiers[0].name.length > 0);
  const siteAr = (await req('/api/site?lang=ar')).body;
  assert.strictEqual(siteAr.dir, 'rtl');
  ok('GET home?lang=ar (RTL + content via copy)');

  // Forms
  assert.strictEqual((await req('/api/inquiries', J({ name: 'Test', phone: '070', guests: 20 }))).status, 201);
  assert.strictEqual(await Inquiry.countDocuments(), 1);
  assert.strictEqual((await req('/api/subscribers', J({ email: 'a@b.com', lang: 'sv' }))).status, 201);
  assert.strictEqual(await Subscriber.countDocuments(), 1);
  ok('POST /api/inquiries + /api/subscribers persist');

  // Admin auth enforced
  assert.strictEqual((await req('/api/admin/inquiries')).status, 401);
  assert.strictEqual((await req('/api/admin/inquiries', { headers: { 'x-admin-token': 'test-token' } })).body.length, 1);
  ok('admin endpoints enforce token (401 without, list with)');

  server.close();
  await disconnectDB();
  console.log(`\n✅  All ${pass} checks passed.`);
  process.exit(0);
}

main().catch((err) => { console.error('\n❌  Verification failed:', err); process.exit(1); });
