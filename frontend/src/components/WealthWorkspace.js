import { useEffect, useState } from 'react';
import { signInWithGoogle } from '../firebase';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function Auth({ onSignedIn }) {
  const [error, setError] = useState(''), [loading, setLoading] = useState(false);
  const signIn = async () => {
    setError(''); setLoading(true);
    try { const result = await signInWithGoogle(); onSignedIn({ email: result.user.email, token: await result.user.getIdToken() }); }
    catch (err) { setError(err.code === 'auth/unauthorized-domain' ? 'Add localhost to Firebase Authentication → Settings → Authorized domains.' : 'Google sign-in could not be completed.'); }
    finally { setLoading(false); }
  };
  return <section className="auth-page"><div><p className="eyebrow">Your private workspace</p><h1>Make your money<br /><i>feel understood.</i></h1><p className="lede">Sign in to track planning allocations and speak with ADITI Wealth.</p></div><div className="auth-form"><h2>Continue with Google</h2><p className="auth-copy">Use your Google account to enter your planning workspace.</p>{error && <p className="inline-error">{error}</p>}<button className="google-button" onClick={signIn} disabled={loading}><span>G</span>{loading ? 'Opening Google…' : 'Continue with Google'}</button></div></section>;
}

const money = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;

export default function WealthWorkspace() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('aditi-user') || 'null'));
  const [portfolio, setPortfolio] = useState(() => JSON.parse(localStorage.getItem('aditi-portfolio') || '[]'));
  const [messages, setMessages] = useState([{ role: 'bot', text: 'Tell me the investment, principal, expected annual return, and tenure. I will ask for any missing detail before tracking a proposal.' }]);
  const [input, setInput] = useState(''), [stages, setStages] = useState([]), [busy, setBusy] = useState(false);
  useEffect(() => localStorage.setItem('aditi-portfolio', JSON.stringify(portfolio)), [portfolio]);
  const signIn = (nextUser) => { localStorage.setItem('aditi-user', JSON.stringify(nextUser)); setUser(nextUser); };
  const send = async (event) => {
    event.preventDefault(); const message = input.trim(); if (!message || busy) return;
    setMessages((items) => [...items, { role: 'user', text: message }]); setInput(''); setBusy(true); setStages([]);
    try {
      const response = await fetch(`${API_BASE}/api/wealth-agent/stream`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message, portfolio, history: messages.slice(-10).map(({ role, text }) => ({ role, text })) }) });
      if (!response.ok || !response.body) throw new Error();
      const reader = response.body.getReader(), decoder = new TextDecoder(); let buffer = '';
      while (true) {
        const { value, done } = await reader.read(); if (done) break; buffer += decoder.decode(value, { stream: true }); const chunks = buffer.split('\n\n'); buffer = chunks.pop();
        chunks.forEach((chunk) => { const type = chunk.match(/event: (.+)/)?.[1], value = chunk.match(/data: (.+)/)?.[1]; if (!type || !value) return; const data = JSON.parse(value);
          if (type === 'stage') setStages((items) => [...items, data.label]);
          if (type === 'result') { setMessages((items) => [...items, { role: 'bot', text: data.reply, source: data.source }]); if (data.action?.type === 'add') setPortfolio((items) => [...items, { id: Date.now(), ...data.action }]); }
        });
      }
    } catch { setMessages((items) => [...items, { role: 'bot', text: 'The planning service is unavailable. Your tracked portfolio has not changed.', source: 'unavailable' }]); } finally { setBusy(false); }
  };
  if (!user) return <Auth onSignedIn={signIn} />;
  const total = portfolio.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  return <section className="wealth-workspace"><header className="wealth-head"><div><p className="eyebrow">ADITI Wealth / planning only</p><h1>Your money,<br /><i>in one calm view.</i></h1></div><div className="portfolio-total"><small>TRACKED TOTAL</small><strong>{money(total)}</strong><button className="text-button" onClick={() => { localStorage.removeItem('aditi-user'); setUser(null); }}>Sign out</button></div></header><p className="portfolio-note">Tracked allocations are proposals, not linked deposits. ADITI never executes a trade or changes a financial account.</p><div className="wealth-grid"><div className="wealth-chat"><div className="chat-log">{messages.map((item, index) => <div key={index} className={`chat-bubble ${item.role}`}><p>{item.text}</p>{item.source && <small>{item.source === 'ai' ? 'ADITI Wealth AI' : 'LLM unavailable — portfolio unchanged'}</small>}</div>)}{busy && <div className="agent-stages">{stages.length ? stages.map((stage) => <p key={stage}><span className="live-dot" />{stage}</p>) : <p>Connecting to ADITI Wealth…</p>}</div>}</div><form className="chat-form" onSubmit={send}><input className="input-field" value={input} onChange={(e) => setInput(e.target.value)} placeholder="E.g. ₹5,000 at 12% for 5 years in ELSS" /><button className="btn-primary" disabled={busy}>Ask agent</button></form></div><div className="allocation-list"><h2>Tracked allocations</h2>{portfolio.length ? portfolio.map((item) => <article key={item.id}><span>{item.category || 'Investment'} · {item.annual_rate_pct}% p.a. · {item.term_years} years</span><strong>{item.name}</strong><b>{money(item.amount)}</b><small>Projected value {money(item.expected_value)} · gain {money(Number(item.expected_value) - Number(item.amount))}</small></article>) : <div className="empty-state"><h2>Nothing tracked yet</h2><p>Give ADITI Wealth the amount, expected rate, and investment term to record a proposal.</p></div>}</div></div></section>;
}
