// frontend/src/components/MatchMaker.js

import React, { useState } from 'react';

function MatchMaker({ onSubmit, loading, compact = false }) {
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

  const fields = [
    { key: 'gender', label: 'Gender', options: ['Female', 'Male', 'Other / LGBTQ+'] },
    { key: 'age_group', label: 'Age', options: ['18–25 years', '26–35 years', '36–45 years', '46 and above'] },
    { key: 'marital_status', label: 'Marital Status', options: ['Single', 'Married', 'Divorced', 'Widow'] },
    { key: 'income_bracket', label: 'Annual Income', options: ['Under ₹3 lakh', '₹3–6 lakh', 'Above ₹6 lakh'] },
    { key: 'home_status', label: 'Home Status', options: ['Own house', 'Renting', 'No house'] },
    { key: 'employment', label: 'Employment', options: ['Salaried', 'Self-employed', 'Homemaker'] },
  ];

  // Extra fields for full view
  const extraFields = compact ? [] : [
    { key: 'state_region', label: 'State/Region', options: ['North India', 'South India', 'East India', 'West India'] },
    { key: 'bank_status', label: 'Bank Account', options: ['Yes, Aadhaar linked', 'Yes, not linked', 'No bank account'] },
    { key: 'category', label: 'Category', options: ['General / EWS', 'OBC', 'SC / ST'] },
    { key: 'has_daughter', label: 'Daughter below 10?', options: ['Yes', 'No'] },
    { key: 'business_plan', label: 'Business Plan', options: ['Yes, starting new', 'Yes, expanding existing', 'Not planning to'] },
  ];

  const allFields = [...fields, ...extraFields];

  return (
    <div className={compact ? '' : 'card p-6'}>
      {!compact && <h3 className="text-lg font-semibold text-gray-900 mb-4">Your profile</h3>}
      <form onSubmit={handleSubmit}>
        <div className={compact ? 'grid grid-cols-1 gap-3' : 'grid grid-cols-1 md:grid-cols-2 gap-4'}>
          {allFields.map((field) => (
            <div key={field.key}>
              <label className="input-label">{field.label}</label>
              <select
                value={profile[field.key]}
                onChange={(e) => handleChange(field.key, e.target.value)}
                className="input-field"
                required
              >
                {field.options.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full mt-6"
        >
          {loading ? 'Checking eligibility...' : 'Find my schemes'}
        </button>
      </form>
    </div>
  );
}

export default MatchMaker;
