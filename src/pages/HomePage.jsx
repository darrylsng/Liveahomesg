import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, TrendingUp, TrendingDown, Shield, Star, ArrowRight, ChevronRight, Zap, Users, BarChart3, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import PropertyCard from '../components/PropertyCard';
import { PROPERTY_TYPES, DISTRICTS, marketInsights } from '../data/properties';
import { agents } from '../data/agents';

const LISTING_TYPES = ['Sale', 'Rent'];

export default function HomePage() {
  const { setSearchQuery, allProperties } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Sale');
  const [keyword, setKeyword] = useState('');
  const [propertyType, setPropertyType] = useState('All Types');
  const [district, setDistrict] = useState('All Districts');
  const [bedrooms, setBedrooms] = useState('Any');

  const featuredProperties = allProperties.filter(p => p.featured && p.listingType === activeTab).slice(0, 3);
  const newLaunches = allProperties.filter(p => p.newLaunch).slice(0, 3);

  const handleSearch = () => {
    setSearchQuery({ keyword, type: propertyType, listingType: activeTab, district, minPrice: '', maxPrice: '', bedrooms, tenure: 'All Tenure' });
    navigate('/listings');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&q=80)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-emerald-700/50 border border-emerald-500/30 px-4 py-1.5 rounded-full text-sm mb-6">
              <Zap size={14} className="text-yellow-400" /> Smart lead generation for serious buyers
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              Find Your Perfect<br /><span className="text-emerald-300">Singapore Home</span>
            </h1>
            <p className="text-lg text-emerald-100 max-w-xl mx-auto">
              Verified listings · Smart matching · Quality leads that close
            </p>
          </div>

          {/* Search Box */}
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-gray-100">
              {LISTING_TYPES.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3.5 text-sm font-semibold transition-colors ${activeTab === tab ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  {tab === 'Sale' ? 'Buy' : 'Rent'}
                </button>
              ))}
            </div>

            <div className="p-4 md:p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
                {/* Keyword */}
                <div className="md:col-span-2 relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, district, MRT..."
                    value={keyword}
                    onChange={e => setKeyword(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSearch()}
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
                {/* Type */}
                <select
                  value={propertyType}
                  onChange={e => setPropertyType(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  {PROPERTY_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
                {/* Bedrooms */}
                <select
                  value={bedrooms}
                  onChange={e => setBedrooms(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  {['Any', '1', '2', '3', '4', '5+'].map(b => <option key={b} value={b}>{b === 'Any' ? 'Any Bedrooms' : `${b} Bed${b !== '1' ? 's' : ''}+`}</option>)}
                </select>
              </div>

              {/* District selector */}
              <div className="flex flex-col sm:flex-row gap-3">
                <select
                  value={district}
                  onChange={e => setDistrict(e.target.value)}
                  className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  {DISTRICTS.slice(0, 10).map(d => <option key={d}>{d}</option>)}
                </select>
                <button
                  onClick={handleSearch}
                  className="sm:w-40 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Search size={16} /> Search
                </button>
              </div>

              {/* Quick searches */}
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="text-xs text-gray-400">Popular:</span>
                {['Orchard Condo', 'HDB Bishan', 'Katong', 'New Launches', 'Freehold'].map(tag => (
                  <button
                    key={tag}
                    onClick={() => { setKeyword(tag); }}
                    className="text-xs text-emerald-600 hover:underline"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-10 grid grid-cols-3 md:grid-cols-3 gap-4 max-w-xl mx-auto text-center">
            {[
              { value: '12,500+', label: 'Active Listings' },
              { value: '3,200+', label: 'Verified Agents' },
              { value: '98%', label: 'Lead Response Rate' },
            ].map(stat => (
              <div key={stat.label}>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-emerald-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Better */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Why LiveAHome.sg is Different</h2>
        <p className="text-gray-500 text-center mb-10">We don't just list properties — we generate quality leads that actually close.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Shield, color: 'emerald', title: 'Verified Listings', desc: 'Every listing is manually verified. No duplicates, no ghost listings. What you see is what you get.', badge: 'Trust' },
            { icon: BarChart3, color: 'blue', title: 'Lead Scoring AI', desc: 'Our smart algorithm scores each enquiry by timeline, financing readiness, and intent — so you focus on buyers who are ready to close.', badge: 'Smart' },
            { icon: Users, color: 'purple', title: 'Buyer Qualification', desc: 'Buyers answer 4 qualification questions before enquiring. You receive their budget, timeline, and financing status upfront.', badge: 'Quality' },
          ].map(({ icon: Icon, color, title, desc, badge }) => (
            <div key={title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className={`w-12 h-12 rounded-xl bg-${color}-50 flex items-center justify-center mb-4`}>
                <Icon size={24} className={`text-${color}-600`} />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-gray-900">{title}</h3>
                <span className={`text-xs bg-${color}-50 text-${color}-600 px-2 py-0.5 rounded-full font-medium`}>{badge}</span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Listings */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Featured {activeTab === 'Sale' ? 'Properties' : 'Rentals'}</h2>
            <p className="text-gray-500 text-sm">Hand-picked by our property experts</p>
          </div>
          <Link to="/listings" className="flex items-center gap-1 text-sm font-medium text-emerald-600 hover:underline">
            See all <ChevronRight size={16} />
          </Link>
        </div>
        <div className="flex gap-2 mb-6">
          {LISTING_TYPES.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${activeTab === tab ? 'bg-emerald-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-emerald-300'}`}
            >
              {tab === 'Sale' ? 'For Sale' : 'For Rent'}
            </button>
          ))}
        </div>
        {featuredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map(p => <PropertyCard key={p.id} property={p} />)}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">No featured listings in this category.</div>
        )}
      </section>

      {/* New Launches Banner */}
      {newLaunches.length > 0 && (
        <section className="bg-gradient-to-r from-orange-50 to-amber-50 border-y border-orange-100 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-orange-500 text-white p-2 rounded-xl">
                  <Zap size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">New Launches</h2>
                  <p className="text-sm text-gray-500">Direct developer prices · Preview discounts</p>
                </div>
              </div>
              <Link to="/listings?new=true" className="text-sm text-orange-600 font-medium flex items-center gap-1 hover:underline">
                View all <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {newLaunches.map(p => <PropertyCard key={p.id} property={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Market Insights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Market Insights</h2>
            <p className="text-sm text-gray-500">Q1 2025 Singapore Property Market</p>
          </div>
          <span className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200">Live Data</span>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Median Resale Price', value: 'S$1.25M', change: '+2.1%', up: true },
            { label: 'Median Rental Yield', value: '3.4%', change: '+0.2%', up: true },
            { label: 'Q1 Transactions', value: '4,823', change: '+5.3%', up: true },
            { label: 'Avg PSF (Prime)', value: 'S$2,350', change: '-0.8%', up: false },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
              <p className="text-xl font-bold text-gray-900">{stat.value}</p>
              <div className={`flex items-center gap-1 text-xs mt-1 ${stat.up ? 'text-emerald-600' : 'text-red-500'}`}>
                {stat.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {stat.change} QoQ
              </div>
            </div>
          ))}
        </div>

        {/* District Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">Price by District</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {['District', 'Avg PSF', 'QoQ Change', 'Transactions'].map(h => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {marketInsights.districts.map(d => (
                  <tr key={d.name} className="hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium text-gray-800">{d.name}</td>
                    <td className="px-6 py-3 text-gray-700">S${d.avgPsf.toLocaleString()}</td>
                    <td className="px-6 py-3">
                      <span className={`flex items-center gap-1 ${d.change > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                        {d.change > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {d.change > 0 ? '+' : ''}{d.change}%
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-600">{d.transactions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Top Agents */}
      <section className="bg-white border-y border-gray-100 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Top Rated Agents</h2>
              <p className="text-sm text-gray-500">Verified professionals with proven track records</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {agents.map(agent => (
              <div key={agent.id} className="bg-gray-50 rounded-2xl p-5 border border-gray-100 hover:border-emerald-200 transition-colors">
                <div className="flex items-start gap-4">
                  <img src={agent.photo} alt={agent.name} className="w-14 h-14 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <h3 className="font-semibold text-gray-900 truncate">{agent.name}</h3>
                      <CheckCircle size={14} className="text-emerald-500 flex-shrink-0" />
                    </div>
                    <p className="text-xs text-gray-500 truncate">{agent.agency}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star size={12} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-xs font-medium">{agent.rating}</span>
                      <span className="text-xs text-gray-400">({agent.reviews} reviews)</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  {[
                    { label: 'Transactions', value: agent.transactions },
                    { label: 'Avg Response', value: agent.responseTime },
                    { label: 'Experience', value: `${agent.experience}y` },
                  ].map(stat => (
                    <div key={stat.label} className="bg-white rounded-lg p-2 border border-gray-100">
                      <div className="text-sm font-bold text-gray-800">{stat.value}</div>
                      <div className="text-xs text-gray-400">{stat.label}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex flex-wrap gap-1">
                  {agent.badges.slice(0, 2).map(badge => (
                    <span key={badge} className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">{badge}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA for Agents */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">List your property today</h2>
            <p className="text-emerald-100">Reach 50,000+ active buyers and renters. Get qualified leads with detailed buyer profiles.</p>
            <ul className="mt-4 space-y-1">
              {['Free listing for first 30 days', 'Smart lead scoring included', 'Buyer qualification forms', 'Analytics dashboard'].map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-emerald-50">
                  <CheckCircle size={14} className="text-emerald-300" /> {f}
                </li>
              ))}
            </ul>
          </div>
          <Link
            to="/list-property"
            className="flex-shrink-0 bg-white text-emerald-700 font-semibold px-8 py-3.5 rounded-xl hover:bg-emerald-50 transition-colors flex items-center gap-2"
          >
            Get Started <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
