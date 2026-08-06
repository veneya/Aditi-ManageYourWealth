// Latest financial scheme news — fetched from the backend RSS aggregator.
import { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const SOURCE_STYLE = {
  PIB: { label: 'PIB', className: 'source-pib' },
  RBI: { label: 'RBI', className: 'source-rbi' },
  Finshots: { label: 'FINSHOTS', className: 'source-finshots' },
};

function stampFor(item, index) {
  if (item.published) {
    const date = new Date(item.published);
    if (!Number.isNaN(date.getTime())) {
      return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short' }).format(date);
    }
  }
  return String(index + 1).padStart(2, '0');
}

export default function LatestNews() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let mounted = true;
    axios
      .get(`${API_BASE}/api/news`, { timeout: 12000 })
      .then(({ data }) => {
        if (!mounted) return;
        setItems(data.news || []);
        setStatus(data.news?.length ? 'ready' : 'empty');
      })
      .catch(() => mounted && setStatus('offline'));
    return () => { mounted = false; };
  }, []);

  return (
    <section className="news-band" aria-labelledby="news-heading">
      <div className="news-head">
        <div>
          <h2 id="news-heading">Latest <i>from the ground.</i></h2>
          <p>Press releases and explainers from the bodies that fund India's schemes.</p>
        </div>
        <span className="news-pulse" aria-hidden="true"><i />LIVE FEED</span>
      </div>

      {status === 'loading' && (
        <div className="news-grid" aria-busy="true">
          {[0, 1, 2, 3, 4, 5].map((key) => (
            <p className="news-skeleton" key={key} />
          ))}
        </div>
      )}

      {status === 'ready' && (
        <div className="news-grid">
          {items.map((item) => {
            const source = SOURCE_STYLE[item.source] || { label: item.source || 'NEWS', className: 'source-pib' };
            const summary = item.summary && item.summary !== 'No summary available.' ? item.summary : '';
            return (
              <a className="news-card" href={item.link} target="_blank" rel="noopener noreferrer" key={item.hash || item.link}>
                <span className={`news-source ${source.className}`}>{source.label}</span>
                <strong>{item.title}</strong>
                <span className="news-meta"><i>{stampFor(item, items.indexOf(item))}</i>{summary && <span>{summary}</span>}</span>
              </a>
            );
          })}
        </div>
      )}

      {status === 'empty' && <p className="news-note">No fresh updates right now — check back soon.</p>}
      {status === 'offline' && (
        <p className="news-note">
          Live feed is resting. <a href="https://pib.gov.in/" target="_blank" rel="noopener noreferrer">Browse PIB directly →</a>
        </p>
      )}
    </section>
  );
}
