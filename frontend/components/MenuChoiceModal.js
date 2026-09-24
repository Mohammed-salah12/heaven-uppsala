'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useMenuChoice } from '../context/MenuChoiceProvider';

/**
 * "Which menu would you like to explore?" modal — Mat meny (food) vs. Drink
 * meny (drinks). Visually mirrors BookingModal so the two choice flows feel
 * like one system. Options are real page links (not external), so picking
 * one just navigates there and closes the modal.
 */
export default function MenuChoiceModal() {
  const { open, closeMenuChoice, site } = useMenuChoice();

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') closeMenuChoice(); };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, closeMenuChoice]);

  if (!open || !site) return null;

  const { ui, nav } = site;
  const t = (k, fallback) => ui[k] || fallback || k;
  const matMeny = (nav || []).find((n) => n.slug === 'mat-meny');
  const drinkMeny = (nav || []).find((n) => n.slug === 'drink-meny');

  return (
    <div className="booking-overlay" onClick={closeMenuChoice} role="dialog" aria-modal="true" aria-label={t('menu.choose.title', 'Which menu would you like to explore?')}>
      <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
        <button className="booking-close" onClick={closeMenuChoice} aria-label={t('booking.close', 'Close')}>×</button>

        <p className="eyebrow center">{t('hero.badge')}</p>
        <h2 className="display booking-title">{t('menu.choose.title', 'Which menu would you like to explore?')}</h2>
        <p className="lead booking-subtitle">{t('menu.choose.subtitle', 'Pick food or drinks to see the full menu.')}</p>

        <div className="booking-options">
          <div className="booking-option">
            <span className="tag">{t('cta.foodMenu')}</span>
            <h3>{matMeny ? matMeny.label : t('nav.matmeny')}</h3>
            <p>{t('menu.food.desc')}</p>
            <Link className="btn btn-gold" href={matMeny ? matMeny.path : '/mat-meny'} onClick={closeMenuChoice}>
              {t('menu.continue', 'View menu')}
            </Link>
          </div>

          <div className="booking-option">
            <span className="tag tag-outline">{t('cta.drinkMenu')}</span>
            <h3>{drinkMeny ? drinkMeny.label : t('nav.drinkmeny')}</h3>
            <p>{t('menu.drink.desc')}</p>
            <Link className="btn btn-outline" href={drinkMeny ? drinkMeny.path : '/drink-meny'} onClick={closeMenuChoice}>
              {t('menu.continue', 'View menu')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
