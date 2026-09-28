// ─────────────────────────────────────────────────────────────────────────
// Shared, timezone-safe date helpers.
//
// Never build a calendar-date string with `Date#toISOString()` — it
// converts to UTC first, so for any timezone ahead of UTC (Sweden is
// UTC+1/+2) local midnight lands on the previous UTC day and silently
// returns YESTERDAY's date. That exact bug once made the booking form's
// "Idag" chip search availability for the wrong day. Every helper below
// reads the LOCAL calendar fields instead, so it can't happen again.
// ─────────────────────────────────────────────────────────────────────────

const LOCALE_MAP = { sv: 'sv-SE', en: 'en-GB', pt: 'pt-PT' };

export function localeFor(lang) {
  return LOCALE_MAP[lang] || 'en-GB';
}

/** Date -> "YYYY-MM-DD" using LOCAL calendar fields (not UTC). */
export function isoDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Today, as "YYYY-MM-DD" in the visitor's own local timezone. */
export function todayIso() {
  return isoDate(new Date());
}

/** "YYYY-MM-DD" -> a real local-midnight Date (safe to format/compare). */
export function parseIsoDate(iso) {
  const parts = String(iso || '').split('-').map(Number);
  if (parts.length !== 3 || parts.some((n) => !Number.isFinite(n))) return null;
  const [y, m, day] = parts;
  return new Date(y, m - 1, day);
}

/** Plain string comparison is safe for zero-padded "YYYY-MM-DD" values. */
export function isPastIsoDate(iso, todayIsoStr = todayIso()) {
  if (!iso) return false;
  return iso < todayIsoStr;
}

/** Locale-aware "Fri 3 Oct" style label for a "YYYY-MM-DD" date. */
export function formatDateLabel(iso, lang, opts) {
  const d = parseIsoDate(iso);
  if (!d) return '';
  return d.toLocaleDateString(localeFor(lang), opts || { weekday: 'short', day: 'numeric', month: 'short' });
}
