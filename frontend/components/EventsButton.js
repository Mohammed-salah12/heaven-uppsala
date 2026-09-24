import Link from 'next/link';

/**
 * Hero button leading straight to the Events page — a single destination,
 * so (unlike BookButton / ExploreMenuButton) it's a plain link, no choice
 * modal needed.
 */
export default function EventsButton({ className = 'btn btn-outline', style, children }) {
  return (
    <Link className={className} style={style} href="/events">
      {children}
    </Link>
  );
}
