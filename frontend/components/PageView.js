import Nav from './Nav';
import Hero from './Hero';
import Blocks from './Blocks';
import Footer from './Footer';
import DirManager from './DirManager';
import { API_URL } from '@/lib/api';

function Fallback() {
  return (
    <main className="fallback">
      <div className="box">
        <p className="eyebrow center">Restaurang Heaven</p>
        <h1 className="display">Can’t reach the API</h1>
        <p className="lead" style={{ margin: '0 auto 24px' }}>
          The frontend is running, but it couldn’t load content from <code>{API_URL}</code>.
        </p>
        <pre>{`cd backend
cp .env.example .env      # set MONGODB_URI (or USE_MEMORY_DB=true)
npm install && npm run seed && npm run dev`}</pre>
      </div>
    </main>
  );
}

export default function PageView({ site, page }) {
  if (!site || !page) return <Fallback />;
  const { ui, settings, lang, dir } = site;
  const t = (k) => ui[k] || k;
  const isHome = page.slug === 'home';

  const heroCta = (
    <div className="hero-cta">
      <a className="btn btn-gold" href={settings.bookingUrl} target="_blank" rel="noreferrer">{t('cta.book')}</a>
      {isHome && <a className="btn btn-outline" href="#buffe">{t('cta.explore')}</a>}
    </div>
  );

  return (
    <>
      <DirManager lang={lang} dir={dir} />
      <Nav site={site} />
      <Hero
        title={page.title || settings.restaurantName}
        subtitle={page.subtitle}
        badge={isHome ? t('hero.badge') : null}
        image={page.heroImageUrl}
        video={page.heroVideoUrl}
        cta={heroCta}
      />
      <Blocks blocks={page.blocks} site={site} />
      <Footer site={site} />
    </>
  );
}
