'use client';

import { useEffect, useState } from 'react';
import EventCard from './EventCard';
import { isPastIsoDate, todayIso } from '@/lib/dates';

/**
 * Full listing on the Events page. `events` is the flat list of cards from
 * buildEvents()/getEvents() — `null` on every page except "events" (mirrors
 * how <MenuGroups> only renders on the menu pages), and an array —
 * possibly empty — on the events page itself, in which case an honest
 * "no events yet" message is shown instead of fabricated content.
 *
 * Past dates are filtered out only AFTER mount, not during the initial
 * render. This page is part of the static export's prerendered HTML, and
 * "today" at build time can differ from "today" when a visitor loads the
 * page days or weeks later — filtering during the very first render would
 * make server and client output disagree (a React hydration mismatch).
 * Filtering right after mount avoids that; the list settles a moment later.
 */
export default function EventsList({ events, ui, lang, settings }) {
  const [today, setToday] = useState(null);

  useEffect(() => {
    setToday(todayIso());
  }, []);

  if (!events) return null;
  const t = (k) => (ui && ui[k]) || k;
  const upcoming = today == null ? events : events.filter((ev) => !isPastIsoDate(ev.date, today));

  return (
    <section className="section events-section">
      <div className="container narrow">
        {upcoming.length === 0 ? (
          <p className="events-empty">{t('events.empty')}</p>
        ) : (
          <div className="events-grid">
            {upcoming.map((ev) => (
              <EventCard key={ev.id} event={ev} ui={ui} lang={lang} settings={settings} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
