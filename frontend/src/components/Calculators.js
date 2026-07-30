// frontend/src/components/Calculators.js

import React, { useState } from 'react';

function Calculators() {
  const [activeCalculator, setActiveCalculator] = useState('tax');

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">🧮 Calculators</h2>
      <p className="text-gray-500 mb-6">Get instant financial insights with our calculators.</p>

      {/* Calculator Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { id: 'tax', label: '💰 Tax Comparator' },
          { id: 'stamp', label: '🏠 Stamp Duty' },
          { id: 'pmay', label: '🏡 PMAY Subsidy' },
          { id: 'fd', label: '📈 FD Returns' },
        ].map((calc) => (
          <button
            key={calc.id}
            onClick={() => setActiveCalculator(calc.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeCalculator === calc.id
                ? 'bg-teal-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {calc.label}
          </button>
        ))}
      </div>

      {/* ==================== TAX COMPARATOR ==================== */}
      {activeCalculator === 'tax' && <TaxCalculator />}

      {/* ==================== STAMP DUTY ==================== */}
      {activeCalculator === 'stamp' && <StampDutyCalculator />}

      {/* ==================== PMAY SUBSIDY ==================== */}
      {activeCalculator === 'pmay' && <PMAYCalculator />}

      {/* ==================== FD RETURNS ==================== */}
      {activeCalculator === 'fd' && <FDCalculator />}
    </div>
  );
}

// ============================================================
// TAX COMPARATOR
// ============================================================

function TaxCalculator() {
  const [income, setIncome] = useState(800000);
  const [ded80c, setDed80c] = useState(50000);
  const [ded80d, setDed80d] = useState(5000);
  const [result, setResult] = useState(null);

  const calculateNewRegimeTax = (income) => {
    const standardDeduction = 75000;
    const taxableIncome = Math.max(0, income - standardDeduction);

    if (taxableIncome <= 1200000) return 0;

    let tax = 0;
    const slabs = [
      { lower: 400000, upper: 800000, rate: 0.05 },
      { lower: 800000, upper: 1200000, rate: 0.10 },
      { lower: 1200000, upper: 1600000, rate: 0.15 },
      { lower: 1600000, upper: 2000000, rate: 0.20 },
      { lower: 2000000, upper: 2400000, rate: 0.25 },
      { lower: 2400000, upper: Infinity, rate: 0.30 },
    ];

    let prevLimit = 400000;
    for (const slab of slabs) {
      if (taxableIncome > slab.lower) {
        const taxableAmount = Math.min(taxableIncome, slab.upper) - prevLimit;
        tax += taxableAmount * slab.rate;
        prevLimit = slab.upper;
      } else break;
    }
    return tax;
  };

  const calculateOldRegimeTax = (income, ded80c, ded80d) => {
    const standardDeduction = 50000;
    const capped80c = Math.min(ded80c, 150000);
    const taxableIncome = Math.max(0, income - standardDeduction - capped80c - ded80d);

    if (taxableIncome <= 500000) return 0;

    let tax = 0;
    const slabs = [
      { lower: 250000, upper: 500000, rate: 0.05 },
      { lower: 500000, upper: 1000000, rate: 0.20 },
      { lower: 1000000, upper: Infinity, rate: 0.30 },
    ];

    let prevLimit = 250000;
    for (const slab of slabs) {
      if (taxableIncome > slab.lower) {
        const taxableAmount = Math.min(taxableIncome, slab.upper) - prevLimit;
        tax += taxableAmount * slab.rate;
        prevLimit = slab.upper;
      } else break;
    }
    return tax;
  };

  const handleCalculate = () => {
    const newTax = calculateNewRegimeTax(income);
    const oldTax = calculateOldRegimeTax(income, ded80c, ded80d);
    setResult({ newTax, oldTax, savings: Math.abs(newTax - oldTax) });
  };

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Tax Comparator (FY 2026-27)</h3>
      
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="input-label">Annual Income (₹)</label>
          <input
            type="number"
            value={income}
            onChange={(e) => setIncome(Number(e.target.value))}
            className="input-field"
          />
        </div>
        <div>
          <label className="input-label">80C Deductions (₹)</label>
          <input
            type="number"
            value={ded80c}
            onChange={(e) => setDed80c(Math.min(Number(e.target.value), 150000))}
            className="input-field"
            max="150000"
          />
          <p className="text-xs text-gray-400 mt-1">Max ₹1,50,000</p>
        </div>
        <div>
          <label className="input-label">80D Deductions (₹)</label>
          <input
            type="number"
            value={ded80d}
            onChange={(e) => setDed80d(Math.min(Number(e.target.value), 25000))}
            className="input-field"
            max="25000"
          />
          <p className="text-xs text-gray-400 mt-1">Max ₹25,000</p>
        </div>
      </div>

      <button onClick={handleCalculate} className="btn-primary mt-4">
        Calculate Tax
      </button>

      {result && (
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-500">New Regime</p>
            <p className="text-xl font-bold text-teal-600">₹{result.newTax.toFixed(0)}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-500">Old Regime</p>
            <p className="text-xl font-bold text-orange-600">₹{result.oldTax.toFixed(0)}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-500">You Save</p>
            <p className="text-xl font-bold text-green-600">₹{result.savings.toFixed(0)}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// STAMP DUTY CALCULATOR
// ============================================================

function StampDutyCalculator() {
  const [state, setState] = useState('Delhi');
  const [propertyValue, setPropertyValue] = useState(5000000);
  const [result, setResult] = useState(null);

  const stampData = [
    { state: 'Delhi', men: 6, women: 4 },
    { state: 'Uttar Pradesh', men: 7, women: 6 },
    { state: 'Maharashtra', men: 5, women: 4 },
    { state: 'Karnataka', men: 5, women: 5 },
    { state: 'Tamil Nadu', men: 7, women: 7 },
    { state: 'Haryana', men: 7, women: 5 },
    { state: 'Rajasthan', men: 5, women: 4 },
    { state: 'Gujarat', men: 4.9, women: 4.9 },
    { state: 'Punjab', men: 6, women: 5 },
    { state: 'Himachal Pradesh', men: 6, women: 4 },
  ];

  const handleCalculate = () => {
    const rates = stampData.find((s) => s.state === state);
    if (rates) {
      const menDuty = (rates.men / 100) * propertyValue;
      const womenDuty = (rates.women / 100) * propertyValue;
      setResult({ menDuty, womenDuty, savings: menDuty - womenDuty, menRate: rates.men, womenRate: rates.women });
    }
  };

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Stamp Duty Savings</h3>
      <p className="text-sm text-gray-500 mb-4">See how much you save by registering property in your name.</p>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="input-label">State</label>
          <select value={state} onChange={(e) => setState(e.target.value)} className="input-field">
            {stampData.map((s) => (
              <option key={s.state} value={s.state}>{s.state}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="input-label">Property Value (₹)</label>
          <input
            type="number"
            value={propertyValue}
            onChange={(e) => setPropertyValue(Number(e.target.value))}
            className="input-field"
          />
        </div>
      </div>

      <button onClick={handleCalculate} className="btn-primary mt-4">
        Calculate Savings
      </button>

      {result && (
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-500">Men's Duty</p>
            <p className="text-xl font-bold text-orange-600">₹{result.menDuty.toFixed(0)}</p>
            <p className="text-xs text-gray-400">{result.menRate}% rate</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-500">Women's Duty</p>
            <p className="text-xl font-bold text-teal-600">₹{result.womenDuty.toFixed(0)}</p>
            <p className="text-xs text-gray-400">{result.womenRate}% rate</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-500">You Save</p>
            <p className="text-xl font-bold text-green-600">₹{result.savings.toFixed(0)}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// PMAY SUBSIDY CALCULATOR
// ============================================================

function PMAYCalculator() {
  const [loanAmount, setLoanAmount] = useState(800000);
  const [tenure, setTenure] = useState(20);
  const [interestRate, setInterestRate] = useState(8.5);
  const [result, setResult] = useState(null);

  const handleCalculate = () => {
    // EMI: P * r * (1+r)^n / ((1+r)^n - 1)
    const r = (interestRate / 100) / 12;
    const n = tenure * 12;
    const emi = loanAmount * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);

    // Subsidy: 4% on first ₹8L, max ₹1.8L
    const eligiblePrincipal = Math.min(loanAmount, 800000);
    const subsidyEstimate = Math.min(180000, eligiblePrincipal * 0.04 * tenure);

    setResult({ emi, subsidyEstimate });
  };

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">PMAY-U 2.0 Subsidy Estimator</h3>
      <p className="text-sm text-gray-500 mb-4">Calculate your potential savings under PMAY.</p>

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="input-label">Loan Amount (₹)</label>
          <input
            type="number"
            value={loanAmount}
            onChange={(e) => setLoanAmount(Number(e.target.value))}
            className="input-field"
          />
        </div>
        <div>
          <label className="input-label">Tenure (Years)</label>
          <input
            type="number"
            value={tenure}
            onChange={(e) => setTenure(Number(e.target.value))}
            className="input-field"
          />
        </div>
        <div>
          <label className="input-label">Interest Rate (%)</label>
          <input
            type="number"
            step="0.1"
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            className="input-field"
          />
        </div>
      </div>

      <button onClick={handleCalculate} className="btn-primary mt-4">
        Calculate Subsidy
      </button>

      {result && (
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-500">Monthly EMI</p>
            <p className="text-xl font-bold text-gray-900">₹{result.emi.toFixed(0)}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-500">Estimated Subsidy</p>
            <p className="text-xl font-bold text-teal-600">₹{result.subsidyEstimate.toFixed(0)}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// FD RETURNS CALCULATOR
// ============================================================

function FDCalculator() {
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(7.0);
  const [years, setYears] = useState(5);
  const [frequency, setFrequency] = useState('Yearly');
  const [result, setResult] = useState(null);

  const freqMap = { Yearly: 1, 'Half-Yearly': 2, Quarterly: 4 };

  const handleCalculate = () => {
    const n = freqMap[frequency];
    const amount = principal * Math.pow(1 + (rate / 100) / n, n * years);
    const interestEarned = amount - principal;
    setResult({ amount, interestEarned });
  };

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">FD Returns Calculator</h3>
      <p className="text-sm text-gray-500 mb-4">Calculate your fixed deposit maturity amount.</p>

      <div className="grid md:grid-cols-4 gap-4">
        <div>
          <label className="input-label">Investment (₹)</label>
          <input
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(Number(e.target.value))}
            className="input-field"
          />
        </div>
        <div>
          <label className="input-label">Interest Rate (%)</label>
          <input
            type="number"
            step="0.1"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="input-field"
          />
        </div>
        <div>
          <label className="input-label">Tenure (Years)</label>
          <input
            type="number"
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="input-field"
          />
        </div>
        <div>
          <label className="input-label">Compounding</label>
          <select value={frequency} onChange={(e) => setFrequency(e.target.value)} className="input-field">
            <option>Yearly</option>
            <option>Half-Yearly</option>
            <option>Quarterly</option>
          </select>
        </div>
      </div>

      <button onClick={handleCalculate} className="btn-primary mt-4">
        Calculate Returns
      </button>

      {result && (
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-500">Principal</p>
            <p className="text-xl font-bold text-gray-900">₹{principal.toFixed(0)}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-500">Interest Earned</p>
            <p className="text-xl font-bold text-teal-600">₹{result.interestEarned.toFixed(0)}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-500">Maturity Amount</p>
            <p className="text-xl font-bold text-green-600">₹{result.amount.toFixed(0)}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Calculators;