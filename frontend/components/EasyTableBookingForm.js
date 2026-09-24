'use client';

import { useEffect, useRef, useState } from 'react';
import { getAvailability, createReservation, isBookingConfigured } from '@/lib/easytable';

const LOCALE_MAP = { sv: 'sv-SE', en: 'en-GB', pt: 'pt-PT' };
const DAYS_AHEAD = 8; // "today" + a week of quick-pick date chips
const SEARCH_DEBOUNCE_MS = 300; // absorbs rapid guest +/- clicks without spamming requests

function isoDate(d) {
  return d.toISOString().slice(0, 10);
}

function buildDateOptions(lang, todayLabel, tomorrowLabel) {
  const locale = LOCALE_MAP[lang] || 'en-GB';
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const out = [];
  for (let i = 0; i < DAYS_AHEAD; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    const label =
      i === 0 ? todayLabel : i === 1 ? tomorrowLabel : d.toLocaleDateString(locale, { weekday: 'short', day: 'numeric', month: 'short' });
    out.push({ iso: isoDate(d), label });
  }
  return out;
}

/**
 * Live availability + reservation form for one dining experience
 * (Churrasco Rodizio or à la carte at Bakfickan). Talks directly to
 * easyTable from the browser — see lib/easytable.js for the tradeoffs.
 *
 * Availability loads automatically — as soon as this opens, and again
 * whenever the date or guest count changes — instead of waiting for a
 * "check availability" click, so the guest sees real open times right
 * away. Results are cached per (date, guests) for the life of this form,
 * so flipping back and forth between recently viewed dates is instant.
 *
 * Phases: browse (date/guests + live slots) -> details (contact info)
 * -> submitting -> success | error.
 */
export default function EasyTableBookingForm({ ui, settings, lang, locationKey, locationLabel, onBack }) {
  const t = (k, fallback) => (ui && ui[k]) || fallback || k;

  const dateOptionsRef = useRef(null);
  if (!dateOptionsRef.current) {
    dateOptionsRef.current = buildDateOptions(lang, t('booking.date.today', 'Today'), t('booking.date.tomorrow', 'Tomorrow'));
  }
  const dateOptions = dateOptionsRef.current;

  const [phase, setPhase] = useState('browse'); // browse -> details -> submitting -> success
  const [date, setDate] = useState(dateOptions[0].iso);
  const [guests, setGuests] = useState(2);
  const [times, setTimes] = useState(null); // null = still loading the first time
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [time, setTime] = useState('');
  const [contact, setContact] = useState({ name: '', phone: '', email: '', message: '' });
  const [submitError, setSubmitError] = useState('');
  const [result, setResult] = useState(null);

  const cacheRef = useRef({});
  const configured = isBookingConfigured(locationKey);

  useEffect(() => {
    if (!configured) return undefined;
    const key = `${date}|${guests}`;
    const cached = cacheRef.current[key];
    if (cached) {
      setTimes(cached);
      setSearchError('');
      setLoading(false);
      return undefined;
    }
    let cancelled = false;
    setLoading(true);
    setSearchError('');
    const timer = setTimeout(async () => {
      const res = await getAvailability({ date, guests, location: locationKey });
      if (cancelled) return;
      setLoading(false);
      if (res.error) {
        setSearchError(res.error === 'not_configured' ? t('booking.fallback.text') : t('booking.error.search'));
        setTimes([]);
        return;
      }
      cacheRef.current[key] = res.times || [];
      setTimes(res.times || []);
    }, SEARCH_DEBOUNCE_MS);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, guests, locationKey, configured]);

  if (!configured) {
    return (
      <div className="booking-fallback">
        {onBack && (
          <button type="button" className="booking-back" onClick={onBack}>
            {t('booking.back', '← Back')}
          </button>
        )}
        <p>{t('booking.fallback.text')}</p>
        {settings?.phone && (
          <a className="booking-fallback-phone" href={`tel:${settings.phone.replace(/\s+/g, '')}`}>
            {settings.phone}
          </a>
        )}
      </div>
    );
  }

  function pickTime(slot) {
    setTime(slot);
    setSubmitError('');
    setPhase('details');
  }

  function setField(k) {
    return (e) => setContact((c) => ({ ...c, [k]: e.target.value }));
  }

  function changeGuests(delta) {
    setGuests((g) => Math.min(20, Math.max(1, g + delta)));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError('');
    if (!contact.name || (!contact.phone && !contact.email)) {
      setSubmitError(t('booking.field.required'));
      return;
    }
    setPhase('submitting');
    const res = await createReservation({
      date,
      time,
      guests,
      name: contact.name,
      phone: contact.phone,
      email: contact.email,
      message: contact.message,
      lang,
      location: locationKey,
    });
    if (res.error || !res.ok) {
      setSubmitError(res.error === 'not_configured' ? t('booking.fallback.text') : t('booking.error.submit'));
      setPhase('details');
      return;
    }
    setResult(res);
    setPhase('success');
  }

  if (phase === 'success') {
    return (
      <div className="booking-success">
        <h3>{t('booking.success')}</h3>
        <p>{t('booking.success.detail')}</p>
        {result?.paymentUrl && (
          <a className="btn btn-gold" href={result.paymentUrl} target="_blank" rel="noreferrer">
            {t('booking.success.payment')}
          </a>
        )}
      </div>
    );
  }

  return (
    <form className="booking-form" onSubmit={phase === 'details' || phase === 'submitting' ? handleSubmit : (e) => e.preventDefault()}>
      {locationLabel && <p className="booking-form-heading">{locationLabel}</p>}

      {(phase === 'browse') && (
        <>
          {onBack && (
            <button type="button" className="booking-back" onClick={onBack}>
              {t('booking.back', '← Back')}
            </button>
          )}
          <div className="booking-date-chips" role="group" aria-label={t('booking.field.date')}>
            {dateOptions.map((opt) => (
              <button
                key={opt.iso}
                type="button"
                className={`booking-date-chip${opt.iso === date ? ' active' : ''}`}
                onClick={() => setDate(opt.iso)}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="field-row booking-browse-controls">
            <div className="field">
              <label>{t('booking.field.date.other', 'Or pick a date')}</label>
              <input type="date" min={dateOptions[0].iso} value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="field">
              <label>{t('booking.field.guests')}</label>
              <div className="booking-guests-stepper">
                <button
                  type="button"
                  aria-label={t('booking.guests.decrease', 'Fewer guests')}
                  onClick={() => changeGuests(-1)}
                  disabled={guests <= 1}
                >
                  −
                </button>
                <span className="booking-guests-count">{guests}</span>
                <button type="button" aria-label={t('booking.guests.increase', 'More guests')} onClick={() => changeGuests(1)}>
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="booking-slots-area" aria-live="polite">
            <p className="booking-form-heading">{t('booking.slots.title')}</p>
            {loading && (
              <div className="booking-slots-loading">
                {Array.from({ length: 8 }).map((_, i) => (
                  <span key={i} className="booking-slot-skeleton" />
                ))}
              </div>
            )}
            {!loading && searchError && <p className="form-error">{searchError}</p>}
            {!loading && !searchError && times && times.length === 0 && (
              <p className="booking-slots-empty">{t('booking.slots.empty')}</p>
            )}
            {!loading && !searchError && times && times.length > 0 && (
              <div className="booking-slots">
                {times.map((slot) => (
                  <button key={slot} type="button" className="booking-slot" onClick={() => pickTime(slot)}>
                    {slot}
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {(phase === 'details' || phase === 'submitting') && (
        <>
          <button type="button" className="booking-back" onClick={() => setPhase('browse')}>
            {t('booking.back')}
          </button>
          <p className="booking-selected-time">
            {t('booking.selected.time')}: <strong>{time}</strong>{' '}
            <button type="button" className="booking-change-time" onClick={() => setPhase('browse')}>
              {t('booking.change.time')}
            </button>
          </p>
          <div className="field">
            <label>{t('booking.field.name')}</label>
            <input type="text" required value={contact.name} onChange={setField('name')} />
          </div>
          <div className="field-row">
            <div className="field">
              <label>{t('booking.field.phone')}</label>
              <input type="tel" value={contact.phone} onChange={setField('phone')} />
            </div>
            <div className="field">
              <label>{t('booking.field.email')}</label>
              <input type="email" value={contact.email} onChange={setField('email')} />
            </div>
          </div>
          <div className="field">
            <label>{t('booking.field.message')}</label>
            <textarea rows="3" value={contact.message} onChange={setField('message')} />
          </div>
          <button className="btn btn-gold" type="submit" disabled={phase === 'submitting'}>
            {phase === 'submitting' ? t('booking.submitting') : t('booking.confirm.button')}
          </button>
          {submitError && <p className="form-error">{submitError}</p>}
        </>
      )}
    </form>
  );
}
