'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useLang } from '@/context/LangProvider';
import BookButton from './BookButton';

export default function Nav({ site }) {
  const { ui, nav, languages, lang: active, settings } = site;
  const { setLang } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef(null);
  const t = (k) => ui[k] || k;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e) => { if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false); };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const changeLang = (code) => { setLangOpen(false); setMenuOpen(false); setLang(code); };
  const current = languages.find((l) => l.code === active) || languages[0] || {};

  return (
    <nav className={`nav${scrolled ? ' scrolled' : ''}${menuOpen ? ' menu-open' : ''}`}>
      <div className="container nav-inner">
        <Link className="brand" href="/" onClick={() => setMenuOpen(false)}>
          {settings.logoUrl
            ? <img src={settings.logoUrl} alt="Restaurang Heaven" />
            : <span className="brand-name">Restaurang <b>Heaven</b></span>}
        </Link>

        <div className="nav-links">
          {nav.map((item) => (
            <Link key={item.slug} href={item.path} onClick={() => setMenuOpen(false)}>
              {item.label}
            </Link>
          ))}
        </div>

        <div className="nav-right">
          <div className={`lang${langOpen ? ' open' : ''}`} ref={langRef}>
            <button className="lang-btn" onClick={() => setLangOpen((o) => !o)} aria-label={t('label.language')}>
              <span>{current.flag}</span>
              <span>{(current.code || '').toUpperCase()}</span>
              <span className="chev">▾</span>
            </button>
            <div className="lang-menu">
              {languages.map((l) => (
                <button key={l.code} className={l.code === active ? 'active' : ''} onClick={() => changeLang(l.code)}>
                  <span>{l.flag}</span>
                  <span className="native">{l.nativeName}</span>
                  <span className="en-name">{l.name}</span>
                </button>
              ))}
            </div>
          </div>

          <BookButton className="btn btn-gold book-btn">{t('cta.book')}</BookButton>

          <button className="nav-toggle" aria-label="Menu" onClick={() => setMenuOpen((o) => !o)}>
            <span /><span /><span />
          </button>
        </div>
      </div>
    </nav>
  );
}
