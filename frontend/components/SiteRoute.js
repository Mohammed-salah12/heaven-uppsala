'use client';

import { useEffect, useState } from 'react';
import { getSite, getPage, getMenu, getEvents, STATIC } from '@/lib/api';
import { buildSite, buildPage, buildMenu, buildEvents } from '@/lib/site';
import { useLang } from '@/context/LangProvider';
import { useBooking } from '@/context/BookingProvider';
import { useMenuChoice } from '@/context/MenuChoiceProvider';
import PageView from './PageView';

// Pages that show the real, structured menu (dishes/drinks/wines) instead of
// (or alongside) their content blocks.
const MENU_PAGES = ['mat-meny', 'drink-meny'];
const EVENTS_PAGE = 'events';

/**
 * Client-rendered page. Reads the active language from context and loads the
 * page content — instantly from embedded data in STATIC mode (GitHub Pages),
 * or from the API otherwise. Re-renders on language change with no navigation.
 */
export default function SiteRoute({ slug }) {
  const { lang } = useLang();
  const isMenuPage = MENU_PAGES.includes(slug);
  const isEventsPage = slug === EVENTS_PAGE;
  // In static mode build synchronously so the first paint already has content.
  const [data, setData] = useState(() => {
    if (!STATIC) return null;
    const m = isMenuPage ? buildMenu(slug, lang) : null;
    const ev = isEventsPage ? buildEvents(lang) : null;
    return { site: buildSite(lang), page: buildPage(slug, lang), menu: m, events: ev };
  });
  const [loading, setLoading] = useState(!STATIC);
  const { setSite } = useBooking();
  const { setSite: setMenuChoiceSite } = useMenuChoice();

  // Keep the booking-choice and menu-choice modals supplied with the latest
  // localized content (ui strings, nav) regardless of which page/lang is
  // active, so "Boka bord" / "Utforska menyn" always open with fresh data.
  useEffect(() => {
    if (data?.site) { setSite(data.site); setMenuChoiceSite(data.site); }
  }, [data, setSite, setMenuChoiceSite]);

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!STATIC) setLoading(true);
      const [site, page, menu, events] = await Promise.all([
        getSite(lang),
        getPage(slug, lang),
        isMenuPage ? getMenu(slug, lang) : Promise.resolve(null),
        isEventsPage ? getEvents(lang) : Promise.resolve(null),
      ]);
      if (alive) { setData({ site, page, menu, events }); setLoading(false); }
    })();
    return () => { alive = false; };
  }, [slug, lang]);

  if (!data) {
    return (
      <main className="fallback"><div className="box">
        <p className="eyebrow center">Restaurang Heaven</p>
        <h1 className="display">{loading ? 'Loading…' : ''}</h1>
      </div></main>
    );
  }

  return <PageView site={data.site} page={data.page} menu={data.menu} events={data.events} />;
}
