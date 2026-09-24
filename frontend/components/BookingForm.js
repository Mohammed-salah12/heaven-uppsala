'use client';

import { useState } from 'react';
import { API_URL } from '@/lib/api';

export default function BookingForm({ ui, source = 'festvaning' }) {
  const t = (k) => ui[k] || k;
  const [form, setForm] = useState({ name: '', phone: '', email: '', guests: '', date: '', message: '' });
  const [state, setState] = useState('idle');
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setState('loading');
    try {
      const res = await fetch(`${API_URL}/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, source }),
      });
      setState(res.ok ? 'ok' : 'error');
    } catch { setState('error'); }
  }

  if (state === 'ok') return <p className="form-success">{t('form.success')}</p>;

  return (
    <form className="booking-form" onSubmit={submit}>
      <div className="field">
        <label>{t('form.name')}</label>
        <input type="text" required value={form.name} onChange={set('name')} />
      </div>
      <div className="field-row">
        <div className="field">
          <label>{t('form.phone')}</label>
          <input type="tel" value={form.phone} onChange={set('phone')} />
        </div>
        <div className="field">
          <label>{t('form.email')}</label>
          <input type="email" value={form.email} onChange={set('email')} />
        </div>
      </div>
      <div className="field-row">
        <div className="field">
          <label>{t('form.guests')}</label>
          <input type="number" min="1" value={form.guests} onChange={set('guests')} />
        </div>
        <div className="field">
          <label>{t('form.date')}</label>
          <input type="date" value={form.date} onChange={set('date')} />
        </div>
      </div>
      <div className="field">
        <label>{t('form.message')}</label>
        <textarea rows="3" value={form.message} onChange={set('message')} />
      </div>
      <button className="btn btn-gold" type="submit" disabled={state === 'loading'}>{t('form.submit')}</button>
      {state === 'error' && <p className="form-error">{t('form.error')}</p>}
    </form>
  );
}
