import { useState } from 'react';
import { CheckCircle, Upload, Home, ArrowRight, Shield, Zap, Users } from 'lucide-react';
import { PROPERTY_TYPES, DISTRICTS, TENURE_TYPES } from '../data/properties';

const STEPS = ['Property Details', 'Photos & Description', 'Pricing & Settings', 'Review & Submit'];
const LISTING_TYPES = ['Sale', 'Rent'];
const FURNISHING_OPTIONS = ['Unfurnished', 'Partially Furnished', 'Fully Furnished'];

export default function ListPropertyPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    listingType: 'Sale', type: 'Condo', address: '', district: '',
    bedrooms: '3', bathrooms: '2', area: '', floor: '', yearBuilt: '', totalUnits: '',
    furnishing: 'Unfurnished', mrtStation: '', mrtDistance: '',
    tenure: '99-Year Leasehold', price: '', description: '',
    highlights: [], amenities: { pool: false, gym: false, parking: false, bbq: false, security: false },
    agentName: '', agentPhone: '', agentEmail: '', agentCea: '',
    plan: 'starter',
  });

  const update = (field, value) => setForm(f => ({ ...f, [field]: value }));
  const toggleHighlight = (h) => setForm(f => ({
    ...f,
    highlights: f.highlights.includes(h) ? f.highlights.filter(x => x !== h) : [...f.highlights, h],
  }));
  const toggleAmenity = (key) => setForm(f => ({ ...f, amenities: { ...f.amenities, [key]: !f.amenities[key] } }));

  const handleSubmit = async () => {
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl p-10 max-w-md w-full text-center shadow-lg border border-gray-100">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={40} className="text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Listing Submitted!</h2>
          <p className="text-gray-500 mb-6">Your property has been submitted for verification. Our team will review and publish it within 24 hours.</p>
          <div className="bg-emerald-50 rounded-xl p-4 mb-6 text-left">
            <p className="text-sm font-semibold text-emerald-800 mb-2">What happens next:</p>
            <ul className="space-y-1.5">
              {['Property verified by our team', 'Listed live within 24 hours', 'Smart lead scoring activated', 'Buyer qualification forms enabled', 'You start receiving quality leads'].map(item => (
                <li key={item} className="flex items-center gap-2 text-sm text-emerald-700">
                  <CheckCircle size={13} className="text-emerald-500 flex-shrink-0" /> {item}
                </li>
              ))}
            </ul>
          </div>
          <button onClick={() => { setSubmitted(false); setStep(1); setForm(f => ({ ...f, address: '', price: '' })); }} className="w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors">
            List Another Property
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <h1 className="text-2xl font-bold text-gray-900">List Your Property</h1>
          <p className="text-gray-500 text-sm mt-0.5">Reach qualified buyers and renters with smart lead capture</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress */}
        <div className="flex items-center mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center flex-1 last:flex-none">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${i + 1 < step ? 'bg-emerald-600 text-white' : i + 1 === step ? 'bg-emerald-600 text-white ring-4 ring-emerald-100' : 'bg-gray-100 text-gray-400'}`}>
                  {i + 1 < step ? <CheckCircle size={14} /> : i + 1}
                </div>
                <span className={`text-sm font-medium hidden sm:block ${i + 1 === step ? 'text-emerald-600' : i + 1 < step ? 'text-gray-700' : 'text-gray-400'}`}>{s}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-3 ${i + 1 < step ? 'bg-emerald-400' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
          {/* Step 1: Property Details */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-gray-900">Property Details</h2>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Listing Type</label>
                  <div className="flex gap-2">
                    {LISTING_TYPES.map(t => (
                      <button key={t} onClick={() => update('listingType', t)} className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${form.listingType === t ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>{t}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Property Type</label>
                  <select value={form.type} onChange={e => update('type', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    {PROPERTY_TYPES.filter(t => t !== 'All Types').map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Property Address *</label>
                <input type="text" placeholder="e.g. 1 Orchard Road, Singapore 238858" value={form.address} onChange={e => update('address', e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">District</label>
                <select value={form.district} onChange={e => update('district', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  <option value="">Select district</option>
                  {DISTRICTS.filter(d => d !== 'All Districts').map(d => <option key={d}>{d}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Bedrooms</label>
                  <select value={form.bedrooms} onChange={e => update('bedrooms', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    {['1', '2', '3', '4', '5', '6+'].map(n => <option key={n}>{n}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Bathrooms</label>
                  <select value={form.bathrooms} onChange={e => update('bathrooms', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    {['1', '2', '3', '4', '5+'].map(n => <option key={n}>{n}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Floor Area (sqft)</label>
                  <input type="number" placeholder="e.g. 1200" value={form.area} onChange={e => update('area', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Tenure</label>
                  <select value={form.tenure} onChange={e => update('tenure', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    {TENURE_TYPES.filter(t => t !== 'All Tenure').map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Furnishing</label>
                  <select value={form.furnishing} onChange={e => update('furnishing', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    {FURNISHING_OPTIONS.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Nearest MRT</label>
                  <input type="text" placeholder="e.g. Orchard MRT" value={form.mrtStation} onChange={e => update('mrtStation', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Walk distance (min)</label>
                  <input type="number" placeholder="e.g. 5" value={form.mrtDistance} onChange={e => update('mrtDistance', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
              </div>

              {/* Amenities */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Facilities</label>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(form.amenities).map(key => (
                    <button
                      key={key}
                      onClick={() => toggleAmenity(key)}
                      className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-colors capitalize ${form.amenities[key] ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                    >
                      {key}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Photos & Description */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-gray-900">Photos & Description</h2>

              {/* Upload zone */}
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center hover:border-emerald-400 transition-colors cursor-pointer">
                <Upload size={36} className="text-gray-300 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-700">Drop photos here or click to upload</p>
                <p className="text-xs text-gray-400 mt-1">Supports JPG, PNG · Max 20 photos · Min 800×600px</p>
                <p className="text-xs text-emerald-600 mt-2 font-medium">Listings with 10+ photos get 3x more enquiries</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Property Title *</label>
                <input type="text" placeholder="e.g. Stunning 3BR Condo in Orchard" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Description *</label>
                <textarea
                  rows={5}
                  placeholder="Describe the property, its unique features, nearby amenities, and why buyers/renters would love it..."
                  value={form.description}
                  onChange={e => update('description', e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />
                <p className="text-xs text-gray-400 mt-1">{form.description.length}/1000 characters</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Key Highlights (select all that apply)</label>
                <div className="flex flex-wrap gap-2">
                  {['City View', 'Sea View', 'Corner Unit', 'High Floor', 'Near MRT', 'Brand New', 'Freehold', 'Good Schools', 'Near Mall', 'Quiet Area', 'Investment Potential', 'Renovated'].map(h => (
                    <button
                      key={h}
                      onClick={() => toggleHighlight(h)}
                      className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-colors ${form.highlights.includes(h) ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Pricing & Settings */}
          {step === 3 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-gray-900">Pricing & Settings</h2>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">
                  Asking Price {form.listingType === 'Rent' ? '(per month)' : ''} *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">S$</span>
                  <input
                    type="number"
                    placeholder={form.listingType === 'Rent' ? '3500' : '1500000'}
                    value={form.price}
                    onChange={e => update('price', e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Agent info */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Your Contact Information</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Full Name *</label>
                    <input type="text" value={form.agentName} onChange={e => update('agentName', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">CEA Registration No. *</label>
                    <input type="text" placeholder="R0XXXXXXX" value={form.agentCea} onChange={e => update('agentCea', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Phone *</label>
                    <input type="tel" placeholder="+65 9xxx xxxx" value={form.agentPhone} onChange={e => update('agentPhone', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Email *</label>
                    <input type="email" value={form.agentEmail} onChange={e => update('agentEmail', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                </div>
              </div>

              {/* Plan selection */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Choose a Plan</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { id: 'starter', name: 'Starter', price: 'Free', period: '30 days', features: ['1 listing', 'Basic lead form', 'Email support'], highlight: false },
                    { id: 'pro', name: 'Pro', price: 'S$99', period: '/month', features: ['5 listings', 'Smart lead scoring', 'Featured placement', 'Analytics dashboard'], highlight: true },
                    { id: 'elite', name: 'Elite', price: 'S$249', period: '/month', features: ['Unlimited listings', 'Top of search results', 'Buyer qualification AI', 'CRM integration', 'Priority support'], highlight: false },
                  ].map(plan => (
                    <button
                      key={plan.id}
                      onClick={() => update('plan', plan.id)}
                      className={`relative p-4 rounded-xl border-2 text-left transition-all ${form.plan === plan.id ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      {plan.highlight && <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">Most Popular</div>}
                      <div className="text-sm font-bold text-gray-900">{plan.name}</div>
                      <div className="text-xl font-bold text-emerald-600">{plan.price}<span className="text-xs text-gray-400">{plan.period}</span></div>
                      <ul className="mt-2 space-y-1">
                        {plan.features.map(f => (
                          <li key={f} className="flex items-center gap-1.5 text-xs text-gray-600">
                            <CheckCircle size={10} className="text-emerald-500 flex-shrink-0" /> {f}
                          </li>
                        ))}
                      </ul>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-gray-900">Review & Submit</h2>

              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                {[
                  { label: 'Listing Type', value: form.listingType },
                  { label: 'Property Type', value: form.type },
                  { label: 'Address', value: form.address || '(not provided)' },
                  { label: 'District', value: form.district || '(not selected)' },
                  { label: 'Bedrooms / Bathrooms', value: `${form.bedrooms} BD / ${form.bathrooms} BA` },
                  { label: 'Floor Area', value: form.area ? `${parseInt(form.area).toLocaleString()} sqft` : '(not provided)' },
                  { label: 'Tenure', value: form.tenure },
                  { label: 'Furnishing', value: form.furnishing },
                  { label: 'Asking Price', value: form.price ? `S$${parseInt(form.price).toLocaleString()}${form.listingType === 'Rent' ? '/mo' : ''}` : '(not provided)' },
                  { label: 'Plan', value: form.plan.charAt(0).toUpperCase() + form.plan.slice(1) },
                ].map(item => (
                  <div key={item.label} className="flex justify-between text-sm border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                    <span className="text-gray-500">{item.label}</span>
                    <span className="font-medium text-gray-800">{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <div className="flex items-start gap-2">
                  <Shield size={16} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-emerald-800">Smart Lead Capture Enabled</p>
                    <p className="text-xs text-emerald-700 mt-1">
                      Buyers must answer qualification questions (budget, timeline, financing) before they can enquire. You'll receive their full profile with every lead — no more cold time-wasters.
                    </p>
                  </div>
                </div>
              </div>

              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" className="mt-0.5" />
                <span className="text-xs text-gray-500">
                  I confirm this property is accurately represented and I am authorized to list it. I agree to LiveAHome.sg's Terms of Service and Agent Code of Conduct.
                </span>
              </label>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
            {step > 1 ? (
              <button onClick={() => setStep(s => s - 1)} className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                ← Back
              </button>
            ) : <div />}
            {step < 4 ? (
              <button onClick={() => setStep(s => s + 1)} className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-2">
                Continue <ArrowRight size={15} />
              </button>
            ) : (
              <button onClick={handleSubmit} className="px-8 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-2">
                Submit Listing <CheckCircle size={15} />
              </button>
            )}
          </div>
        </div>

        {/* Benefits sidebar */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: Shield, title: 'Verified Badge', desc: 'All listings get a Verified badge after review' },
            { icon: Zap, title: 'Smart Lead Scoring', desc: 'Leads are scored automatically so you focus on the best' },
            { icon: Users, title: 'Qualified Buyers', desc: 'Buyers share budget & timeline before enquiring' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-3 bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon size={18} className="text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">{title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
