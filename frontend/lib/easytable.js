// ─────────────────────────────────────────────────────────────────────────
// easyTable — called directly from the browser (client-only).
//
// There is no backend in this project, so this file talks straight to
// https://api.easytable.com using the API key + place token baked into the
// build via NEXT_PUBLIC_* env vars. That means:
//
//   • The key/token ship inside the JS bundle and are visible to anyone who
//     opens devtools. This tradeoff was chosen deliberately (no backend to
//     hold secrets) — see README "Table booking" for the full writeup.
//   • easyTable's docs never mention browser/CORS support for these
//     endpoints. If the API blocks cross-origin requests, calls from here
//     will fail in the browser even with valid credentials — test a real
//     booking after deploying and see the README fallback plan if so.
//
// Until real credentials are set, isBookingConfigured() returns false and
// the booking form shows a "please call us" fallback instead of erroring.
// ─────────────────────────────────────────────────────────────────────────

const EASYTABLE_BASE_URL = 'https://api.easytable.com';
const LANG_MAP = { sv: 'SE', en: 'EN' };

// Some locations share the same easyTable "place" as another (à la carte at
// Bakfickan uses the Bakfickan token, not its own). Events get the same
// generic override mechanism via NEXT_PUBLIC_EASYTABLE_PLACE_TOKEN_EVENTS —
// see isEventTicketingConfigured() below.
const LOCATION_ALIASES = { alacarte: 'bakfickan' };

function placeTokenFor(location) {
  const raw = String(location || '').toLowerCase();
  const suffix = (LOCATION_ALIASES[raw] || raw).toUpperCase();
  if (suffix) {
    const specific = process.env[`NEXT_PUBLIC_EASYTABLE_PLACE_TOKEN_${suffix}`];
    if (specific) return specific;
  }
  return process.env.NEXT_PUBLIC_EASYTABLE_PLACE_TOKEN || '';
}

export function isBookingConfigured(location) {
  return Boolean(process.env.NEXT_PUBLIC_EASYTABLE_API_KEY) && Boolean(placeTokenFor(location));
}

// An event/course is bookable once BOTH pieces of easyTable setup exist:
// a place token for wherever it lives (reuses an existing location, or a
// dedicated NEXT_PUBLIC_EASYTABLE_PLACE_TOKEN_EVENTS), and — per event, in
// lib/content.js's `events` entries — a `typeId` (the booking type/room in
// easyTable's back-office reserved for this event) and a `productId` (the
// preorder product representing its ticket/course price). Until an event
// has both, its card shows an honest "contact us" fallback instead of a
// buy button that would just fail.
export function isEventTicketingConfigured(event) {
  const et = event && event.easytable;
  if (!et) return false;
  return (
    Boolean(process.env.NEXT_PUBLIC_EASYTABLE_API_KEY) &&
    Boolean(placeTokenFor(et.location)) &&
    Boolean(et.typeId) &&
    Boolean(et.productId)
  );
}

// "2026-09-24" -> "2026/09/24" (easyTable's date format)
function toEasyTableDate(iso) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(iso || ''))) return null;
  return iso.replace(/-/g, '/');
}

// "+46 70-123 45 67" -> 4670123 4567 (easyTable wants a plain integer, country code included)
function toMobile(phone) {
  if (!phone) return undefined;
  const digits = String(phone).replace(/\D/g, '');
  if (!digits) return undefined;
  const n = Number(digits);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

// Defensive reader — easyTable's swagger examples mix camelCase and
// PascalCase across endpoints/versions, so check a few spellings.
function field(obj, ...names) {
  if (!obj) return undefined;
  for (const name of names) {
    if (obj[name] !== undefined) return obj[name];
  }
  return undefined;
}

function extractTimeLabel(item) {
  if (!item) return null;
  if (typeof item === 'string') return item;
  return field(item, 'time', 'Time', 'hour', 'Hour', 'slot', 'Slot') || null;
}

function friendlyError(status) {
  if (status === 401 || status === 403) return 'Booking is temporarily unavailable. Please call us to book.';
  if (status === 400) return 'Please check your booking details and try again.';
  if (status === 422) return 'That time is no longer available — please pick another time.';
  return 'Something went wrong. Please try again or call us to book.';
}

async function easyTableFetch(path, { method = 'GET', location, query, body } = {}) {
  const apiKey = process.env.NEXT_PUBLIC_EASYTABLE_API_KEY;
  const placeToken = placeTokenFor(location);
  if (!apiKey || !placeToken) return { error: 'not_configured' };

  const url = new URL(path, EASYTABLE_BASE_URL);
  if (query) {
    Object.entries(query).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v));
    });
  }

  let res;
  try {
    res = await fetch(url, {
      method,
      headers: {
        'X-Api-Key': apiKey,
        'X-Place-Token': placeToken,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    console.error('easyTable request failed', err && err.message);
    return { error: 'network' };
  }

  let data = null;
  try {
    data = await res.json();
  } catch (_) {
    data = null;
  }

  if (!res.ok) return { error: friendlyError(res.status) };
  return data || {};
}

export async function getAvailability({ date, guests, location, typeId }) {
  const easyDate = toEasyTableDate(date);
  if (!easyDate) return { error: 'Please pick a valid date.' };
  if (!isBookingConfigured(location)) return { error: 'not_configured' };

  const raw = await easyTableFetch('/v2/availability', {
    location,
    query: { date: easyDate, persons: guests, distinct: 1, ...(typeId ? { typeId } : {}) },
  });
  if (raw.error) return raw;

  const times = Array.from(
    new Set(
      (field(raw, 'availabilityTimes', 'AvailabilityTimes', 'availableTimes', 'AvailableTimes') || [])
        .map(extractTimeLabel)
        .filter(Boolean)
    )
  ).sort();

  return {
    dayStatus: field(raw, 'dayStatus', 'DayStatus') || null,
    onlineBooking: field(raw, 'onlineBooking', 'OnlineBooking') || null,
    times,
  };
}

export async function createReservation({ date, time, guests, name, phone, email, message, lang, location }) {
  // POST /v2/bookings wants a plain ISO date ("YYYY-MM-DD") — unlike GET
  // /v2/availability, whose `date` query param wants "YYYY/MM/DD". Sending
  // the slash format here fails with a 400 ("could not be converted to
  // System.Nullable`1[System.DateTime]"), confirmed against the real API.
  const isIsoDate = /^\d{4}-\d{2}-\d{2}$/.test(String(date || ''));
  if (!isIsoDate || !time || !guests || !name || (!phone && !email)) {
    return { error: 'Please fill in every required field.' };
  }
  if (!isBookingConfigured(location)) return { error: 'not_configured' };

  const experienceLabel = location === 'alacarte' ? 'À la carte at Bakfickan' : 'Churrasco Rodizio';
  const body = {
    date,
    time,
    persons: Number(guests),
    name,
    email: email || undefined,
    mobile: toMobile(phone),
    guestNote: message || undefined,
    comment: `Booked via website — ${experienceLabel}`,
    language: LANG_MAP[lang] || undefined,
    onlineBooking: 1,
  };

  const raw = await easyTableFetch('/v2/bookings', { method: 'POST', location, body });
  if (raw.error) return raw;

  return {
    ok: true,
    bookingId: field(raw, 'bookingId', 'BookingId') ?? null,
    date: field(raw, 'date', 'Date') || date,
    arrival: field(raw, 'arrival', 'Arrival') || time,
    paymentUrl: field(raw, 'paymentUrl', 'PaymentUrl') || null,
  };
}

// ─────────────────────────────────────────────────────────────────────────
// Events / tickets / courses
//
// Buying a ticket (or enrolling in a course) is, underneath, ONE easyTable
// booking with a mandatory prepaid "preorder" product attached — the same
// /v2/bookings endpoint createReservation() already uses, just with the
// extra preorder fields included in the same request (easyTable's docs
// confirm POST /v2/bookings accepts PreorderSetupID/ForcePreorderPayment/
// ProductID/Qty/Price directly, no second call needed). easyTable returns
// a paymentUrl the guest must pay to keep the booking; if they don't pay
// in time, easyTable auto-cancels it and the seats free up on their own —
// no inventory bookkeeping needed on this site's side.
//
// ⚠️ Unlike createReservation() above (real-API-verified this project),
// the extra fields here (typeId / forcePreorderPayment / productId / qty)
// are based on easyTable's published API docs but have NOT yet been
// exercised against a real booking. Test a real event purchase — same way
// the table-booking flow was verified — as soon as a real typeId/productId
// exist, and watch for a field-name/casing mismatch the way availableTimes
// and the date format each turned out to be wrong on first try.
// ─────────────────────────────────────────────────────────────────────────

export async function createEventBooking({ event, date, time, qty, name, phone, email, message, lang }) {
  const isIsoDate = /^\d{4}-\d{2}-\d{2}$/.test(String(date || ''));
  const quantity = Number(qty);
  if (!isIsoDate || !time || !quantity || quantity < 1 || !name || (!phone && !email)) {
    return { error: 'Please fill in every required field.' };
  }
  if (!isEventTicketingConfigured(event)) return { error: 'not_configured' };

  const et = event.easytable;
  const body = {
    date,
    time,
    persons: quantity,
    name,
    email: email || undefined,
    mobile: toMobile(phone),
    guestNote: message || undefined,
    comment: `Event booking via website — ${event.title || ''}`.trim(),
    language: LANG_MAP[lang] || undefined,
    onlineBooking: 1,
    typeId: et.typeId,
    forcePreorderPayment: 1,
    productId: et.productId,
    qty: quantity,
    ...(event.price ? { price: Math.round(event.price * quantity) } : {}),
  };

  const raw = await easyTableFetch('/v2/bookings', { method: 'POST', location: et.location, body });
  if (raw.error) return raw;

  return {
    ok: true,
    bookingId: field(raw, 'bookingId', 'BookingId') ?? null,
    paymentUrl: field(raw, 'paymentUrl', 'PaymentUrl') || null,
  };
}
