'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const LangContext = createContext({ lang: 'sv', setLang: () => {} });

export function LangProvider({ children, defaultLang = 'sv' }) {
  const [lang, setLangState] = useState(defaultLang);

  // Restore a saved choice on first mount (client only).
  useEffect(() => {
    try {
      const stored = localStorage.getItem('heaven_lang');
      if (stored) setLangState(stored);
    } catch (_) {}
  }, []);

  const setLang = (code) => {
    setLangState(code);
    try { localStorage.setItem('heaven_lang', code); } catch (_) {}
  };

  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}
