// frontend/src/components/SchemeCard.js

import React, { useState, useRef } from 'react';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// A jargon term with a hover tooltip: dotted plum underline, white popup
// with an arrow, POST /api/explain, falling back to the scheme's own
// stored jargon meaning if the API call fails or is slow.
function JargonTerm({ schemeId, term, fallbackMeaning }) {
  const [open, setOpen] = useState(false);
  const [explanation, setExplanation] = useState(fallbackMeaning);
  const [loading, setLoading] = useState(false);
  const fetchedRef = useRef(false);

  const handleEnter = async () => {
    setOpen(true);
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE}/api/explain`, {
        scheme_id: schemeId,
        term,
      });
      if (response.data?.explanation) {
        setExplanation(response.data.explanation);
      }
    } catch (err) {
      // Fall back silently to the pre-stored meaning already shown.
    } finally {
      setLoading(false);
    }
  };

  return (
    <span
      className="relative inline-block"
      onMouseEnter={handleEnter}
      onMouseLeave={() => setOpen(false)}
      onFocus={handleEnter}
      onBlur={() => setOpen(false)}
      tabIndex={0}
    >
      <span className="underline decoration-dotted decoration-plum/70 underline-offset-4 cursor-help text-plum font-medium">
        {term}
      </span>

      {open && (
        <span className="absolute z-20 bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 pointer-events-none">
          <span className="block rounded-xl bg-white shadow-lg border border-plum/10 px-3 py-2 text-xs leading-snug text-ink/80 text-left">
            <span className="block font-semibold text-plum mb-0.5">{term}</span>
            {loading ? 'Loading…' : explanation}
          </span>
          <span className="block mx-auto h-2 w-2 rotate-45 bg-white border-b border-r border-plum/10 -mt-1" />
        </span>
      )}
    </span>
  );
}

function SchemeCard({ scheme }) {
  const [expanded, setExpanded] = useState(false);
  const [article, setArticle] = useState('');
  const [articleOpen, setArticleOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLearnMore = async () => {
    if (article) {
      setArticleOpen(!articleOpen);
      return;
    }
    setLoading(true);
    try {
      // No `term` = ask for a plain-English summary of the whole scheme.
      const response = await axios.post(`${API_BASE}/api/explain`, {
        scheme_id: scheme.id,
      });
      setArticle(response.data.explanation);
      setArticleOpen(true);
    } catch (err) {
      setArticle('Unable to load more detail right now — please try again.');
      setArticleOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-warm overflow-hidden border-l-4 border-marigold">
      <div
        className="p-4 cursor-pointer hover:bg-cream/50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="text-2xl mr-2">{scheme.badge}</span>
            <span className="font-semibold text-plum">{scheme.name}</span>
            <span className="ml-2 text-sm text-muted-foreground">({scheme.category})</span>
          </div>
          <span className="text-muted-foreground shrink-0">{expanded ? '▲' : '▼'}</span>
        </div>
        <p className="text-ink/60 text-sm mt-1">{scheme.description}</p>
      </div>

      {expanded && (
        <div className="px-4 pb-4 border-t border-plum/5 pt-4">
          <div className="bg-marigold/10 p-3 rounded-lg mb-3 border border-marigold/20">
            <span className="font-semibold text-plum">💰 Benefit:</span> {scheme.benefit}
          </div>

          <div className="mb-3">
            <h4 className="font-semibold text-terracotta">📖 What Problem Does This Solve?</h4>
            <p className="text-ink/70 text-sm">{scheme.problem_solved}</p>
          </div>

          {scheme.jargon && scheme.jargon.length > 0 && (
            <div className="mb-3">
              <h4 className="font-semibold text-terracotta mb-1">🔑 Key Terms</h4>
              <div className="flex flex-wrap gap-x-1 gap-y-2 text-sm">
                {scheme.jargon.map((item, idx) => (
                  <React.Fragment key={item.term}>
                    <JargonTerm
                      schemeId={scheme.id}
                      term={item.term}
                      fallbackMeaning={item.meaning}
                    />
                    {idx < scheme.jargon.length - 1 && <span className="text-ink/30">·</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}

          {scheme.how_to_apply && scheme.how_to_apply.length > 0 && (
            <div className="mb-3">
              <h4 className="font-semibold text-terracotta">📋 How to Apply</h4>
              <ol className="list-decimal list-inside text-sm text-ink/70">
                {scheme.how_to_apply.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
            </div>
          )}

          {scheme.source && (
            <div className="text-xs text-muted-foreground mt-2">
              📌 Source: {scheme.source}
            </div>
          )}

          <button
            onClick={handleLearnMore}
            disabled={loading}
            className="mt-3 text-terracotta font-medium hover:underline disabled:opacity-50 text-sm"
          >
            {loading ? 'Loading...' : '📖 Learn More'}
          </button>

          {articleOpen && article && (
            <div className="mt-3 p-4 bg-cream/50 rounded-lg border border-plum/5 text-sm text-ink/75">
              {article}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SchemeCard;
