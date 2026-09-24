/**
 * Renders the events list on the Events page, fetched via getEvents()/
 * buildEvents(). `events` is `null` on every page except "events" (mirrors
 * how <MenuGroups> only renders on the menu pages), and an array — possibly
 * empty — on the events page itself, in which case an honest "no events yet"
 * message is shown instead of fabricated content.
 */
export default function EventsList({ events, ui }) {
  if (!events) return null;
  const t = (k) => (ui && ui[k]) || k;

  return (
    <section className="section events-section">
      <div className="container narrow">
        {events.length === 0 ? (
          <p className="events-empty">{t('events.empty')}</p>
        ) : (
          <ul className="event-list">
            {events.map((ev) => (
              <li className="event-item" key={ev.id}>
                {ev.dateLabel && <span className="event-date">{ev.dateLabel}</span>}
                <div className="event-body">
                  <h3 className="event-title">{ev.title}</h3>
                  {ev.description && <p className="event-desc">{ev.description}</p>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
