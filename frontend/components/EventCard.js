'use client';

import { useState } from 'react';
import { createEventBooking, isEventTicketingConfigured } from '@/lib/easytable';
import { formatDateLabel } from '@/lib/dates';

/**
 * One bookable event occurrence — a single dated ticketed event, or a
 * whole course sold as one package — shown as a card with an inline buy
 * flow. Reuses the exact easyTable mechanism the table-booking form
 * already uses: create a booking with a mandatory prepaid preorder
 * product attached, then send the guest to the returned paymentUrl to
 * pay (see lib/easytable.js's createEventBooking for the full writeup,
 * including the "not yet live-tested" caveat on the preorder fields).
 *
 * `event.easytable` (typeId + productId) is filled in per event in
 * lib/content.js once the events room + ticket/course products exist in
 * easyTable's back-office. Until both are set, this shows an honest
 * "contact us" fallback instead of a buy button that would just fail —
 * same philosophy as the table-booking fallback — UNLESS the event is
 * marked `demo: true` (see the "DEMO DATA" comment in lib/content.js), in
 * which case the full buy flow renders for demo/preview purposes, but
 * submitting it never calls the real easyTable API — it shows a clearly
 * labeled "this is a demo" result instead, so it can never be mistaken
 * for a real booking or a real payment.
 */
export default function EventCard({ event, ui, lang, settings }) {
  const t = (k, fallback) => (ui && ui[k]) || fallback || k;
  const [phase, setPhase] = useState('closed'); // closed -> form -> submitting -> success
  const [qty, setQty] = useState(1);
  const [contact, setContact] = useState({ name: '', phone: '', email: '', message: '' });
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const isDemo = Boolean(event.demo);
  const configured = isDemo || isEventTicketingConfigured(event);
  const isCourse = event.kind === 'course';
  const dateLabel = formatDateLabel(event.date, lang, { weekday: 'short', day: 'numeric', month: 'short' });
  const total = Math.round((event.price || 0) * qty);

  function setField(k) {
    return (e) => setContact((c) => ({ ...c, [k]: e.target.value }));
  }

  function changeQty(delta) {
    setQty((q) => Math.min(20, Math.max(1, q + delta)));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!contact.name || (!contact.phone && !contact.email)) {
      setError(t('booking.field.required'));
      return;
    }
    setPhase('submitting');

    if (isDemo) {
      // No real API call — this is preview/demo content, never presented
      // as a real transaction. See the class comment above.
      await new Promise((resolve) => setTimeout(resolve, 500));
      setResult({ ok: true, demo: true });
      setPhase('success');
      return;
    }

    const res = await createEventBooking({
      event,
      date: event.date,
      time: event.time,
      qty,
      name: contact.name,
      phone: contact.phone,
      email: contact.email,
      message: contact.message,
      lang,
    });
    if (res.error || !res.ok) {
      setError(res.error === 'not_configured' ? t('events.fallback.text') : t('booking.error.submit'));
      setPhase('form');
      return;
    }
    setResult(res);
    setPhase('success');
  }

  return (
    <div className="event-card">
      {event.image && (
        <div className="event-card-media">
          <img src={event.image} alt={event.title} />
        </div>
      )}
      <div className="event-card-body">
        <span className={`tag${isCourse ? ' tag-outline' : ''}`}>
          {isCourse ? t('events.kind.course', 'Course') : t('events.kind.ticketed', 'Event')}
        </span>
        {isDemo && <span className="tag tag-outline event-card-demo-badge">{t('events.demo.badge', 'Demo')}</span>}
        <h3 className="event-card-title">{event.title}</h3>
        <p className="event-card-date">
          {isCourse && event.scheduleLabel ? event.scheduleLabel : dateLabel}
          {event.time ? ` · ${event.time}` : ''}
        </p>
        {event.description && <p className="event-card-desc">{event.description}</p>}
        {event.price > 0 && (
          <p className="event-card-price">
            {event.price} {event.currency || 'SEK'} {isCourse ? t('events.price.perCourse', '/ course') : t('events.price.perTicket', '/ ticket')}
          </p>
        )}

        {!configured && (
          <div className="events-fallback">
            <p>{t('events.fallback.text')}</p>
            {settings?.phone && (
              <a className="booking-fallback-phone" href={`tel:${settings.phone.replace(/\s+/g, '')}`}>
                {settings.phone}
              </a>
            )}
          </div>
        )}

        {configured && phase === 'closed' && (
          <button type="button" className="btn btn-gold sm event-card-cta" onClick={() => setPhase('form')}>
            {isCourse ? t('events.course.buy', 'Book the course') : t('events.buy', 'Buy tickets')}
          </button>
        )}

        {configured && (phase === 'form' || phase === 'submitting') && (
          <form className="booking-form event-card-form" onSubmit={handleSubmit}>
            <div className="field">
              <label>{isCourse ? t('events.qty.course', 'Number of seats') : t('events.qty.tickets', 'Number of tickets')}</label>
              <div className="booking-guests-stepper">
                <button type="button" onClick={() => changeQty(-1)} disabled={qty <= 1} aria-label={t('booking.guests.decrease')}>
                  −
                </button>
                <span className="booking-guests-count">{qty}</span>
                <button type="button" onClick={() => changeQty(1)} aria-label={t('booking.guests.increase')}>
                  +
                </button>
              </div>
            </div>
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
            {event.price > 0 && (
              <p className="event-card-total">
                {t('events.total', 'Total')}: <strong>{total} {event.currency || 'SEK'}</strong>
              </p>
            )}
            <button className="btn btn-gold sm" type="submit" disabled={phase === 'submitting'}>
              {phase === 'submitting' ? t('booking.submitting') : t('events.pay.continue', 'Continue to payment')}
            </button>
            <button type="button" className="booking-back" onClick={() => setPhase('closed')}>
              {t('booking.back')}
            </button>
            {error && <p className="form-error">{error}</p>}
          </form>
        )}

        {phase === 'success' && (
          <div className="event-card-success">
            <p>{t('events.success', 'Almost there!')}</p>
            {result?.demo ? (
              <p className="event-card-desc event-card-demo-note">{t('events.demo.detail')}</p>
            ) : (
              <>
                <p className="event-card-desc">{t('events.success.detail')}</p>
                {result?.paymentUrl && (
                  <a className="btn btn-gold sm" href={result.paymentUrl} target="_blank" rel="noreferrer">
                    {t('booking.success.payment')}
                  </a>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
