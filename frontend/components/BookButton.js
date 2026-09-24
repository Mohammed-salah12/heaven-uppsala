'use client';

import { useBooking } from '../context/BookingProvider';

/**
 * "Boka bord" button. Renders as the usual button styles but opens the
 * booking modal (choose Churrasco Rodizio vs. à la carte, then a live
 * easyTable availability + reservation form) instead of linking out.
 */
export default function BookButton({ className = 'btn btn-gold', style, children }) {
  const { openBooking } = useBooking();
  return (
    <button type="button" className={className} style={style} onClick={openBooking}>
      {children}
    </button>
  );
}
