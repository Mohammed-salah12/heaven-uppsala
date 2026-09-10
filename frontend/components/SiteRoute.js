'use client';

import { useEffect, useState } from 'react';
import { getSite, getPage, STATIC } from '@/lib/api';
import { buildSite, buildPage } from '@/lib/site';
import { useLang } from '@/context/LangProvider';
import PageView from './PageView';

/**
 * Client-rendered page. Reads the active language from context and loads the
 * page content — instantly from embedded data in STATIC mode (GitHub Pages),
 * or from the API otherwise. Re-renders on language change with no navigation.
 */
export default function SiteRoute({ slug }) {
  const { lang } = useLang();
  // In static mode build synchronously so the first paint already has content.
  const [data, setData] = useState(() =>
    STATIC ? { site: buildSite(lang), page: buildPage(slug, lang) } : null
  );
  const [loading, setLoading] = useState(!STATIC);

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!STATIC) setLoading(true);
      const [site, page] = await Promise.all([getSite(lang), getPage(slug, lang)]);
      if (alive) { setData({ site, page }); setLoading(false); }
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

  return <PageView site={data.site} page={data.page} />;
}
