'use client';

import { useState, useEffect, useCallback } from 'react';
import { API_URL } from '@/lib/api';

const TABS = ['Inquiries', 'Subscribers', 'Menu', 'Languages', 'Translations'];

export default function Admin() {
  const [token, setToken] = useState('');
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState('Inquiries');
  const [data, setData] = useState({});
  const [status, setStatus] = useState('');

  // restore a previously used token
  useEffect(() => {
    try {
      const t = sessionStorage.getItem('heaven_admin_token');
      if (t) { setToken(t); setAuthed(true); }
    } catch (_) {}
  }, []);

  const authFetch = useCallback(async (path, opts = {}) => {
    return fetch(`${API_URL}${path}`, {
      ...opts,
      headers: { 'Content-Type': 'application/json', 'x-admin-token': token, ...(opts.headers || {}) },
    });
  }, [token]);

  const load = useCallback(async () => {
    setStatus('');
    try {
      if (tab === 'Inquiries') {
        const r = await authFetch('/admin/inquiries');
        if (r.status === 401) { setAuthed(false); setStatus('Invalid admin token.'); return; }
        const j = await r.json();
        setData((d) => ({ ...d, inquiries: j }));
      } else if (tab === 'Subscribers') {
        const r = await authFetch('/admin/subscribers');
        if (r.status === 401) { setAuthed(false); return; }
        const j = await r.json();
        setData((d) => ({ ...d, subscribers: j }));
      } else if (tab === 'Languages') {
        const r = await fetch(`${API_URL}/languages`);
        const j = await r.json();
        setData((d) => ({ ...d, languages: j }));
      } else if (tab === 'Menu') {
        const r = await authFetch('/admin/menu-items');
        if (r.status === 401) { setAuthed(false); return; }
        const j = await r.json();
        setData((d) => ({ ...d, menuItems: j }));
      }
    } catch (e) { setStatus('Could not reach the API.'); }
  }, [tab, authFetch]);

  useEffect(() => { if (authed) load(); }, [authed, tab, load]);

  function unlock(e) {
    e.preventDefault();
    try { sessionStorage.setItem('heaven_admin_token', token); } catch (_) {}
    setAuthed(true);
  }
  function lock() {
    try { sessionStorage.removeItem('heaven_admin_token'); } catch (_) {}
    setAuthed(false); setToken('');
  }

  if (!authed) {
    return (
      <div className="admin-gate">
        <form className="admin-card" onSubmit={unlock}>
          <div className="admin-brand">Restaurang <b>Heaven</b></div>
          <h1>Admin dashboard</h1>
          <p className="muted">Enter your admin token (the <code>ADMIN_TOKEN</code> from the backend <code>.env</code>).</p>
          <input type="password" placeholder="Admin token" value={token} onChange={(e) => setToken(e.target.value)} autoFocus />
          <button className="btn btn-gold" type="submit">Unlock</button>
          {status && <p className="admin-error">{status}</p>}
        </form>
      </div>
    );
  }

  return (
    <div className="admin">
      <header className="admin-top">
        <div className="admin-brand">Restaurang <b>Heaven</b> · Admin</div>
        <div className="admin-top-right">
          <a href="/" className="muted-link">← Back to site</a>
          <button className="btn btn-outline sm" onClick={lock}>Lock</button>
        </div>
      </header>

      <nav className="admin-tabs">
        {TABS.map((t) => (
          <button key={t} className={t === tab ? 'active' : ''} onClick={() => setTab(t)}>{t}</button>
        ))}
      </nav>

      <main className="admin-main">
        {status && <p className="admin-error">{status}</p>}

        {tab === 'Inquiries' && <Inquiries rows={data.inquiries} onRefresh={load} />}
        {tab === 'Subscribers' && <Subscribers rows={data.subscribers} onRefresh={load} />}
        {tab === 'Menu' && <MenuItems rows={data.menuItems} authFetch={authFetch} reload={load} setStatus={setStatus} />}
        {tab === 'Languages' && <Languages rows={data.languages} authFetch={authFetch} reload={load} setStatus={setStatus} />}
        {tab === 'Translations' && <Translations authFetch={authFetch} setStatus={setStatus} />}
      </main>
    </div>
  );
}

function fmtDate(s) { try { return new Date(s).toLocaleString(); } catch { return s || ''; } }

function Inquiries({ rows, onRefresh }) {
  return (
    <section>
      <div className="admin-head"><h2>Booking inquiries</h2><button className="btn btn-outline sm" onClick={onRefresh}>Refresh</button></div>
      {!rows ? <p className="muted">Loading…</p> : rows.length === 0 ? <p className="muted">No inquiries yet. Submit the Festvåning form to see one here.</p> : (
        <div className="table-wrap"><table>
          <thead><tr><th>Received</th><th>Name</th><th>Phone</th><th>Email</th><th>Guests</th><th>Date</th><th>Message</th><th>Source</th></tr></thead>
          <tbody>{rows.map((r) => (
            <tr key={r._id}><td>{fmtDate(r.createdAt)}</td><td>{r.name}</td><td>{r.phone}</td><td>{r.email}</td>
              <td>{r.guests ?? ''}</td><td>{r.date}</td><td className="msg">{r.message}</td><td>{r.source}</td></tr>
          ))}</tbody>
        </table></div>
      )}
    </section>
  );
}

function Subscribers({ rows, onRefresh }) {
  return (
    <section>
      <div className="admin-head"><h2>Newsletter subscribers</h2><button className="btn btn-outline sm" onClick={onRefresh}>Refresh</button></div>
      {!rows ? <p className="muted">Loading…</p> : rows.length === 0 ? <p className="muted">No subscribers yet.</p> : (
        <div className="table-wrap"><table>
          <thead><tr><th>Subscribed</th><th>Email</th><th>Language</th></tr></thead>
          <tbody>{rows.map((r) => (<tr key={r._id}><td>{fmtDate(r.createdAt)}</td><td>{r.email}</td><td>{r.lang}</td></tr>))}</tbody>
        </table></div>
      )}
    </section>
  );
}

function Languages({ rows, authFetch, reload, setStatus }) {
  const [form, setForm] = useState({ code: '', name: '', nativeName: '', dir: 'ltr', flag: '' });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function add(e) {
    e.preventDefault();
    const r = await authFetch('/admin/languages', { method: 'POST', body: JSON.stringify(form) });
    const b = await r.json();
    if (r.ok) { setStatus(`Added ${form.code} (copied ${b.copiedDocuments} items from default).`); setForm({ code: '', name: '', nativeName: '', dir: 'ltr', flag: '' }); reload(); }
    else setStatus(b.error || 'Failed to add language.');
  }
  async function toggle(code, enabled) {
    const r = await authFetch(`/admin/languages/${code}`, { method: 'PATCH', body: JSON.stringify({ enabled: !enabled }) });
    if (r.ok) reload(); else setStatus('Update failed.');
  }

  return (
    <section>
      <div className="admin-head"><h2>Languages</h2></div>
      {!rows ? <p className="muted">Loading…</p> : (
        <div className="chips">{rows.map((l) => (
          <div className="chip" key={l.code}>
            <span>{l.flag} {l.nativeName} <span className="muted">({l.code})</span> {l.dir === 'rtl' && <em>RTL</em>} {l.isDefault && <em>default</em>}</span>
            {!l.isDefault && <button className="btn btn-outline sm" onClick={() => toggle(l.code, l.enabled)}>{l.enabled ? 'Disable' : 'Enable'}</button>}
          </div>
        ))}</div>
      )}
      <form className="admin-form" onSubmit={add}>
        <h3>Add a language</h3>
        <p className="muted">The default language's content is copied across every page so the new language works immediately, then you translate it.</p>
        <div className="grid4">
          <input placeholder="Code (e.g. ar)" value={form.code} onChange={set('code')} required />
          <input placeholder="Name (English, e.g. Arabic)" value={form.name} onChange={set('name')} required />
          <input placeholder="Native name (e.g. العربية)" value={form.nativeName} onChange={set('nativeName')} required />
          <input placeholder="Flag emoji (e.g. 🇸🇦)" value={form.flag} onChange={set('flag')} />
        </div>
        <div className="row">
          <label>Direction
            <select value={form.dir} onChange={set('dir')}><option value="ltr">Left-to-right</option><option value="rtl">Right-to-left</option></select>
          </label>
          <button className="btn btn-gold" type="submit">Add language</button>
        </div>
      </form>
    </section>
  );
}

const MENU_LANGS = ['sv', 'en', 'pt'];
const EMPTY_MENU_FORM = {
  page: 'mat-meny', group: '', groupOrder: 1, order: 1, price: '',
  translations: { sv: { name: '', description: '' }, en: { name: '', description: '' }, pt: { name: '', description: '' } },
};

function MenuItems({ rows, authFetch, reload, setStatus }) {
  const [form, setForm] = useState(EMPTY_MENU_FORM);
  const [editingId, setEditingId] = useState(null);

  function startAdd() { setForm(EMPTY_MENU_FORM); setEditingId(null); }
  function startEdit(item) {
    setEditingId(item._id);
    setForm({
      page: item.page, group: item.group, groupOrder: item.groupOrder || 0, order: item.order || 0, price: item.price || '',
      translations: MENU_LANGS.reduce((acc, l) => {
        const t = (item.translations && item.translations[l]) || {};
        acc[l] = { name: t.name || '', description: t.description || '' };
        return acc;
      }, {}),
    });
    window.scrollTo({ top: document.querySelector('.admin-form')?.offsetTop - 90 || 0, behavior: 'smooth' });
  }
  const setField = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const setLangField = (lang, k) => (e) => setForm((f) => ({ ...f, translations: { ...f.translations, [lang]: { ...f.translations[lang], [k]: e.target.value } } }));

  async function save(e) {
    e.preventDefault();
    const body = { ...form, groupOrder: Number(form.groupOrder) || 0, order: Number(form.order) || 0 };
    const r = editingId
      ? await authFetch(`/admin/menu-items/${editingId}`, { method: 'PUT', body: JSON.stringify(body) })
      : await authFetch('/admin/menu-items', { method: 'POST', body: JSON.stringify(body) });
    const b = await r.json();
    if (r.ok) { setStatus(editingId ? 'Menu item updated.' : 'Menu item added.'); startAdd(); reload(); }
    else setStatus(b.error || 'Save failed.');
  }
  async function remove(id) {
    if (!window.confirm('Delete this menu item?')) return;
    const r = await authFetch(`/admin/menu-items/${id}`, { method: 'DELETE' });
    if (r.ok) { if (editingId === id) startAdd(); reload(); } else setStatus('Delete failed.');
  }

  return (
    <section>
      <div className="admin-head"><h2>Menu items</h2><button className="btn btn-outline sm" onClick={reload}>Refresh</button></div>
      <p className="muted">
        The real dishes, drinks and wines shown on Mat meny / Drink meny — grouped by <code>group</code> (e.g. <code>buffet</code>, <code>wineGlassRed</code>).
        A group's display heading is set once as a UI string under <code>menu.group.&lt;group&gt;</code> in the Translations tab.
      </p>
      {!rows ? <p className="muted">Loading…</p> : (
        <div className="table-wrap"><table>
          <thead><tr><th>Page</th><th>Group</th><th>Order</th><th>Name (sv)</th><th>Price</th><th></th></tr></thead>
          <tbody>{rows.map((r) => (
            <tr key={r._id}>
              <td>{r.page}</td><td>{r.group}</td><td>{r.groupOrder}.{r.order}</td>
              <td>{(r.translations && r.translations.sv && r.translations.sv.name) || ''}</td>
              <td>{r.price}</td>
              <td style={{ whiteSpace: 'nowrap' }}>
                <button className="btn btn-outline sm" onClick={() => startEdit(r)}>Edit</button>{' '}
                <button className="btn btn-outline sm" onClick={() => remove(r._id)}>Delete</button>
              </td>
            </tr>
          ))}</tbody>
        </table></div>
      )}

      <form className="admin-form" onSubmit={save}>
        <h3>{editingId ? 'Edit menu item' : 'Add a menu item'}</h3>
        <div className="grid4">
          <label>Page
            <select value={form.page} onChange={setField('page')}>
              <option value="mat-meny">mat-meny</option><option value="drink-meny">drink-meny</option>
            </select>
          </label>
          <input placeholder="Group key (e.g. buffet)" value={form.group} onChange={setField('group')} required />
          <input type="number" placeholder="Group order" value={form.groupOrder} onChange={setField('groupOrder')} />
          <input type="number" placeholder="Order in group" value={form.order} onChange={setField('order')} />
        </div>
        <input placeholder='Price (free text, e.g. "159 kr" or "99/395 kr")' value={form.price} onChange={setField('price')} />

        {MENU_LANGS.map((l) => (
          <div key={l} className="row" style={{ alignItems: 'flex-start' }}>
            <label style={{ flex: 1 }}>{`Name (${l})`}
              <input value={form.translations[l].name} onChange={setLangField(l, 'name')} />
            </label>
            <label style={{ flex: 2 }}>{`Description (${l})`}
              <textarea rows="2" value={form.translations[l].description} onChange={setLangField(l, 'description')} />
            </label>
          </div>
        ))}

        <div className="row">
          <button className="btn btn-gold" type="submit">{editingId ? 'Save changes' : 'Add menu item'}</button>
          {editingId && <button className="btn btn-outline" type="button" onClick={startAdd}>Cancel edit</button>}
        </div>
      </form>
    </section>
  );
}

function Translations({ authFetch, setStatus }) {
  const [f, setF] = useState({ model: 'ui', key: '', lang: '', value: '' });
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));
  const isJson = f.model === 'location' || f.model === 'page';

  async function save(e) {
    e.preventDefault();
    let value = f.value;
    if (isJson) {
      try { value = JSON.parse(f.value); }
      catch { setStatus('Value must be valid JSON for a location or page.'); return; }
    }
    const r = await authFetch(`/admin/translations/${f.model}/${encodeURIComponent(f.key)}`, {
      method: 'PUT', body: JSON.stringify({ lang: f.lang, value }),
    });
    const b = await r.json();
    setStatus(r.ok ? `Saved ${f.model}/${f.key} (${f.lang}).` : (b.error || 'Save failed.'));
  }

  return (
    <section>
      <div className="admin-head"><h2>Edit a translation</h2></div>
      <p className="muted">
        Set one translation. For <code>ui</code> the key is a string key like <code>cta.book</code> and the value is plain text.
        For <code>location</code> (key = <code>main</code>/<code>bakfickan</code>) or <code>page</code> (key = the slug, e.g. <code>home</code>)
        the value is JSON, e.g. <code>{'{'}"title":"…","subtitle":"…"{'}'}</code>.
      </p>
      <form className="admin-form" onSubmit={save}>
        <div className="grid4">
          <label>Model
            <select value={f.model} onChange={set('model')}>
              <option value="ui">ui</option><option value="location">location</option><option value="page">page</option>
            </select>
          </label>
          <input placeholder="Key (e.g. cta.book)" value={f.key} onChange={set('key')} required />
          <input placeholder="Language code (e.g. en)" value={f.lang} onChange={set('lang')} required />
        </div>
        <textarea placeholder={isJson ? '{"title":"…","subtitle":"…"}' : 'Translated text'} rows="4" value={f.value} onChange={set('value')} />
        <button className="btn btn-gold" type="submit">Save translation</button>
      </form>
    </section>
  );
}
