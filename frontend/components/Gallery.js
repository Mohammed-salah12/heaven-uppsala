'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * Photo gallery / menu images with a lightbox.
 * `images` may be an array of URL strings or objects { url, alt }.
 * `variant`: "grid" (square thumbnails) or "menu" (tall menu images).
 */
export default function Gallery({ images = [], variant = 'grid' }) {
  const items = images.map((i) => (typeof i === 'string' ? { url: i } : i)).filter((i) => i && i.url);
  const [index, setIndex] = useState(-1);
  const open = index >= 0;

  const close = useCallback(() => setIndex(-1), []);
  const prev = useCallback(() => setIndex((i) => (i - 1 + items.length) % items.length), [items.length]);
  const next = useCallback(() => setIndex((i) => (i + 1) % items.length), [items.length]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open, close, prev, next]);

  if (!items.length) return null;

  return (
    <>
      <div className={variant === 'menu' ? 'menu-images' : 'gallery-grid'}>
        {items.map((img, i) => (
          <figure key={i} onClick={() => setIndex(i)}>
            <img src={img.url} alt={img.alt || 'Restaurang Heaven'} loading="lazy" />
          </figure>
        ))}
      </div>

      <div className={`lightbox${open ? ' open' : ''}`} onClick={close}>
        {open && (
          <>
            <button className="close" onClick={close} aria-label="Close">×</button>
            {items.length > 1 && (
              <button className="nav-arrow prev" onClick={(e) => { e.stopPropagation(); prev(); }} aria-label="Previous">‹</button>
            )}
            <img src={items[index].url} alt={items[index].alt || ''} onClick={(e) => e.stopPropagation()} />
            {items.length > 1 && (
              <button className="nav-arrow next" onClick={(e) => { e.stopPropagation(); next(); }} aria-label="Next">›</button>
            )}
          </>
        )}
      </div>
    </>
  );
}
