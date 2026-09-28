'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import EventCard from './EventCard';
import { isPastIsoDate, todayIso } from '@/lib/dates';

const HOME_LIMIT = 3;

/**
 * "What's On" teaser section on the home page — the next few upcoming
 * event/course dates, each as a full EventCard (so a guest can buy tickets
 * right from the home page, not just read about them). Renders nothing at
 * all if there's nothing upcoming, matching the site's honest-empty
 * philosophy elsewhere (no invented placeholder events).
 *
 * Past-date filtering happens only after mount — see EventsList.js for why
 * (avoids a hydration mismatch against the statically prerendered HTML).
 * Before that first effect runs, this renders nothing rather than a
 * flash of not-yet-filtered/possibly-past cards.
 */
export default function UpcomingEvents({ events, ui, lang, settings }) {
  const [today, setToday] = useState(null);

  useEffect(() => {
    setToday(todayIso());
  }, []);

  if (!events || !events.length || today == null) return null;
  const t = (k, fallback) => (ui && ui[k]) || fallback || k;

  const upcoming = events.filter((ev) => !isPastIsoDate(ev.date, today)).slice(0, HOME_LIMIT);
  if (upcoming.length === 0) return null;

  return (
    <section className="section events-home-section">
      <div className="container">
        <div className="experiences-head">
          <p className="eyebrow center">{t('events.section.eyebrow', 'Heaven')}</p>
          <h2 className="display">{t('events.section.title', "What's On")}</h2>
        </div>
        <div className="events-grid">
          {upcoming.map((ev) => (
            <EventCard key={ev.id} event={ev} ui={ui} lang={lang} settings={settings} />
          ))}
        </div>
        <div className="events-home-seeall">
          <Link className="btn btn-outline" href="/events">
            {t('events.section.seeAll', 'See all events')}
          </Link>
        </div>
      </div>
    </section>
  );
}
