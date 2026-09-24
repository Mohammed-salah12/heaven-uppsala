import Nav from './Nav';
import Hero from './Hero';
import Blocks from './Blocks';
import Footer from './Footer';
import DirManager from './DirManager';
import BookButton from './BookButton';
import ExploreMenuButton from './ExploreMenuButton';
import EventsButton from './EventsButton';
import MenuGroups from './MenuGroups';
import EventsList from './EventsList';

function Fallback() {
  return (
    <main className="fallback">
      <div className="box">
        <p className="eyebrow center">Restaurang Heaven</p>
        <h1 className="display">Couldn’t load the page</h1>
        <p className="lead" style={{ margin: '0 auto 24px' }}>
          This site is client-only and its content is embedded at build time
          — make sure <code>NEXT_PUBLIC_STATIC=true</code> is set (the scripts
          in <code>frontend/package.json</code> already set it) and rebuild.
        </p>
      </div>
    </main>
  );
}

export default function PageView({ site, page, menu, events }) {
  if (!site || !page) return <Fallback />;
  const { ui, settings, lang, dir } = site;
  const t = (k) => ui[k] || k;
  const isHome = page.slug === 'home';

  const heroCta = (
    <div className="hero-cta">
      <BookButton>{t('cta.book')}</BookButton>
      {isHome && <ExploreMenuButton>{t('cta.explore')}</ExploreMenuButton>}
      {isHome && <EventsButton>{t('cta.events')}</EventsButton>}
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
      <MenuGroups groups={menu} />
      <EventsList events={events} ui={ui} />
      <Blocks blocks={page.blocks} site={site} />
      <Footer site={site} />
    </>
  );
}
