// frontend/src/components/Subscription.js

import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function Subscription() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE}/api/subscribe`, { email });
      if (response.data.success) {
        toast.success('Subscribed! You\'ll receive updates.');
        setEmail('');
      }
    } catch (err) {
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-warm p-6 text-center">
      <h3 className="font-serif text-xl text-plum">📬 Stay Updated</h3>
      <p className="text-sm text-muted-foreground mt-1">
        Get the latest schemes, tax updates, and policy news.
      </p>
      <form onSubmit={handleSubmit} className="mt-4 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="flex-1 px-4 py-2 rounded-full border border-plum/10 bg-cream/50 focus:outline-none focus:ring-2 focus:ring-plum/30"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="btn-plum px-6 py-2 text-sm font-medium disabled:opacity-50"
        >
          {loading ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>
      <p className="text-xs text-muted-foreground mt-3">
        No spam. Unsubscribe anytime.
      </p>
    </div>
  );
}

export default Subscription;