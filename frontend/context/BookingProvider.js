'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import BookingModal from '../components/BookingModal';

const BookingContext = createContext(null);

/**
 * Powers the "Boka bord" choice modal. Every booking button on the site opens
 * this same modal instead of linking straight out, so the guest picks a
 * dining experience (Churrasco Rodizio vs. à la carte at Bakfickan) first.
 * `site` (ui strings + settings + locations) is fed in once by SiteRoute so
 * the modal always has fresh, localized content to render.
 */
export function BookingProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [site, setSite] = useState(null);

  const openBooking = useCallback(() => setOpen(true), []);
  const closeBooking = useCallback(() => setOpen(false), []);

  const value = useMemo(
    () => ({ open, openBooking, closeBooking, site, setSite }),
    [open, site]
  );

  return (
    <BookingContext.Provider value={value}>
      {children}
      <BookingModal />
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used within a BookingProvider');
  return ctx;
}
