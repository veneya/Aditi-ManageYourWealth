// frontend/src/App.js

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

// Components
import Chat from './components/Chat';
import MatchMaker from './components/MatchMaker';
import SchemeCard from './components/SchemeCard';
import NewsBanner from './components/NewsBanner';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function AppContent() {
  const [matchedSchemes, setMatchedSchemes] = useState([]);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [news, setNews] = useState([]);
  const [schemesCount, setSchemesCount] = useState(null);

  // Fetch news + scheme count on load
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/news`);
        if (response.data.success) {
          setNews(response.data.news.slice(0, 5));
        }
      } catch (err) {
        console.error('Failed to fetch news:', err);
      }
    };
    const fetchSchemesCount = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/schemes`);
        setSchemesCount(response.data.schemes.length);
      } catch (err) {
        console.error('Failed to fetch schemes:', err);
      }
    };
    fetchNews();
    fetchSchemesCount();
  }, []);

  const handleMatch = async (profile) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(`${API_BASE}/api/match`, profile);
      const { count, matches } = response.data;
      setMatchedSchemes(matches);
      setSummary(
        count > 0
          ? `Based on your answers, here's what you qualify for.`
          : `No schemes matched your answers this time — try adjusting a few and see what changes.`
      );
      if (count > 0) {
        toast.success(`Found ${count} scheme${count === 1 ? '' : 's'} for you!`);
      }
    } catch (err) {
      setError('Failed to connect to server');
      toast.error('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-cream/80 border-b border-plum/5">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 h-16 grid grid-cols-[1fr_auto] items-center gap-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-plum text-cream font-serif text-lg">A</span>
            <span className="font-serif text-2xl tracking-tight text-plum">aditi</span>
            <span className="hidden sm:inline text-[10px] uppercase tracking-[0.22em] text-muted-foreground border-l border-plum/15 pl-3">
              for women, plainly
            </span>
          </Link>
          
          <nav className="flex items-center gap-2">
            <Link to="/" className="text-sm text-ink/70 hover:text-plum px-3 py-2 rounded-full transition-colors">
              Match
            </Link>
            <Link to="/news" className="text-sm text-ink/70 hover:text-plum px-3 py-2 rounded-full transition-colors">
              News
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Routes>
          <Route
            path="/"
            element={
                <div className="mx-auto max-w-7xl px-5 sm:px-8 py-12">
                  {/* News Banner */}
                  {news.length > 0 && <NewsBanner news={news} />}

                  {/* Hero Section */}
                  <div className="grid gap-12 lg:grid-cols-[1.15fr_1fr] items-end pt-8">
                    <div className="animate-rise">
                      <div className="flex items-center gap-3">
                        <span className="eyebrow">PS21 · Financial Empowerment</span>
                        <span className="h-px w-10 bg-plum/30" />
                        <span className="text-[11px] tracking-[0.22em] uppercase text-terracotta font-semibold">
                          for women
                        </span>
                      </div>
                      <h1 className="mt-6 font-serif text-[clamp(3rem,8.5vw,7rem)] leading-[0.92] text-plum">
                        Boundless <em className="italic text-terracotta">financial</em>
                        <br />empowerment.
                      </h1>
                      <p className="mt-8 max-w-xl text-lg sm:text-xl text-ink/75 leading-relaxed">
                        Most apps assume you already know. ADITI is built for the two moments
                        women's finances are hardest —
                        <span className="text-plum font-medium"> starting your first job</span>,
                        and <span className="text-plum font-medium"> starting over</span>.
                      </p>
                      
                      <dl className="mt-14 grid grid-cols-3 gap-6 max-w-lg">
                        <div>
                          <div className="font-serif text-4xl text-plum">{schemesCount ?? '10'}</div>
                          <div className="mt-1 text-xs text-muted-foreground leading-snug">
                            Government schemes matched
                          </div>
                        </div>
                        <div>
                          <div className="font-serif text-4xl text-plum">₹1.8L</div>
                          <div className="mt-1 text-xs text-muted-foreground leading-snug">
                            Max PMAY subsidy
                          </div>
                        </div>
                        <div>
                          <div className="font-serif text-4xl text-plum">30+</div>
                          <div className="mt-1 text-xs text-muted-foreground leading-snug">
                            Jargon terms decoded
                          </div>
                        </div>
                      </dl>
                    </div>

                    {/* Sample Match Card */}
                    <div className="relative animate-rise" style={{ animationDelay: '0.15s' }}>
                      <div className="relative aspect-[4/5] card-warm grain overflow-hidden">
                        <div className="absolute inset-0">
                          <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-marigold/60 blur-2xl animate-drift" />
                          <div className="absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-terracotta/40 blur-3xl animate-drift" style={{ animationDelay: '3s' }} />
                        </div>
                        <div className="relative h-full p-8 flex flex-col justify-between">
                          <div>
                            <div className="eyebrow">Sample match</div>
                            <div className="mt-4 font-serif text-3xl text-plum leading-tight">
                              "You qualify for <em className="italic text-terracotta">4 schemes</em>{' '}
                              worth up to ₹22 lakh in access."
                            </div>
                          </div>
                          <div className="space-y-2.5">
                            <div className="flex items-center justify-between rounded-full bg-cream/80 border border-plum/10 px-4 py-2 text-sm">
                              <span className="text-plum font-medium">PMAY</span>
                              <span className="text-muted-foreground text-xs">₹1.8L subsidy</span>
                            </div>
                            <div className="flex items-center justify-between rounded-full bg-cream/80 border border-plum/10 px-4 py-2 text-sm">
                              <span className="text-plum font-medium">Mudra Loan</span>
                              <span className="text-muted-foreground text-xs">up to ₹20L</span>
                            </div>
                            <div className="flex items-center justify-between rounded-full bg-cream/80 border border-plum/10 px-4 py-2 text-sm">
                              <span className="text-plum font-medium">PMEGP</span>
                              <span className="text-muted-foreground text-xs">35% subsidy</span>
                            </div>
                            <div className="flex items-center justify-between rounded-full bg-cream/80 border border-plum/10 px-4 py-2 text-sm">
                              <span className="text-plum font-medium">Sukanya Samriddhi</span>
                              <span className="text-muted-foreground text-xs">8.2% tax-free</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Match Maker Form */}
                  <div className="mt-16">
                    <h2 className="text-2xl font-serif text-plum mb-4">
                      Find your schemes
                    </h2>
                    <MatchMaker onSubmit={handleMatch} loading={loading} />
                  </div>

                  {/* Results */}
                  {error && (
                    <div className="mt-6 bg-red-50 border-l-4 border-red-500 p-4">
                      <p className="text-red-700">{error}</p>
                    </div>
                  )}

                  {matchedSchemes.length > 0 && (
                    <div className="mt-8">
                      <div className="bg-marigold/20 border-l-4 border-marigold p-4 mb-6 rounded-r-lg">
                        <h2 className="text-xl font-bold text-plum">
                          🎉 You qualify for {matchedSchemes.length} schemes!
                        </h2>
                        {summary && <p className="text-ink/75 mt-2">{summary}</p>}
                      </div>

                      <div className="space-y-4">
                        {matchedSchemes.map((scheme) => (
                          <SchemeCard key={scheme.id} scheme={scheme} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Chat */}
                  <div className="mt-12">
                    <Chat />
                  </div>
                </div>
            }
          />
          <Route path="/news" element={
              <div className="mx-auto max-w-7xl px-5 sm:px-8 py-12">
                <h2 className="text-2xl font-serif text-plum mb-6">📰 Latest Financial News</h2>
                {news.length > 0 ? (
                  <div className="space-y-4">
                    {news.map((item, idx) => (
                      <div key={idx} className="card-warm p-4">
                        <h3 className="font-semibold text-plum">{item.title}</h3>
                        <p className="text-sm text-ink/60">{item.source} · {item.date}</p>
                        <p className="mt-2 text-ink/75">{item.summary}</p>
                        <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-terracotta hover:underline text-sm mt-2 inline-block">
                          Read More →
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-ink/50">No news available.</p>
                )}
              </div>
          } />
        </Routes>
      </main>

      <footer className="bg-plum/5 border-t border-plum/10 mt-12">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-6 text-center text-sm text-muted-foreground">
          🌺 ADITI — Find government schemes, understand them, and take action.
          <br />Built for the Women's Hackathon 2026
        </div>
      </footer>

      <Toaster position="top-right" />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;