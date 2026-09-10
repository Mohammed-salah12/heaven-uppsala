import Gallery from './Gallery';
import NewsletterForm from './NewsletterForm';
import BookingForm from './BookingForm';

/** Renders the CTA button referenced by a block. */
function Cta({ cta, ui, settings }) {
  if (!cta) return null;
  if (cta === 'book') {
    return (
      <a className="btn btn-gold" href={settings.bookingUrl} target="_blank" rel="noreferrer" style={{ marginTop: 24 }}>
        {ui['cta.book']}
      </a>
    );
  }
  if (cta === 'dropin') {
    return <a className="btn btn-outline" href="#menu" style={{ marginTop: 24 }}>{ui['cta.dropin']}</a>;
  }
  return null;
}

function asArray(body) {
  if (!body) return [];
  return Array.isArray(body) ? body : [body];
}

function Media({ block, alt }) {
  if (block.video) {
    return (
      <video autoPlay muted loop playsInline poster={block.image || undefined}>
        <source src={block.video} type="video/mp4" />
      </video>
    );
  }
  return block.image ? <img src={block.image} alt={alt || ''} /> : null;
}

export default function Blocks({ blocks = [], site }) {
  const { ui, settings, locations } = site;
  const t = (k) => ui[k] || k;

  return (
    <>
      {blocks.map((block, i) => {
        const alt = i % 2 === 1;
        const id = block.anchor || (block.type === 'menu' ? 'menu' : undefined);
        const cls = `section${alt ? ' alt' : ''}`;

        switch (block.type) {
          case 'split':
            return (
              <section className={cls} id={id} key={i}>
                <div className="container">
                  <div className={`split${block.reverse ? ' reverse' : ''}`}>
                    <div className="split-media"><Media block={block} alt={block.heading} /></div>
                    <div className="split-body">
                      {block.eyebrow && <p className="eyebrow">{block.eyebrow}</p>}
                      <h2>{block.heading}</h2>
                      <p>{block.body}</p>
                      <Cta cta={block.cta} ui={ui} settings={settings} />
                    </div>
                  </div>
                </div>
              </section>
            );

          case 'rich':
            return (
              <section className={cls} id={id} key={i}>
                <div className="container">
                  <div className="rich">
                    {block.eyebrow && <p className="eyebrow">{block.eyebrow}</p>}
                    <h2>{block.heading}</h2>
                    {asArray(block.body).map((p, j) => <p key={j}>{p}</p>)}
                    {block.items && (
                      <ul className="check-list">
                        {block.items.map((it, j) => <li key={j}>{it}</li>)}
                      </ul>
                    )}
                    <Cta cta={block.cta} ui={ui} settings={settings} />
                  </div>
                </div>
              </section>
            );

          case 'pricing':
            return (
              <section className={`${cls} buffet`} id={id || 'buffe'} key={i}>
                <div className="container">
                  <div className="head">
                    <p className="eyebrow center">{t('nav.matmeny')}</p>
                    <h2 className="display">{block.heading}</h2>
                    {block.subheading && <p className="lead" style={{ margin: '0 auto' }}>{block.subheading}</p>}
                  </div>
                  <div className="price-grid">
                    {(block.tiers || []).map((tier, j) => (
                      <div className={`price-card${tier.highlight ? ' highlight' : ''}`} key={j}>
                        {tier.highlight && <span className="tag">{t('label.popular')}</span>}
                        <div className="amount">{tier.price}</div>
                        {tier.unit ? <div className="unit">{tier.unit}</div> : null}
                        <div className="name">{tier.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );

          case 'gallery':
            return (
              <section className={cls} id={id} key={i}>
                <div className="container">
                  <div className="gallery-head">
                    <p className="eyebrow center">{t('hero.badge')}</p>
                    <h2 className="display">{block.heading}</h2>
                  </div>
                  <Gallery images={block.images} variant="grid" />
                </div>
              </section>
            );

          case 'menu':
            return (
              <section className={cls} id={id} key={i}>
                <div className="container">
                  <div className="gallery-head">
                    <p className="eyebrow center">{block.note}</p>
                    <h2 className="display">{block.heading}</h2>
                  </div>
                  <Gallery images={block.images} variant="menu" />
                </div>
              </section>
            );

          case 'faq':
            return (
              <section className={cls} id={id} key={i}>
                <div className="container narrow">
                  <div className="gallery-head">
                    <h2 className="display">{block.heading}</h2>
                  </div>
                  <div className="faq">
                    {(block.items || []).map((it, j) => (
                      <details className="faq-item" key={j}>
                        <summary>{it.q}</summary>
                        {it.a && <p>{it.a}</p>}
                      </details>
                    ))}
                  </div>
                </div>
              </section>
            );

          case 'newsletter':
            return (
              <section className={`${cls} newsletter`} id={id} key={i}>
                <div className="container narrow" style={{ textAlign: 'center' }}>
                  <p className="eyebrow center">{t('footer.tagline')}</p>
                  <h2 className="display">{block.heading}</h2>
                  {block.body && <p className="lead" style={{ margin: '0 auto 26px' }}>{block.body}</p>}
                  <NewsletterForm ui={ui} lang={site.lang} />
                </div>
              </section>
            );

          case 'booking':
            return (
              <section className={cls} id={id} key={i}>
                <div className="container narrow">
                  <div className="gallery-head">
                    <h2 className="display">{block.heading}</h2>
                    {block.note && <p className="lead" style={{ margin: '0 auto' }}>{block.note}</p>}
                  </div>
                  <BookingForm ui={ui} source={block.source} />
                </div>
              </section>
            );

          case 'contact':
            return (
              <section className={cls} id={id || 'kontakt'} key={i}>
                <div className="container">
                  <div className="loc-head">
                    <p className="eyebrow center">{t('label.contact')}</p>
                    <h2 className="display">{block.heading}</h2>
                    {block.body && <p className="lead" style={{ margin: '0 auto' }}>{block.body}</p>}
                  </div>
                  <div className="contact-grid">
                    <div className="contact-info">
                      <div className="contact-line"><span>{t('label.phone')}</span>
                        <a href={`tel:${(settings.phone || '').replace(/\s/g, '')}`}>{settings.phone}</a></div>
                      <div className="contact-line"><span>{t('label.email')}</span>
                        <a href={`mailto:${settings.email}`}>{settings.email}</a></div>
                      <a className="btn btn-gold" href={settings.bookingUrl} target="_blank" rel="noreferrer" style={{ marginTop: 10 }}>
                        {t('cta.book')}
                      </a>
                    </div>
                    <div className="loc-grid">
                      {(locations || []).map((loc) => (
                        <div className="loc-card" key={loc.key}>
                          <h3>{loc.name}</h3>
                          <div className="addr"><span>📍</span><span>{loc.addressLine}</span></div>
                          <div className="hours-title">{loc.hoursTitle}</div>
                          {(loc.hours || []).map((h, k) => (
                            <div className="hours-row" key={k}><span>{h.label}</span><span className="val">{h.value}</span></div>
                          ))}
                          <a className="btn btn-outline" href={loc.mapUrl} target="_blank" rel="noreferrer">{t('label.getDirections')}</a>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            );

          default:
            return null;
        }
      })}
    </>
  );
}
