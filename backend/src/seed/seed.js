/**
 * Seed script — wipes and repopulates the database with Restaurang Heaven content.
 * Run with:  npm run seed
 */
require('dotenv').config();
const mongoose = require('mongoose');
const { connectDB, disconnectDB } = require('../config/db');

const Language = require('../models/Language');
const Setting = require('../models/Setting');
const Location = require('../models/Location');
const Page = require('../models/Page');
const UiString = require('../models/UiString');
const MenuItem = require('../models/MenuItem');

const data = require('./data');

async function run() {
  await connectDB();
  console.log('🌱  Seeding database…');

  await Promise.all([
    Language.deleteMany({}),
    Setting.deleteMany({}),
    Location.deleteMany({}),
    Page.deleteMany({}),
    UiString.deleteMany({}),
    MenuItem.deleteMany({}),
  ]);

  await Language.insertMany(data.languages);
  await Setting.create(data.setting);
  await Location.insertMany(data.locations);
  await Page.insertMany(data.pages);
  await MenuItem.insertMany(data.menuItems);

  const uiDocs = Object.entries(data.ui).map(([key, translations]) => ({ key, translations }));
  await UiString.insertMany(uiDocs);

  const totalBlocks = data.pages.reduce((n, p) => n + (p.blocks ? p.blocks.length : 0), 0);
  console.log(`✅  Seeded:
   • ${data.languages.length} languages (${data.languages.map((l) => l.code).join(', ')})
   • ${data.pages.length} pages (${data.pages.map((p) => p.slug).join(', ')})
   • ${totalBlocks} content blocks
   • ${data.menuItems.length} menu items (mat-meny + drink-meny)
   • ${data.locations.length} locations
   • ${uiDocs.length} UI strings`);

  await disconnectDB();
  console.log('🎉  Done.');
  process.exit(0);
}

run().catch((err) => {
  console.error('❌  Seed failed:', err);
  process.exit(1);
});

process.on('unhandledRejection', async (e) => {
  console.error(e);
  try { await mongoose.disconnect(); } catch (_) {}
  process.exit(1);
});
