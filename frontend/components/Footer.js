import Link from 'next/link';

export default function Footer({ site }) {
  const { ui, settings, locations, nav } = site;
  const t = (k) => ui[k] || k;

  return (
    <footer className="footer" id="kontakt-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="brand-name">Restaurang <b>Heaven</b></div>
            <p className="tagline">{t('footer.tagline')}</p>
            <div className="social">
              {settings.social?.tiktok && <a href={settings.social.tiktok} target="_blank" rel="noreferrer" aria-label="TikTok">♪</a>}
              {settings.social?.instagram && <a href={settings.social.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">◎</a>}
              {settings.social?.facebook && <a href={settings.social.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">f</a>}
            </div>
          </div>

          <div>
            <h4>{t('footer.menu')}</h4>
            <ul className="footer-nav">
              {nav.map((item) => (
                <li key={item.slug}><Link href={item.path}>{item.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4>{t('label.contact')}</h4>
            <div className="contact-item"><span className="k">{t('label.phone')}</span>
              <a href={`tel:${(settings.phone || '').replace(/\s/g, '')}`}>{settings.phone}</a></div>
            <div className="contact-item"><span className="k">{t('label.email')}</span>
              <a href={`mailto:${settings.email}`}>{settings.email}</a></div>
            {(locations || []).map((loc) => (
              <div className="contact-item" key={loc.key}><span className="k">{loc.name}</span><span>{loc.addressLine}</span></div>
            ))}
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Restaurang Heaven. {t('footer.rights')}.</span>
          <span>Drottninggatan 3 · Uppsala · Sweden</span>
        </div>
      </div>
    </footer>
  );
}
