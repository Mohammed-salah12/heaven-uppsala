import { notFound } from 'next/navigation';
import SiteRoute from '@/components/SiteRoute';

const KNOWN = [
  'bakfickan', 'konferens', 'festvaning', 'mat-meny', 'drink-meny', 'events',
  // Experience subpages linked from the home page's experiences section.
  'churrascaria', 'restaurant', 'next-to-heaven', 'lounge-cocktailbar', 'club-heaven', 'atelier',
];

// Pre-render these routes for the static (GitHub Pages) export.
export function generateStaticParams() {
  return KNOWN.map((slug) => ({ slug }));
}

export const dynamicParams = false;

export default function DynamicPage({ params }) {
  const { slug } = params;
  if (!KNOWN.includes(slug)) notFound();
  return <SiteRoute slug={slug} />;
}
