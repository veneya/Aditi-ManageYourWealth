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
    <section className="subscription" aria-labelledby="subscription-title">
      <div>
        <h3 id="subscription-title">Useful updates, without the noise.</h3>
        <p>Receive scheme, tax, and policy updates when they matter.</p>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="input-field"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="btn-primary disabled:opacity-50"
        >
          {loading ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>
    </section>
  );
}

export default Subscription;
