// frontend/src/components/SchemeCard.js

import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function SchemeCard({ scheme, compact = false }) {
  const [expanded, setExpanded] = useState(false);
  const [article, setArticle] = useState('');
  const [articleOpen, setArticleOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  if (compact) {
    return (
      <div className="card p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-medium text-teal-600 uppercase">{scheme.category}</span>
            <h4 className="font-semibold text-gray-900 mt-1">{scheme.name}</h4>
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{scheme.description}</p>
          </div>
          <span className="text-2xl">{scheme.badge}</span>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-100">
          <span className="text-sm font-medium text-teal-600">Key Benefit</span>
          <p className="text-sm text-gray-600">{scheme.benefit}</p>
        </div>
      </div>
    );
  }

  const handleLearnMore = async () => {
    if (article) {
      setArticleOpen(!articleOpen);
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE}/api/explain`, {
        scheme_id: scheme.id,
      });
      setArticle(response.data.explanation);
      setArticleOpen(true);
    } catch (err) {
      setArticle('Unable to load more detail right now.');
      setArticleOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card overflow-hidden">
      <div className="p-4 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl mr-2">{scheme.badge}</span>
            <span className="font-semibold text-gray-900">{scheme.name}</span>
            <span className="ml-2 text-sm text-gray-400">({scheme.category})</span>
          </div>
          <span className="text-gray-400">{expanded ? '▲' : '▼'}</span>
        </div>
        <p className="text-gray-500 text-sm mt-1">{scheme.description}</p>
      </div>

      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-100 pt-4">
          <div className="bg-teal-50 p-3 rounded-lg mb-3">
            <span className="font-semibold text-teal-700">💰 Benefit:</span> {scheme.benefit}
          </div>

          <div className="mb-3">
            <h4 className="font-semibold text-gray-700 text-sm">📖 What Problem Does This Solve?</h4>
            <p className="text-gray-600 text-sm">{scheme.problem_solved}</p>
          </div>

          {scheme.jargon && scheme.jargon.length > 0 && (
            <div className="mb-3">
              <h4 className="font-semibold text-gray-700 text-sm">🔑 Key Terms</h4>
              <div className="space-y-1 text-sm">
                {scheme.jargon.map((item) => (
                  <div key={item.term}>
                    <span className="font-medium text-teal-700 underline decoration-dotted cursor-help">
                      {item.term}
                    </span>
                    : {item.meaning}
                  </div>
                ))}
              </div>
            </div>
          )}

          {scheme.how_to_apply && (
            <div className="mb-3">
              <h4 className="font-semibold text-gray-700 text-sm">📋 How to Apply</h4>
              <ol className="list-decimal list-inside text-sm text-gray-600">
                {scheme.how_to_apply.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
            </div>
          )}

          <button
            onClick={handleLearnMore}
            disabled={loading}
            className="text-teal-600 font-medium hover:underline disabled:opacity-50 text-sm"
          >
            {loading ? 'Loading...' : '📖 Learn More'}
          </button>

          {articleOpen && article && (
            <div className="mt-3 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
              {article}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SchemeCard;
