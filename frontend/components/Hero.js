/**
 * Full-screen hero with an optional autoplaying background video
 * (falls back to the poster image). Server component — <video> autoplays
 * natively with muted + playsInline.
 */
export default function Hero({ title, subtitle, badge, image, video, cta }) {
  return (
    <header className="hero" id="home">
      <div className="hero-bg">
        {video ? (
          <video autoPlay muted loop playsInline poster={image || undefined}>
            <source src={video} type="video/mp4" />
          </video>
        ) : image ? (
          <img src={image} alt="" />
        ) : null}
      </div>
      <div className="container hero-inner">
        {badge && <div className="hero-badge">{badge}</div>}
        <h1>{title}</h1>
        {subtitle && <div className="hero-sub">{subtitle}</div>}
        {cta}
      </div>
      <div className="scroll-hint"><span className="line" /></div>
    </header>
  );
}
