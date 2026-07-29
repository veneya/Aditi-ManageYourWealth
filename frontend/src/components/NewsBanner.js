// frontend/src/components/NewsBanner.js

import React, { useState, useEffect } from 'react';

function NewsBanner({ news }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (news.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % news.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [news]);

  if (!news.length) return null;

  const item = news[currentIndex];

  return (
    <div className="card-warm p-4 mb-6 bg-marigold/10 border border-marigold/20">
      <div className="flex items-start gap-3">
        <span className="text-xl">📰</span>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold uppercase tracking-wider text-terracotta">
              {item.source}
            </span>
            <span className="text-xs text-muted-foreground">·</span>
            <span className="text-xs text-muted-foreground">{item.date}</span>
          </div>
          <p className="text-sm font-medium text-plum">{item.title}</p>
          <p className="text-sm text-ink/60 mt-1">{item.summary}</p>
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-terracotta hover:underline inline-block mt-1"
          >
            Read More →
          </a>
        </div>
        {news.length > 1 && (
          <div className="flex gap-1 mt-1">
            {news.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentIndex ? 'bg-plum w-4' : 'bg-plum/20'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default NewsBanner;