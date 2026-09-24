'use client';

import { useEffect } from 'react';

/**
 * Syncs <html lang> and <html dir> with the active language so that
 * right-to-left languages (e.g. Arabic) added later render correctly.
 */
export default function DirManager({ lang, dir }) {
  useEffect(() => {
    if (lang) document.documentElement.lang = lang;
    document.documentElement.dir = dir || 'ltr';
  }, [lang, dir]);
  return null;
}
