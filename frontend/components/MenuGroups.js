/**
 * Renders the real, structured menu (dishes/drinks/wines) fetched via
 * getMenu() — replaces the old photographed "PDF" menu images. Items are
 * grouped (buffet, dessert, signature drinks, wine-by-the-glass, …) with the
 * group label, item name, description and price laid out like a real menu.
 */
export default function MenuGroups({ groups }) {
  if (!groups || !groups.length) return null;

  return (
    <section className="section menu-groups-section">
      <div className="container narrow">
        {groups.map((g) => (
          <div className="menu-group" key={g.group}>
            <h3 className="menu-group-title">{g.label}</h3>
            <ul className="menu-item-list">
              {g.items.map((item) => (
                <li className="menu-item" key={item.id}>
                  <div className="menu-item-main">
                    <span className="menu-item-name">{item.name}</span>
                    {item.price && <span className="menu-item-price">{item.price}</span>}
                  </div>
                  {item.description && <p className="menu-item-desc">{item.description}</p>}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
