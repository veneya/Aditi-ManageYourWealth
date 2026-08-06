// What we are / what we do — editorial manifesto + capability ledger for the Overview route.
import React from 'react';

const WORK = [
  {
    id: 'match',
    destination: 'match',
    heading: 'Match — find the schemes that fit your profile.',
    body: 'Answer a few short profile questions and we surface the schemes you likely qualify for — ranked, not listed, grounded in the actual eligibility rules.',
    action: 'Find schemes',
  },
  {
    id: 'explain',
    destination: 'catalogue',
    heading: 'Explain — every scheme in plain language.',
    body: 'What a scheme offers, what it asks for, and what it takes to apply, written without the jargon. Read the whole catalogue at your own pace.',
    action: 'Explore catalogue',
  },
  {
    id: 'calculate',
    destination: 'calculators',
    heading: 'Calculate — work the numbers before you decide.',
    body: 'Savings, loan, and subsidy calculators that turn scheme rules into figures you can actually plan around — before you commit to anything.',
    action: 'Open calculators',
  },
  {
    id: 'assistant',
    destination: 'assistant',
    heading: 'Ask — ADITI answers when you wonder.',
    body: 'A patient assistant that reads eligibility pages with you. Ask anything, any time, in your own words, and get a clear answer.',
    action: 'Ask ADITI',
  },
];

export default function AboutSection({ onNavigate }) {
  return (
    <section className="about-band">
      <div className="manifesto">
        <h2>What the government owes you, <i>made findable.</i></h2>
        <p>
          ADITI is a private, patient guide to India's support systems — housing subsidies, business
          loans, education funds, savings schemes. We read the fine print so you do not have to, then
          put the next step in front of you.
        </p>
        <span className="seal"><i aria-hidden="true" />INFORMATION, MADE ACTIONABLE</span>
      </div>
      <div className="do-ledger">
        {WORK.map((item) => (
          <div className="do-row" key={item.id}>
            <div className="do-copy">
              <strong>{item.heading}</strong>
              <span>{item.body}</span>
            </div>
            <button className="do-link" onClick={() => onNavigate(item.destination)}>
              {item.action} <i aria-hidden="true">→</i>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
