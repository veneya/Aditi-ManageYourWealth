// frontend/src/components/MatchMaker.js

import React, { useState } from 'react';

function MatchMaker({ onSubmit, loading }) {
  const [profile, setProfile] = useState({
    gender: 'Female',
    age_group: '18–25 years',
    marital_status: 'Single',
    income_bracket: 'Under ₹3 lakh',
    home_status: 'No house',
    employment: 'Salaried',
    state_region: 'North India',
    bank_status: 'Yes, Aadhaar linked',
    category: 'General / EWS',
    has_daughter: 'No',
    business_plan: 'Not planning to'
  });

  const handleChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(profile);
  };

  return (
    <div className="card-warm p-6 grain relative">
      <form onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-ink/70 mb-1">Gender</label>
            <select
              value={profile.gender}
              onChange={(e) => handleChange('gender', e.target.value)}
              className="w-full px-4 py-2 rounded-full border border-plum/10 bg-cream/50 focus:outline-none focus:ring-2 focus:ring-plum/30"
              required
            >
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Other / LGBTQ+">Other / LGBTQ+</option>
            </select>
          </div>

          {/* Age */}
          <div>
            <label className="block text-sm font-medium text-ink/70 mb-1">Age</label>
            <select
              value={profile.age_group}
              onChange={(e) => handleChange('age_group', e.target.value)}
              className="w-full px-4 py-2 rounded-full border border-plum/10 bg-cream/50 focus:outline-none focus:ring-2 focus:ring-plum/30"
              required
            >
              <option value="18–25 years">18–25 years</option>
              <option value="26–35 years">26–35 years</option>
              <option value="36–45 years">36–45 years</option>
              <option value="46 and above">46 and above</option>
            </select>
          </div>

          {/* Marital Status */}
          <div>
            <label className="block text-sm font-medium text-ink/70 mb-1">Marital Status</label>
            <select
              value={profile.marital_status}
              onChange={(e) => handleChange('marital_status', e.target.value)}
              className="w-full px-4 py-2 rounded-full border border-plum/10 bg-cream/50 focus:outline-none focus:ring-2 focus:ring-plum/30"
              required
            >
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Divorced">Divorced</option>
              <option value="Widow">Widow</option>
            </select>
          </div>

          {/* Income */}
          <div>
            <label className="block text-sm font-medium text-ink/70 mb-1">Annual Income</label>
            <select
              value={profile.income_bracket}
              onChange={(e) => handleChange('income_bracket', e.target.value)}
              className="w-full px-4 py-2 rounded-full border border-plum/10 bg-cream/50 focus:outline-none focus:ring-2 focus:ring-plum/30"
              required
            >
              <option value="Under ₹3 lakh">Under ₹3 lakh</option>
              <option value="₹3–6 lakh">₹3–6 lakh</option>
              <option value="Above ₹6 lakh">Above ₹6 lakh</option>
            </select>
          </div>

          {/* Home Status */}
          <div>
            <label className="block text-sm font-medium text-ink/70 mb-1">Home Status</label>
            <select
              value={profile.home_status}
              onChange={(e) => handleChange('home_status', e.target.value)}
              className="w-full px-4 py-2 rounded-full border border-plum/10 bg-cream/50 focus:outline-none focus:ring-2 focus:ring-plum/30"
              required
            >
              <option value="Own house">Own house</option>
              <option value="Renting">Renting</option>
              <option value="No house">No house</option>
            </select>
          </div>

          {/* Employment */}
          <div>
            <label className="block text-sm font-medium text-ink/70 mb-1">Employment</label>
            <select
              value={profile.employment}
              onChange={(e) => handleChange('employment', e.target.value)}
              className="w-full px-4 py-2 rounded-full border border-plum/10 bg-cream/50 focus:outline-none focus:ring-2 focus:ring-plum/30"
              required
            >
              <option value="Salaried">Salaried</option>
              <option value="Self-employed">Self-employed</option>
              <option value="Homemaker">Homemaker</option>
            </select>
          </div>

          {/* State */}
          <div>
            <label className="block text-sm font-medium text-ink/70 mb-1">State/Region</label>
            <select
              value={profile.state_region}
              onChange={(e) => handleChange('state_region', e.target.value)}
              className="w-full px-4 py-2 rounded-full border border-plum/10 bg-cream/50 focus:outline-none focus:ring-2 focus:ring-plum/30"
              required
            >
              <option value="North India">North India</option>
              <option value="South India">South India</option>
              <option value="East India">East India</option>
              <option value="West India">West India</option>
            </select>
          </div>

          {/* Bank Status */}
          <div>
            <label className="block text-sm font-medium text-ink/70 mb-1">Bank Account</label>
            <select
              value={profile.bank_status}
              onChange={(e) => handleChange('bank_status', e.target.value)}
              className="w-full px-4 py-2 rounded-full border border-plum/10 bg-cream/50 focus:outline-none focus:ring-2 focus:ring-plum/30"
              required
            >
              <option value="Yes, Aadhaar linked">Yes, Aadhaar linked</option>
              <option value="Yes, not linked">Yes, not linked</option>
              <option value="No bank account">No bank account</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-ink/70 mb-1">Category</label>
            <select
              value={profile.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className="w-full px-4 py-2 rounded-full border border-plum/10 bg-cream/50 focus:outline-none focus:ring-2 focus:ring-plum/30"
              required
            >
              <option value="General / EWS">General / EWS</option>
              <option value="OBC">OBC</option>
              <option value="SC / ST">SC / ST</option>
            </select>
          </div>

          {/* Daughter */}
          <div>
            <label className="block text-sm font-medium text-ink/70 mb-1">Daughter below 10?</label>
            <select
              value={profile.has_daughter}
              onChange={(e) => handleChange('has_daughter', e.target.value)}
              className="w-full px-4 py-2 rounded-full border border-plum/10 bg-cream/50 focus:outline-none focus:ring-2 focus:ring-plum/30"
              required
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          {/* Business Plan */}
          <div>
            <label className="block text-sm font-medium text-ink/70 mb-1">Business Plan</label>
            <select
              value={profile.business_plan}
              onChange={(e) => handleChange('business_plan', e.target.value)}
              className="w-full px-4 py-2 rounded-full border border-plum/10 bg-cream/50 focus:outline-none focus:ring-2 focus:ring-plum/30"
              required
            >
              <option value="Yes, starting new">Yes, starting new</option>
              <option value="Yes, expanding existing">Yes, expanding existing</option>
              <option value="Not planning to">Not planning to</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-marigold w-full mt-6 py-3.5 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '🔍 Searching...' : '🔍 Find Schemes for Me'}
        </button>
      </form>
    </div>
  );
}

export default MatchMaker;