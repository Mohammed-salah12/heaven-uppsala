'use client';

import { useState } from 'react';
import { API_URL } from '@/lib/api';

export default function NewsletterForm({ ui, lang }) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState('idle'); // idle | ok | error | loading
  const t = (k) => ui[k] || k;

  async function submit(e) {
    e.preventDefault();
    setState('loading');
    try {
      const res = await fetch(`${API_URL}/subscribers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, lang }),
      });
      setState(res.ok ? 'ok' : 'error');
      if (res.ok) setEmail('');
    } catch { setState('error'); }
  }

  if (state === 'ok') return <p className="form-success">{t('newsletter.success')}</p>;

  return (
    <form className="newsletter-form" onSubmit={submit}>
      <input
        type="email" required placeholder={t('newsletter.placeholder')}
        value={email} onChange={(e) => setEmail(e.target.value)} aria-label={t('newsletter.placeholder')}
      />
      <button className="btn btn-gold" type="submit" disabled={state === 'loading'}>
        {t('newsletter.button')}
      </button>
      {state === 'error' && <p className="form-error">{t('form.error')}</p>}
    </form>
  );
}
