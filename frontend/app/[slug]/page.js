import { notFound } from 'next/navigation';
import SiteRoute from '@/components/SiteRoute';

const KNOWN = ['bakfickan', 'konferens', 'festvaning', 'mat-meny', 'drink-meny', 'events'];

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
