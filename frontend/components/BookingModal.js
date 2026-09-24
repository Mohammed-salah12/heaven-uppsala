'use client';

import { useEffect, useState } from 'react';
import { useBooking } from '../context/BookingProvider';
import { useLang } from '../context/LangProvider';
import EasyTableBookingForm from './EasyTableBookingForm';

/**
 * "How would you like to dine?" modal shown before any booking link is
 * followed. Presents the two dining experiences — the Churrasco Rodizio
 * buffet at the main restaurant, and à la carte at Bakfickan — then, once
 * one is picked, a live availability + reservation form for that experience
 * (calls easyTable directly from the browser — see lib/easytable.js).
 */
export default function BookingModal() {
  const { open, closeBooking, site } = useBooking();
  const { lang } = useLang();
  const [step, setStep] = useState('choose'); // 'choose' | 'rodizio' | 'alacarte'

  useEffect(() => {
    if (!open) setStep('choose');
  }, [open]);

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

  return (
    <div className="booking-overlay" onClick={closeBooking} role="dialog" aria-modal="true" aria-label={t('booking.choose.title', 'How would you like to dine?')}>
      <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
        <button className="booking-close" onClick={closeBooking} aria-label={t('booking.close', 'Close')}>×</button>

        {step === 'choose' && (
          <>
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
                <button type="button" className="btn btn-gold" onClick={() => setStep('rodizio')}>
                  {t('booking.continue', 'Continue to booking')}
                </button>
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
                <button type="button" className="btn btn-outline" onClick={() => setStep('alacarte')}>
                  {t('booking.continue', 'Continue to booking')}
                </button>
              </div>
            </div>
          </>
        )}

        {step === 'rodizio' && (
          <EasyTableBookingForm
            ui={ui}
            settings={settings}
            lang={lang}
            locationKey="rodizio"
            locationLabel={t('booking.rodizio.name', 'Churrasco Rodizio')}
            onBack={() => setStep('choose')}
          />
        )}

        {step === 'alacarte' && (
          <EasyTableBookingForm
            ui={ui}
            settings={settings}
            lang={lang}
            locationKey="alacarte"
            locationLabel={t('booking.alacarte.name', 'À la carte at Bakfickan')}
            onBack={() => setStep('choose')}
          />
        )}
      </div>
    </div>
  );
}
