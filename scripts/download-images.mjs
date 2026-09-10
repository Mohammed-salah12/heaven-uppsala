/**
 * Localise media: download every image AND background video the site references
 * (across all pages) into frontend/public/media, so you can self-host instead of
 * hotlinking the restaurant's Wix CDN.
 *
 * Prereqs: the backend must be running and seeded.
 * Usage:
 *   node scripts/download-images.mjs
 *   API_URL=https://your-api/api node scripts/download-images.mjs
 *
 * After running, point the media fields in the seed/DB at the printed
 * /media/... paths (see README → "Localising the media").
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const API_URL = process.env.API_URL || 'http://localhost:5000/api';
const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'frontend', 'public', 'media');

function nameFor(url, i) {
  const m = url.match(/\/(?:media|video)\/([^/]+?)(~mv2)?(?:f000)?\.(jpg|jpeg|png|webp|mp4)/i);
  const base = m ? m[1] : `media-${i}`;
  const ext = url.includes('/video/') || url.endsWith('.mp4') ? 'mp4'
    : (url.match(/\.(jpg|jpeg|png|webp)/i) || [, 'jpg'])[1];
  return `${base}.${ext}`.replace(/[^a-z0-9._-]/gi, '_');
}

async function collect() {
  const site = await (await fetch(`${API_URL}/site`)).json();
  const urls = new Set();
  if (site.settings?.heroImageUrl) urls.add(site.settings.heroImageUrl);
  if (site.settings?.heroVideoUrl) urls.add(site.settings.heroVideoUrl);
  if (site.settings?.logoUrl) urls.add(site.settings.logoUrl);

  const slugs = site.nav.filter((n) => !n.isAnchor).map((n) => n.slug);
  for (const slug of slugs) {
    const page = await (await fetch(`${API_URL}/page/${slug}`)).json();
    if (page.heroImageUrl) urls.add(page.heroImageUrl);
    if (page.heroVideoUrl) urls.add(page.heroVideoUrl);
    (page.blocks || []).forEach((b) => {
      if (b.image) urls.add(b.image);
      if (b.video) urls.add(b.video);
      (b.images || []).forEach((u) => urls.add(u));
    });
  }
  return [...urls];
}

async function main() {
  console.log(`Collecting media from ${API_URL} …`);
  const list = await collect();
  await mkdir(OUT_DIR, { recursive: true });
  console.log(`Downloading ${list.length} files → frontend/public/media/\n`);

  const mapping = {};
  let i = 0;
  for (const url of list) {
    const name = nameFor(url, i++);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      await writeFile(join(OUT_DIR, name), buf);
      mapping[url] = `/media/${name}`;
      console.log(`  ✓ ${name}  (${(buf.length / 1024).toFixed(0)} kB)`);
    } catch (err) {
      console.warn(`  ✗ ${url}\n     ${err.message}`);
    }
  }
  await writeFile(join(OUT_DIR, 'mapping.json'), JSON.stringify(mapping, null, 2));
  console.log(`\nDone. url→local mapping written to frontend/public/media/mapping.json`);
  console.log('Next: replace the CDN URLs in backend/src/seed/data.js with the /media/... paths and re-seed.');
}

main().catch((e) => { console.error(e); process.exit(1); });
