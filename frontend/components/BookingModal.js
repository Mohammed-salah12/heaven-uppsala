'use client';

import { useEffect } from 'react';
import { useBooking } from '../context/BookingProvider';

/**
 * "How would you like to dine?" modal shown before any booking link is
 * followed. Presents the two dining experiences — the Churrasco Rodizio
 * buffet at the main restaurant, and à la carte at Bakfickan — each with its
 * own booking link, falling back to the shared bookingUrl when a dedicated
 * one hasn't been set for Bakfickan yet.
 */
export default function BookingModal() {
  const { open, closeBooking, site } = useBooking();

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') closeBooking(); };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, closeBooking]);

  if (!open || !site) return null;

  const { ui, settings, locations } = site;
  const t = (k, fallback) => ui[k] || fallback || k;

  const rodizioLoc = (locations || []).find((l) => l.key === 'main');
  const alacarteLoc = (locations || []).find((l) => l.key === 'bakfickan');
  const rodizioUrl = settings.bookingUrl;
  const alacarteUrl = settings.bookingUrlAlaCarte || settings.bookingUrl;

  return (
    <div className="booking-overlay" onClick={closeBooking} role="dialog" aria-modal="true" aria-label={t('booking.choose.title', 'How would you like to dine?')}>
      <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
        <button className="booking-close" onClick={closeBooking} aria-label={t('booking.close', 'Close')}>×</button>

        <p className="eyebrow center">{t('label.contact')}</p>
        <h2 className="display booking-title">{t('booking.choose.title', 'How would you like to dine?')}</h2>
        <p className="lead booking-subtitle">{t('booking.choose.subtitle', 'Choose an experience to continue to booking.')}</p>

        <div className="booking-options">
          <div className="booking-option">
            <span className="tag">{t('booking.rodizio.tag', 'All-you-can-eat')}</span>
            <h3>{t('booking.rodizio.name', 'Churrasco Rodizio')}</h3>
            <p>{t('booking.rodizio.desc')}</p>
            {rodizioLoc && (
              <div className="booking-option-meta">
                <span>{rodizioLoc.name}</span>
                <span>{rodizioLoc.addressLine}</span>
              </div>
            )}
            <a className="btn btn-gold" href={rodizioUrl} target="_blank" rel="noreferrer" onClick={closeBooking}>
              {t('booking.continue', 'Continue to booking')}
            </a>
          </div>

          <div className="booking-option">
            <span className="tag tag-outline">{t('booking.alacarte.tag', 'À la carte')}</span>
            <h3>{t('booking.alacarte.name', 'À la carte at Bakfickan')}</h3>
            <p>{t('booking.alacarte.desc')}</p>
            {alacarteLoc && (
              <div className="booking-option-meta">
                <span>{alacarteLoc.name}</span>
                <span>{alacarteLoc.addressLine}</span>
              </div>
            )}
            <a className="btn btn-outline" href={alacarteUrl} target="_blank" rel="noreferrer" onClick={closeBooking}>
              {t('booking.continue', 'Continue to booking')}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
