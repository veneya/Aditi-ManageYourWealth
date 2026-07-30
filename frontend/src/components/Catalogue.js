import { useEffect, useState } from 'react';
import axios from 'axios';
import SchemeCard from './SchemeCard';
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';
export default function Catalogue() {
  const [schemes, setSchemes] = useState([]), [selected, setSelected] = useState(null), [loading, setLoading] = useState(true), [error, setError] = useState('');
  useEffect(() => { axios.get(`${API_BASE}/api/schemes`).then(({ data }) => setSchemes(data.schemes || [])).catch(() => setError('The scheme catalogue is unavailable right now.')).finally(() => setLoading(false)); }, []);
  const openScheme = async (id) => { try { const { data } = await axios.get(`${API_BASE}/api/schemes/${id}`); setSelected(data); } catch { setError('We could not load that scheme.'); } };
  if (selected) return <section className="catalogue"><button className="back-link" onClick={() => setSelected(null)}>← All schemes</button><SchemeCard scheme={selected} /></section>;
  if (loading) return <p className="loading-copy">Loading the scheme catalogue…</p>;
  return <section className="catalogue"><p className="lede">Browse every scheme, then open one for eligibility details and a plain-language explanation.</p>{error && <p className="inline-error">{error}</p>}<div className="catalogue-list">{schemes.map((scheme) => <button key={scheme.id} className="catalogue-item" onClick={() => openScheme(scheme.id)}><span>{scheme.badge}</span><strong>{scheme.name}</strong><small>{scheme.category}</small><i>→</i></button>)}</div></section>;
}
