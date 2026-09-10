import { buildSite, buildPage, buildMenu } from './site';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
// STATIC mode = no backend; content is embedded and resolved in the browser.
// Enabled for the GitHub Pages showcase build.
const STATIC = process.env.NEXT_PUBLIC_STATIC === 'true';

async function getJSON(path) {
  try {
    const res = await fetch(`${API_URL}${path}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error('API error', path, err.message);
    return null;
  }
}

/** Global chrome: languages, settings, ui, nav, locations. */
export function getSite(lang) {
  if (STATIC) return Promise.resolve(buildSite(lang));
  return getJSON(`/site${lang ? `?lang=${encodeURIComponent(lang)}` : ''}`);
}

/** One page's hero + resolved content blocks. */
export function getPage(slug, lang) {
  if (STATIC) return Promise.resolve(buildPage(slug, lang));
  return getJSON(`/page/${encodeURIComponent(slug)}${lang ? `?lang=${encodeURIComponent(lang)}` : ''}`);
}

/** The real, structured menu (dishes/drinks/wines) for "mat-meny" or "drink-meny". */
export function getMenu(page, lang) {
  if (STATIC) return Promise.resolve(buildMenu(page, lang));
  return getJSON(`/menu/${encodeURIComponent(page)}${lang ? `?lang=${encodeURIComponent(lang)}` : ''}`);
}

export { API_URL, STATIC };
