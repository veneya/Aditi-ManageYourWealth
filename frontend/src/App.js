/* THESIS: Eligibility discovery should feel like a clear next step, not government paperwork. OWN-WORLD: Midnight ink surfaces, aqua signal paths, apricot highlights, quiet rules. STORY: Choose a task, describe your situation, receive a focused shortlist, then keep learning. FIRST VIEWPORT: A slim rail frames an oversized title and eligibility signal. FORM: Operate-mode command centre. */
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import MatchMaker from './components/MatchMaker';
import SchemeCard from './components/SchemeCard';
import Quiz from './components/Quiz';
import Calculators from './components/Calculators';
import Catalogue from './components/Catalogue';
import Assistant from './components/Assistant';
import AboutSection from './components/AboutSection';
import LatestNews from './components/LatestNews';
import WealthWorkspace from './components/WealthWorkspace';

const tabs = [
  { id: 'dashboard', label: 'Overview', mark: '01' },
  { id: 'match', label: 'Find schemes', mark: '02' },
  { id: 'calculators', label: 'Calculators', mark: '04' },
  { id: 'catalogue', label: 'Explore schemes', mark: '05' },
  { id: 'quiz', label: 'Quiz', mark: '03' },
  { id: 'assistant', label: 'Ask ADITI', mark: '06' },
  { id: 'wealth', label: 'Wealth workspace', mark: '07' },
];

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [matchedSchemes, setMatchedSchemes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [schemesCount, setSchemesCount] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);
  const aboutRef = useRef(null);
  const newsRef = useRef(null);

  useEffect(() => {
    axios.get('/api/schemes').then(({ data }) => setSchemesCount(data.schemes?.length || 0)).catch(() => setSchemesCount(0));
  }, []);

  const handleMatch = async (profile) => {
    setLoading(true); setError(''); setHasSearched(true);
    try {
      const { data } = await axios.post('/api/match', profile);
      setMatchedSchemes(data.matches || []);
      toast.success(data.count ? `${data.count} schemes matched your profile.` : 'No schemes matched yet. Try adjusting your answers.');
    } catch {
      setError('We could not reach the matching service. Please try again.');
      toast.error('Matching service unavailable.');
    } finally { setLoading(false); }
  };

  const results = matchedSchemes.length ? <div className="result-list"><div className="section-heading"><span>Matched for you</span><strong>{matchedSchemes.length} found</strong></div>{matchedSchemes.map((scheme) => <SchemeCard key={scheme.id} scheme={scheme} compact />)}</div> : <div className="empty-state"><span className="empty-orbit" aria-hidden="true" /><h2>{hasSearched ? 'No direct match yet' : 'Your shortlist will appear here'}</h2><p>{hasSearched ? 'Adjust a detail and we will check again.' : 'Answer a few profile questions to see relevant support.'}</p></div>;

  return <div className="app-shell">
    <aside className="side-rail"><button className="brand" onClick={() => setActiveTab('dashboard')} aria-label="Go to overview"><span>ADITI</span><i /></button><nav aria-label="Main navigation">{tabs.map((tab) => <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={activeTab === tab.id ? 'active' : ''}><em>{tab.mark}</em><span>{tab.label}</span></button>)}</nav><p className="rail-note">Financial clarity<br />for everyday India.</p></aside>
    <div className="app-content"><header className="topbar"><p><span className="live-dot" />Eligibility intelligence</p><span>Built for informed choices</span></header><main>
      {activeTab === 'dashboard' && <><section className="hero-grid"><div className="hero-copy"><p className="eyebrow">A clearer financial path</p><h1>Support that<br /><i>fits your life.</i></h1><p className="lede">ADITI turns public schemes and financial decisions into practical next steps — shaped around your situation.</p><button className="signal-button" onClick={() => setActiveTab('match')}>Find my schemes <span>→</span></button><p className="lede-links"><button onClick={() => aboutRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>What we do <span aria-hidden="true">↓</span></button><button onClick={() => newsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>Latest news <span aria-hidden="true">↓</span></button></p></div><div className="signal-field" aria-label="Eligibility match preview"><div className="signal-orbit orbit-one" /><div className="signal-orbit orbit-two" /><div className="signal-core"><small>DISCOVER</small><strong>{schemesCount || '—'}</strong><span>available schemes</span></div><p>One profile<br />many possibilities</p></div></section><div ref={aboutRef} className="scroll-anchor" /><AboutSection onNavigate={setActiveTab} /><div ref={newsRef} className="scroll-anchor" /><LatestNews /></>}
      {activeTab === 'match' && <section className="tool-page"><p className="eyebrow">Scheme matcher</p><h1>Find support built for your reality.</h1><p className="lede">Share only the details that shape eligibility. We will turn them into a concise list.</p><MatchMaker onSubmit={handleMatch} loading={loading} />{error && <p className="inline-error">{error}</p>}{hasSearched && <div className="full-results">{results}</div>}</section>}
      {activeTab === 'quiz' && <section className="tool-page"><p className="eyebrow">Financial confidence</p><Quiz /></section>}
      {activeTab === 'calculators' && <section className="tool-page"><p className="eyebrow">Decision tools</p><Calculators /></section>}
      {activeTab === 'catalogue' && <section className="tool-page"><p className="eyebrow">Scheme catalogue</p><h1>Explore what is available.</h1><Catalogue /></section>}
      {activeTab === 'assistant' && <section className="tool-page"><p className="eyebrow">ADITI assistant</p><h1>A clear answer, when you need one.</h1><Assistant /></section>}
      {activeTab === 'wealth' && <section className="tool-page wealth-page"><WealthWorkspace /></section>}
    </main><footer><span>ADITI / Information, made actionable.</span><span>Eligibility and calculator results are guidance, not advice.</span></footer></div>
    <Toaster position="top-right" toastOptions={{ style: { background: '#14213d', color: '#eff8ff', border: '1px solid #294263' } }} />
  </div>;
}

export default App;
