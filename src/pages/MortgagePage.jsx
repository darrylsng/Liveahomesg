import { useState, useMemo } from 'react';
import { Calculator, TrendingUp, Info, CheckCircle, DollarSign } from 'lucide-react';

function calcMortgage({ principal, annualRate, years }) {
  const r = annualRate / 100 / 12;
  const n = years * 12;
  if (r === 0) return principal / n;
  return principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

export default function MortgagePage() {
  const [propPrice, setPropPrice] = useState(1500000);
  const [downPaymentPct, setDownPaymentPct] = useState(25);
  const [annualRate, setAnnualRate] = useState(3.5);
  const [loanYears, setLoanYears] = useState(25);
  const [buyerType, setBuyerType] = useState('Singapore Citizen');
  const [propType, setPropType] = useState('Residential');
  const [firstProp, setFirstProp] = useState(true);

  const downPayment = Math.round(propPrice * downPaymentPct / 100);
  const loanAmount = propPrice - downPayment;
  const monthlyPayment = useMemo(() => calcMortgage({ principal: loanAmount, annualRate, years: loanYears }), [loanAmount, annualRate, loanYears]);
  const totalPayment = monthlyPayment * loanYears * 12;
  const totalInterest = totalPayment - loanAmount;

  // ABSD rates
  const absdRates = {
    'Singapore Citizen': { 1: 0, 2: 20, 3: 30 },
    'Singapore PR': { 1: 5, 2: 30, 3: 35 },
    'Foreigner': { 1: 60, 2: 60, 3: 60 },
  };
  const propNo = firstProp ? 1 : 2;
  const absdRate = absdRates[buyerType]?.[propNo] ?? 0;
  const absdAmount = propType === 'Residential' ? Math.round(propPrice * absdRate / 100) : 0;

  // BSD
  const calcBsd = (price) => {
    let bsd = 0;
    const tiers = [
      [180000, 0.01], [180000, 0.02], [640000, 0.03], [500000, 0.04], [1500000, 0.05], [Infinity, 0.06]
    ];
    let remaining = price;
    for (const [cap, rate] of tiers) {
      const portion = Math.min(remaining, cap);
      bsd += portion * rate;
      remaining -= portion;
      if (remaining <= 0) break;
    }
    return Math.round(bsd);
  };
  const bsd = calcBsd(propPrice);

  const totalCost = propPrice + bsd + absdAmount;
  const cashNeeded = downPayment + bsd + absdAmount;

  const formatCurrency = (val) => {
    if (val >= 1000000) return `S$${(val / 1000000).toFixed(2)}M`;
    return `S$${Math.round(val).toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
              <Calculator size={20} className="text-emerald-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Mortgage & Cost Calculator</h1>
              <p className="text-sm text-gray-500">Estimate monthly payments, stamp duties, and total cost of ownership</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Inputs */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="font-bold text-gray-900 mb-5">Property & Loan Details</h2>

              {/* Price slider */}
              <div className="mb-5">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700">Property Price</label>
                  <span className="text-lg font-bold text-emerald-600">{formatCurrency(propPrice)}</span>
                </div>
                <input type="range" min={300000} max={10000000} step={50000} value={propPrice} onChange={e => setPropPrice(+e.target.value)} className="w-full accent-emerald-600" />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>S$300K</span><span>S$10M</span>
                </div>
              </div>

              {/* Down payment */}
              <div className="mb-5">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700">Down Payment</label>
                  <span className="text-sm font-bold text-gray-800">{downPaymentPct}% · {formatCurrency(downPayment)}</span>
                </div>
                <input type="range" min={5} max={80} step={5} value={downPaymentPct} onChange={e => setDownPaymentPct(+e.target.value)} className="w-full accent-emerald-600" />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>5%</span><span>80%</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">Loan amount: {formatCurrency(loanAmount)} · LTV: {(100 - downPaymentPct).toFixed(0)}%</p>
              </div>

              {/* Interest rate */}
              <div className="mb-5">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700">Interest Rate (p.a.)</label>
                  <span className="text-sm font-bold text-gray-800">{annualRate}%</span>
                </div>
                <input type="range" min={1.5} max={6} step={0.1} value={annualRate} onChange={e => setAnnualRate(+parseFloat(e.target.value).toFixed(1))} className="w-full accent-emerald-600" />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>1.5%</span><span>6.0%</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">Current best rate: ~3.2% (as of Q1 2025)</p>
              </div>

              {/* Loan tenure */}
              <div className="mb-5">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700">Loan Tenure</label>
                  <span className="text-sm font-bold text-gray-800">{loanYears} years</span>
                </div>
                <input type="range" min={5} max={30} step={1} value={loanYears} onChange={e => setLoanYears(+e.target.value)} className="w-full accent-emerald-600" />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>5 yrs</span><span>30 yrs</span>
                </div>
              </div>
            </div>

            {/* Stamp Duty Calculator */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="font-bold text-gray-900 mb-5">Stamp Duty (BSD + ABSD)</h2>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1.5">Buyer Type</label>
                  <select value={buyerType} onChange={e => setBuyerType(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    {['Singapore Citizen', 'Singapore PR', 'Foreigner'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1.5">Property Type</label>
                  <select value={propType} onChange={e => setPropType(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    {['Residential', 'Commercial', 'Industrial'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="text-xs font-medium text-gray-600 block mb-1.5">This is my...</label>
                <div className="flex gap-2">
                  {['1st Property', '2nd Property', '3rd+ Property'].map((label, i) => (
                    <button
                      key={label}
                      onClick={() => setFirstProp(i === 0)}
                      className={`flex-1 py-2 rounded-lg border text-xs font-medium transition-colors ${(i === 0 ? firstProp : !firstProp) ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-200 text-gray-600'}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 bg-gray-50 rounded-xl p-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Buyer's Stamp Duty (BSD)</span>
                  <span className="font-medium">{formatCurrency(bsd)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Additional BSD (ABSD) {absdRate > 0 ? `(${absdRate}%)` : ''}</span>
                  <span className={`font-medium ${absdAmount > 0 ? 'text-red-500' : 'text-gray-500'}`}>
                    {absdAmount > 0 ? formatCurrency(absdAmount) : propType !== 'Residential' ? 'N/A' : 'Waived'}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold border-t border-gray-200 pt-2 mt-2">
                  <span>Total Stamp Duty</span>
                  <span className="text-emerald-600">{formatCurrency(bsd + absdAmount)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-2 space-y-4">
            {/* Monthly Payment */}
            <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-6 text-white">
              <p className="text-sm text-emerald-200 mb-1">Estimated Monthly Payment</p>
              <div className="text-4xl font-bold mb-1">
                {formatCurrency(monthlyPayment)}
              </div>
              <p className="text-xs text-emerald-200">Based on {annualRate}% p.a. over {loanYears} years</p>

              <div className="mt-4 space-y-2">
                {[
                  { label: 'Loan Amount', value: formatCurrency(loanAmount) },
                  { label: 'Total Interest', value: formatCurrency(totalInterest) },
                  { label: 'Total Repayment', value: formatCurrency(totalPayment) },
                ].map(item => (
                  <div key={item.label} className="flex justify-between text-sm">
                    <span className="text-emerald-200">{item.label}</span>
                    <span className="font-semibold">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cash Required */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign size={16} className="text-emerald-600" /> Total Cash Needed
              </h3>
              <div className="space-y-2">
                {[
                  { label: `Down Payment (${downPaymentPct}%)`, value: downPayment, color: 'emerald' },
                  { label: 'Stamp Duty (BSD)', value: bsd, color: 'blue' },
                  ...(absdAmount > 0 ? [{ label: `ABSD (${absdRate}%)`, value: absdAmount, color: 'red' }] : []),
                ].map(item => (
                  <div key={item.label} className="flex justify-between text-sm py-1.5 border-b border-gray-50 last:border-0">
                    <span className="text-gray-600">{item.label}</span>
                    <span className={`font-semibold text-${item.color}-600`}>{formatCurrency(item.value)}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm font-bold pt-2">
                  <span className="text-gray-900">Total Upfront Cash</span>
                  <span className="text-emerald-600 text-base">{formatCurrency(cashNeeded)}</span>
                </div>
              </div>
            </div>

            {/* Affordability Check */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <TrendingUp size={16} className="text-blue-600" /> Affordability Check
              </h3>
              <p className="text-xs text-gray-500 mb-3">Based on the MAS Total Debt Servicing Ratio (TDSR) of 55%:</p>
              <div className="space-y-1.5 text-sm">
                {[
                  { label: 'Monthly at 30% MSR', value: formatCurrency(monthlyPayment / 0.3) },
                  { label: 'Monthly at 55% TDSR', value: formatCurrency(monthlyPayment / 0.55) },
                ].map(item => (
                  <div key={item.label} className="flex justify-between py-1 border-b border-gray-50 last:border-0">
                    <span className="text-gray-500">{item.label}</span>
                    <span className="font-medium text-gray-800">{item.value}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-3">
                Minimum gross monthly income needed for this loan
              </p>
            </div>

            {/* Disclaimer */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-start gap-2">
                <Info size={14} className="text-amber-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-amber-700">
                  These are estimates only. Actual mortgage rates and approval depend on your credit profile, income, and bank policies. Consult a licensed mortgage broker for personalized advice.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
