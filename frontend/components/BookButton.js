'use client';

import { useBooking } from '../context/BookingProvider';

/**
 * Drop-in replacement for a "Boka bord" <a href={settings.bookingUrl}> link.
 * Renders as the same button styles but opens the booking-choice modal
 * (Churrasco Rodizio vs. à la carte) instead of navigating directly.
 */
export default function BookButton({ className = 'btn btn-gold', style, children }) {
  const { openBooking } = useBooking();
  return (
    <button type="button" className={className} style={style} onClick={openBooking}>
      {children}
    </button>
  );
}
