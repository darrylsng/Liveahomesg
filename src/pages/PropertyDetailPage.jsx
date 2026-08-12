import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart, Share2, BadgeCheck, Star, Phone, MessageSquare, Calendar,
  MapPin, BedDouble, Bath, Maximize, TrendingUp, CheckCircle,
  ChevronLeft, ChevronRight, Eye, Home, ArrowRight, Shield, Clock,
  Wifi, Car, Dumbbell, Waves, Flame, Lock, Baby
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { agents } from '../data/agents';
import PropertyCard from '../components/PropertyCard';

const LEAD_TIMELINES = ['Within 1 month', 'Within 3 months', '3-6 months', 'More than 6 months'];
const LEAD_FINANCING = ['Full Cash', 'Bank Loan', 'HDB Loan', 'Not sure yet'];
const LEAD_BUYER_TYPES = ['First-time Buyer', 'Owner Occupier', 'Investor', 'Upgrader', 'Tenant'];

export default function PropertyDetailPage() {
  const { id } = useParams();
  const { allProperties, savedProperties, toggleSave, addLead } = useApp();
  const navigate = useNavigate();

  const property = allProperties.find(p => p.id === parseInt(id));
  const [imgIdx, setImgIdx] = useState(0);
  const [leadStep, setLeadStep] = useState(1); // 1=qualify, 2=contact, 3=success
  const [leadForm, setLeadForm] = useState({
    name: '', phone: '', email: '', message: '',
    budget: '', timeline: '', financing: '', buyerType: '',
  });
  const [submitting, setSubmitting] = useState(false);

  if (!property) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-4">🏠</div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Property not found</h2>
        <Link to="/listings" className="text-emerald-600 hover:underline">Back to listings</Link>
      </div>
    </div>
  );

  const agent = agents.find(a => a.id === property.agentId);
  const isSaved = savedProperties.includes(property.id);
  const isRent = property.listingType === 'Rent';
  const similar = allProperties.filter(p => p.id !== property.id && p.type === property.type && p.listingType === property.listingType).slice(0, 3);

  const formatPrice = (price) => {
    if (isRent) return `S$${price.toLocaleString()}/mo`;
    if (price >= 1000000) return `S$${(price / 1000000).toFixed(2)}M`;
    return `S$${price.toLocaleString()}`;
  };

  const handleLeadSubmit = async () => {
    if (!leadForm.name || !leadForm.email) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 800));
    addLead({ ...leadForm, propertyId: property.id, propertyTitle: property.title });
    setSubmitting(false);
    setLeadStep(3);
  };

  const amenityIcons = {
    pool: { icon: Waves, label: 'Swimming Pool' },
    gym: { icon: Dumbbell, label: 'Gym' },
    parking: { icon: Car, label: 'Parking' },
    bbq: { icon: Flame, label: 'BBQ Pit' },
    tennis: { icon: CheckCircle, label: 'Tennis Court' },
    concierge: { icon: Home, label: 'Concierge' },
    security: { icon: Lock, label: '24/7 Security' },
    playground: { icon: Baby, label: 'Playground' },
  };

  const step1Complete = leadForm.timeline && leadForm.financing && leadForm.buyerType && leadForm.budget;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-emerald-600">Home</Link>
            <ChevronRight size={14} />
            <Link to="/listings" className="hover:text-emerald-600">Listings</Link>
            <ChevronRight size={14} />
            <span className="text-gray-800 font-medium truncate max-w-xs">{property.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <div className="relative" style={{ height: '420px' }}>
                <img
                  src={property.images[imgIdx]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                {/* Nav */}
                <button
                  onClick={() => setImgIdx(i => (i - 1 + property.images.length) % property.images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => setImgIdx(i => (i + 1) % property.images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
                >
                  <ChevronRight size={18} />
                </button>
                {/* Dot indicators */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {property.images.map((_, i) => (
                    <button key={i} onClick={() => setImgIdx(i)} className={`w-2 h-2 rounded-full transition-all ${i === imgIdx ? 'bg-white w-4' : 'bg-white/60'}`} />
                  ))}
                </div>
                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                  {property.newLaunch && <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">New Launch</span>}
                  {property.virtualTour && <span className="bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full">360° Tour</span>}
                </div>
                {/* Actions */}
                <div className="absolute top-3 right-3 flex gap-2">
                  <button onClick={() => toggleSave(property.id)} className="w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white">
                    <Heart size={16} className={isSaved ? 'fill-red-500 text-red-500' : 'text-gray-500'} />
                  </button>
                  <button className="w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white">
                    <Share2 size={16} className="text-gray-500" />
                  </button>
                </div>
              </div>
              {/* Thumbnails */}
              <div className="flex gap-2 p-3 overflow-x-auto">
                {property.images.map((img, i) => (
                  <button key={i} onClick={() => setImgIdx(i)} className={`flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${i === imgIdx ? 'border-emerald-500' : 'border-transparent'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Property Info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-emerald-50 text-emerald-700 text-xs font-medium px-2 py-0.5 rounded-full">{property.type}</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${isRent ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>{property.listingType}</span>
                    {property.verified && <span className="flex items-center gap-1 text-xs text-emerald-600"><BadgeCheck size={13} /> Verified</span>}
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">{property.title}</h1>
                  <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                    <MapPin size={14} />
                    <span>{property.address}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900">{formatPrice(property.price)}</div>
                  {!isRent && <div className="text-sm text-gray-400">S${property.pricePerSqft}/psf</div>}
                  <div className="flex items-center gap-1 text-xs text-gray-400 mt-1 justify-end">
                    <Eye size={11} /> {property.viewCount} views
                  </div>
                </div>
              </div>

              {/* Key specs */}
              <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mt-5 pt-5 border-t border-gray-100">
                {[
                  { label: 'Bedrooms', value: property.bedrooms },
                  { label: 'Bathrooms', value: property.bathrooms },
                  { label: 'Floor Area', value: `${property.area.toLocaleString()} sqft` },
                  { label: 'PSF', value: `S$${property.pricePerSqft}` },
                  { label: 'Tenure', value: property.tenure },
                ].map(spec => (
                  <div key={spec.label} className="text-center p-3 bg-gray-50 rounded-xl">
                    <div className="text-sm font-bold text-gray-800">{spec.value}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{spec.label}</div>
                  </div>
                ))}
              </div>

              {/* More details */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                {[
                  { label: 'Floor Level', value: property.floorLevel || 'N/A' },
                  { label: 'Year Built', value: property.yearBuilt },
                  { label: 'Nearest MRT', value: `${property.mrtStation} (${property.mrtDistance} min walk)` },
                  { label: 'Furnishing', value: property.furnishing },
                ].map(d => (
                  <div key={d.label} className="flex justify-between text-sm py-2 border-b border-gray-50">
                    <span className="text-gray-500">{d.label}</span>
                    <span className="font-medium text-gray-800">{d.value}</span>
                  </div>
                ))}
              </div>

              {/* MRT chip */}
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="flex items-center gap-1.5 bg-green-50 text-green-700 text-sm px-3 py-1.5 rounded-full">
                  🚇 {property.mrtStation} · {property.mrtDistance} min walk
                </span>
                <span className="flex items-center gap-1.5 bg-blue-50 text-blue-700 text-sm px-3 py-1.5 rounded-full">
                  🚶 Walk Score: {property.walkScore}/100
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-bold text-gray-900 text-lg mb-3">About this property</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{property.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {property.highlights.map(h => (
                  <span key={h} className="bg-emerald-50 text-emerald-700 text-xs px-3 py-1 rounded-full border border-emerald-100">✓ {h}</span>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-bold text-gray-900 text-lg mb-4">Facilities & Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(property.amenities).map(([key, val]) => {
                  const amenity = amenityIcons[key];
                  if (!amenity) return null;
                  const Icon = amenity.icon;
                  return (
                    <div key={key} className={`flex items-center gap-2 p-3 rounded-xl border ${val ? 'border-emerald-100 bg-emerald-50 text-emerald-700' : 'border-gray-100 bg-gray-50 text-gray-400'}`}>
                      <Icon size={16} />
                      <span className="text-sm">{amenity.label}</span>
                      {!val && <span className="ml-auto text-xs">✗</span>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Nearby */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-bold text-gray-900 text-lg mb-4">Nearby</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {property.nearbySchools.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">🎓 Schools</h3>
                    {property.nearbySchools.map(s => <div key={s} className="text-sm text-gray-500 py-1 border-b border-gray-50 last:border-0">{s}</div>)}
                  </div>
                )}
                {property.nearbyMalls.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">🛍️ Shopping & F&B</h3>
                    {property.nearbyMalls.map(m => <div key={m} className="text-sm text-gray-500 py-1 border-b border-gray-50 last:border-0">{m}</div>)}
                  </div>
                )}
              </div>
            </div>

            {/* Price History */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
                <TrendingUp size={18} className="text-emerald-600" /> Price History
              </h2>
              <div className="space-y-2">
                {property.priceHistory.map((h, i) => {
                  const prev = property.priceHistory[i - 1];
                  const change = prev ? ((h.price - prev.price) / prev.price * 100).toFixed(1) : null;
                  return (
                    <div key={h.month} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <span className="text-sm text-gray-500">{h.month}</span>
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-gray-800">{formatPrice(h.price)}</span>
                        {change && (
                          <span className={`text-xs px-1.5 py-0.5 rounded ${parseFloat(change) >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                            {parseFloat(change) >= 0 ? '+' : ''}{change}%
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Similar Properties */}
            {similar.length > 0 && (
              <div>
                <h2 className="font-bold text-gray-900 text-lg mb-4">Similar Properties</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {similar.map(p => <PropertyCard key={p.id} property={p} compact />)}
                </div>
              </div>
            )}
          </div>

          {/* Right: Lead Capture + Agent */}
          <div className="space-y-4">
            {/* Smart Lead Form */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-4 text-white">
                <div className="flex items-center gap-2">
                  <Shield size={16} className="text-emerald-200" />
                  <span className="text-sm font-medium">Qualified Enquiry</span>
                  <span className="ml-auto text-xs bg-white/20 px-2 py-0.5 rounded-full">{property.enquiryCount} enquiries</span>
                </div>
                <h3 className="text-lg font-bold mt-1">
                  {leadStep === 3 ? 'Enquiry Received!' : leadStep === 1 ? 'Express Your Interest' : 'Your Contact Details'}
                </h3>
              </div>

              <div className="p-5">
                {leadStep === 3 ? (
                  /* Success */
                  <div className="text-center py-4">
                    <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CheckCircle size={28} className="text-emerald-600" />
                    </div>
                    <h4 className="font-bold text-gray-900 mb-1">You're all set!</h4>
                    <p className="text-sm text-gray-500 mb-4">
                      {agent?.name} will contact you within {agent?.responseTime}. Your lead score: <strong className="text-emerald-600">High Priority</strong>
                    </p>
                    <div className="bg-emerald-50 rounded-xl p-3 text-sm text-emerald-700 border border-emerald-100 mb-4">
                      <p className="font-medium">What happens next:</p>
                      <ul className="mt-2 space-y-1 text-xs">
                        <li className="flex items-center gap-1"><CheckCircle size={11} /> Agent reviews your profile</li>
                        <li className="flex items-center gap-1"><CheckCircle size={11} /> Viewing scheduled within 24h</li>
                        <li className="flex items-center gap-1"><CheckCircle size={11} /> Property reserved if serious</li>
                      </ul>
                    </div>
                    <button onClick={() => setLeadStep(1)} className="text-sm text-emerald-600 hover:underline">Submit another enquiry</button>
                  </div>
                ) : leadStep === 1 ? (
                  /* Step 1: Qualification */
                  <div className="space-y-4">
                    <p className="text-xs text-gray-500 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
                      <strong>Why we ask:</strong> Answering these 4 quick questions helps the agent prepare the right information for you, and gets you a faster response.
                    </p>

                    <div>
                      <label className="text-xs font-semibold text-gray-700 block mb-1.5">I am a...</label>
                      <div className="grid grid-cols-2 gap-1.5">
                        {LEAD_BUYER_TYPES.map(t => (
                          <button
                            key={t}
                            onClick={() => setLeadForm(f => ({ ...f, buyerType: t }))}
                            className={`text-xs py-2 px-2 rounded-lg border transition-colors text-left ${leadForm.buyerType === t ? 'border-emerald-500 bg-emerald-50 text-emerald-700 font-medium' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-700 block mb-1.5">When do you plan to {isRent ? 'move in' : 'buy'}?</label>
                      <div className="space-y-1.5">
                        {LEAD_TIMELINES.map(t => (
                          <button
                            key={t}
                            onClick={() => setLeadForm(f => ({ ...f, timeline: t }))}
                            className={`w-full text-xs py-2 px-3 rounded-lg border transition-colors text-left ${leadForm.timeline === t ? 'border-emerald-500 bg-emerald-50 text-emerald-700 font-medium' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-700 block mb-1.5">Financing method</label>
                      <div className="grid grid-cols-2 gap-1.5">
                        {LEAD_FINANCING.map(f => (
                          <button
                            key={f}
                            onClick={() => setLeadForm(lf => ({ ...lf, financing: f }))}
                            className={`text-xs py-2 px-2 rounded-lg border transition-colors text-left ${leadForm.financing === f ? 'border-emerald-500 bg-emerald-50 text-emerald-700 font-medium' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                          >
                            {f}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-700 block mb-1.5">Your budget</label>
                      <input
                        type="text"
                        placeholder={isRent ? 'e.g. S$4,000 - 6,000/mo' : 'e.g. S$1.5M - 2M'}
                        value={leadForm.budget}
                        onChange={e => setLeadForm(f => ({ ...f, budget: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <button
                      onClick={() => step1Complete && setLeadStep(2)}
                      disabled={!step1Complete}
                      className={`w-full py-3 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 ${step1Complete ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                    >
                      Continue <ArrowRight size={16} />
                    </button>
                  </div>
                ) : (
                  /* Step 2: Contact details */
                  <div className="space-y-3">
                    <p className="text-xs text-gray-500">Almost there! The agent needs your contact to follow up.</p>

                    <div>
                      <label className="text-xs font-semibold text-gray-700 block mb-1">Full Name *</label>
                      <input
                        type="text"
                        placeholder="Your full name"
                        value={leadForm.name}
                        onChange={e => setLeadForm(f => ({ ...f, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-700 block mb-1">Email *</label>
                      <input
                        type="email"
                        placeholder="your@email.com"
                        value={leadForm.email}
                        onChange={e => setLeadForm(f => ({ ...f, email: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-700 block mb-1">Phone <span className="text-gray-400">(recommended)</span></label>
                      <input
                        type="tel"
                        placeholder="+65 9xxx xxxx"
                        value={leadForm.phone}
                        onChange={e => setLeadForm(f => ({ ...f, phone: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-700 block mb-1">Message <span className="text-gray-400">(optional)</span></label>
                      <textarea
                        rows={2}
                        placeholder="Any specific questions or requests..."
                        value={leadForm.message}
                        onChange={e => setLeadForm(f => ({ ...f, message: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                      />
                    </div>

                    <button
                      onClick={handleLeadSubmit}
                      disabled={submitting || !leadForm.name || !leadForm.email}
                      className={`w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 ${submitting || !leadForm.name || !leadForm.email ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
                    >
                      {submitting ? 'Sending...' : 'Send Enquiry'}
                      {!submitting && <MessageSquare size={14} />}
                    </button>

                    <button onClick={() => setLeadStep(1)} className="w-full text-xs text-gray-400 hover:text-gray-600">← Back</button>

                    <p className="text-xs text-center text-gray-400">
                      By submitting, you agree to our Terms. Your info is shared only with this agent.
                    </p>
                  </div>
                )}
              </div>

              {/* Quick actions */}
              {leadStep !== 3 && (
                <div className="border-t border-gray-100 grid grid-cols-2">
                  <a href={`tel:${agent?.phone}`} className="flex items-center justify-center gap-2 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 border-r border-gray-100">
                    <Phone size={14} className="text-emerald-600" /> Call
                  </a>
                  <button className="flex items-center justify-center gap-2 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50">
                    <Calendar size={14} className="text-emerald-600" /> Schedule Tour
                  </button>
                </div>
              )}
            </div>

            {/* Agent Card */}
            {agent && (
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-800 mb-3 text-sm">Listed by</h3>
                <div className="flex items-start gap-3">
                  <img src={agent.photo} alt={agent.name} className="w-14 h-14 rounded-xl object-cover" />
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-gray-900">{agent.name}</span>
                      <BadgeCheck size={15} className="text-emerald-500" />
                    </div>
                    <p className="text-xs text-gray-500">{agent.agency}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Star size={11} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-xs font-medium">{agent.rating}</span>
                      <span className="text-xs text-gray-400">({agent.reviews} reviews)</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">CEA: {agent.ceaNumber}</p>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                  {[
                    { label: 'Deals', value: agent.transactions },
                    { label: 'Response', value: agent.responseTime },
                    { label: 'Rating', value: `${agent.rating}★` },
                  ].map(s => (
                    <div key={s.label} className="bg-gray-50 rounded-lg p-2">
                      <div className="text-xs font-bold text-gray-800">{s.value}</div>
                      <div className="text-xs text-gray-400">{s.label}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex flex-wrap gap-1">
                  {agent.badges.slice(0, 2).map(b => (
                    <span key={b} className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">{b}</span>
                  ))}
                </div>
                <div className="mt-3 text-xs text-gray-500">
                  Speaks: {agent.languages.join(', ')}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
