import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard, Users, Home, BarChart3, Bell, TrendingUp,
  Phone, Mail, CheckCircle, Clock, Flame, Thermometer, Snowflake,
  Eye, MessageSquare, Plus, Star, BadgeCheck, ArrowUpRight, Filter
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { agents } from '../data/agents';

const TABS = ['Overview', 'Leads', 'Listings', 'Analytics'];

function LeadScoreBadge({ score }) {
  if (score >= 80) return <span className="flex items-center gap-1 bg-red-50 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full"><Flame size={10} /> Hot · {score}</span>;
  if (score >= 50) return <span className="flex items-center gap-1 bg-orange-50 text-orange-600 text-xs font-bold px-2 py-0.5 rounded-full"><Thermometer size={10} /> Warm · {score}</span>;
  return <span className="flex items-center gap-1 bg-blue-50 text-blue-500 text-xs font-bold px-2 py-0.5 rounded-full"><Snowflake size={10} /> Cold · {score}</span>;
}

export default function AgentDashboard() {
  const { leads, markLeadFollowedUp, markLeadViewed, allProperties } = useApp();
  const [activeTab, setActiveTab] = useState('Overview');
  const [leadFilter, setLeadFilter] = useState('All');
  const agent = agents[0]; // Logged in as Sarah Tan

  const agentLeads = leads.slice(0, 8);
  const agentListings = allProperties.filter(p => p.agentId === 1);

  const filteredLeads = leadFilter === 'All' ? agentLeads :
    agentLeads.filter(l => l.status === leadFilter);

  const hotLeads = agentLeads.filter(l => l.status === 'Hot').length;
  const warmLeads = agentLeads.filter(l => l.status === 'Warm').length;
  const unviewedLeads = agentLeads.filter(l => !l.viewed).length;
  const totalEnquiries = agentListings.reduce((sum, p) => sum + p.enquiryCount, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={agent.photo} alt={agent.name} className="w-12 h-12 rounded-xl object-cover" />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-gray-900">{agent.name}</h1>
                  <BadgeCheck size={18} className="text-emerald-500" />
                </div>
                <p className="text-sm text-gray-500">{agent.agency} · CEA {agent.ceaNumber}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="flex items-center gap-1 justify-end">
                  <Star size={14} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-bold">{agent.rating}</span>
                  <span className="text-xs text-gray-400">({agent.reviews} reviews)</span>
                </div>
                <p className="text-xs text-gray-500">{agent.transactions} total transactions</p>
              </div>
              <Link to="/list-property" className="flex items-center gap-1.5 bg-emerald-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
                <Plus size={15} /> List Property
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'Overview' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'New Leads Today', value: unviewedLeads, icon: Users, color: 'emerald', change: '+3 vs yesterday', up: true },
                { label: 'Hot Leads', value: hotLeads, icon: Flame, color: 'red', change: `${warmLeads} warm leads`, up: null },
                { label: 'Total Enquiries', value: totalEnquiries, icon: MessageSquare, color: 'blue', change: 'Across all listings', up: null },
                { label: 'Active Listings', value: agentListings.length, icon: Home, color: 'purple', change: 'All verified', up: null },
              ].map(({ label, value, icon: Icon, color, change, up }) => (
                <div key={label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-500">{label}</span>
                    <div className={`w-9 h-9 rounded-xl bg-${color}-50 flex items-center justify-center`}>
                      <Icon size={18} className={`text-${color}-600`} />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
                  <p className={`text-xs ${up === true ? 'text-emerald-600' : 'text-gray-400'} flex items-center gap-0.5`}>
                    {up === true && <ArrowUpRight size={11} />}{change}
                  </p>
                </div>
              ))}
            </div>

            {/* Performance stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-4">Lead Conversion</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Hot Leads', count: hotLeads, pct: (hotLeads / agentLeads.length * 100).toFixed(0), color: 'red' },
                    { label: 'Warm Leads', count: warmLeads, pct: (warmLeads / agentLeads.length * 100).toFixed(0), color: 'orange' },
                    { label: 'Cold Leads', count: agentLeads.filter(l => l.status === 'Cold').length, pct: (agentLeads.filter(l => l.status === 'Cold').length / agentLeads.length * 100).toFixed(0), color: 'blue' },
                  ].map(item => (
                    <div key={item.label}>
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>{item.label}</span>
                        <span>{item.count} ({item.pct}%)</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full bg-${item.color}-400 rounded-full`} style={{ width: `${item.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-4">Performance</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Conversion Rate', value: `${agent.conversionRate}%`, sub: 'Leads to viewings' },
                    { label: 'Avg Days to Close', value: `${agent.avgDaysToClose} days`, sub: 'From first contact' },
                    { label: 'Sold Last Year', value: `${agent.soldLastYear} units`, sub: 'Total volume' },
                  ].map(s => (
                    <div key={s.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <div>
                        <div className="text-sm text-gray-700">{s.label}</div>
                        <div className="text-xs text-gray-400">{s.sub}</div>
                      </div>
                      <span className="text-sm font-bold text-gray-900">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {agentLeads.slice(0, 4).map(lead => (
                    <div key={lead.id} className="flex items-start gap-2">
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${lead.status === 'Hot' ? 'bg-red-500' : lead.status === 'Warm' ? 'bg-orange-400' : 'bg-blue-400'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-700 truncate">{lead.name}</p>
                        <p className="text-xs text-gray-400 truncate">{lead.propertyTitle}</p>
                      </div>
                      <span className="text-xs text-gray-400 flex-shrink-0">{lead.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Hot leads preview */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame size={16} className="text-red-500" />
                  <h3 className="font-semibold text-gray-800">Hot Leads — Act Now</h3>
                </div>
                <button onClick={() => setActiveTab('Leads')} className="text-xs text-emerald-600 hover:underline">View all</button>
              </div>
              <div className="divide-y divide-gray-50">
                {agentLeads.filter(l => l.status === 'Hot').map(lead => (
                  <div key={lead.id} className="px-5 py-4 flex items-center gap-4 hover:bg-gray-50">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-red-600 font-bold text-sm">{lead.name[0]}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900 text-sm">{lead.name}</span>
                        <LeadScoreBadge score={lead.score} />
                        {!lead.viewed && <span className="w-2 h-2 bg-red-500 rounded-full" />}
                      </div>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{lead.propertyTitle} · {lead.timeline} · {lead.financing}</p>
                      <p className="text-xs text-gray-400 mt-0.5">Budget: {lead.budget}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <a href={`tel:${lead.phone}`} className="w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center hover:bg-emerald-100">
                        <Phone size={13} className="text-emerald-600" />
                      </a>
                      <a href={`mailto:${lead.email}`} className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center hover:bg-blue-100">
                        <Mail size={13} className="text-blue-600" />
                      </a>
                      {!lead.followedUp && (
                        <button
                          onClick={() => markLeadFollowedUp(lead.id)}
                          className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-lg text-gray-600"
                        >
                          Mark Done
                        </button>
                      )}
                      {lead.followedUp && <CheckCircle size={14} className="text-emerald-500" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Leads Tab */}
        {activeTab === 'Leads' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">All Leads ({agentLeads.length})</h2>
              <div className="flex gap-2">
                {['All', 'Hot', 'Warm', 'Cold'].map(f => (
                  <button
                    key={f}
                    onClick={() => setLeadFilter(f)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${leadFilter === f ? 'bg-emerald-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-emerald-300'}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      {['Lead', 'Property', 'Score', 'Budget', 'Timeline', 'Financing', 'Status', 'Actions'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredLeads.map(lead => (
                      <tr key={lead.id} className={`hover:bg-gray-50 ${!lead.viewed ? 'bg-blue-50/30' : ''}`}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                              {lead.name[0]}
                            </div>
                            <div>
                              <div className="flex items-center gap-1">
                                <span className="font-medium text-gray-800">{lead.name}</span>
                                {!lead.viewed && <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />}
                              </div>
                              <div className="text-xs text-gray-400">{lead.date}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-600 max-w-32">
                          <div className="truncate">{lead.propertyTitle}</div>
                          <div className="text-gray-400">{lead.buyerType}</div>
                        </td>
                        <td className="px-4 py-3"><LeadScoreBadge score={lead.score} /></td>
                        <td className="px-4 py-3 text-xs text-gray-600">{lead.budget || '—'}</td>
                        <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">{lead.timeline}</td>
                        <td className="px-4 py-3 text-xs text-gray-600">{lead.financing}</td>
                        <td className="px-4 py-3">
                          {lead.followedUp ? (
                            <span className="flex items-center gap-1 text-xs text-emerald-600"><CheckCircle size={11} /> Done</span>
                          ) : (
                            <span className="flex items-center gap-1 text-xs text-orange-500"><Clock size={11} /> Pending</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <a href={`tel:${lead.phone}`} className="w-7 h-7 bg-emerald-50 rounded-lg flex items-center justify-center hover:bg-emerald-100">
                              <Phone size={12} className="text-emerald-600" />
                            </a>
                            <a href={`mailto:${lead.email}`} className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center hover:bg-blue-100">
                              <Mail size={12} className="text-blue-600" />
                            </a>
                            {!lead.followedUp && (
                              <button
                                onClick={() => markLeadFollowedUp(lead.id)}
                                className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-lg text-gray-600"
                              >
                                Done
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Listings Tab */}
        {activeTab === 'Listings' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">My Listings ({agentListings.length})</h2>
              <Link to="/list-property" className="flex items-center gap-1.5 bg-emerald-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-emerald-700">
                <Plus size={15} /> Add Listing
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {agentListings.map(p => (
                <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex">
                  <img src={p.images[0]} alt={p.title} className="w-32 h-full object-cover flex-shrink-0" />
                  <div className="p-4 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-gray-800 text-sm">{p.title}</h3>
                        <p className="text-xs text-gray-400 mt-0.5">{p.district.split(' - ')[0]}</p>
                      </div>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${p.verified ? 'bg-emerald-50 text-emerald-700' : 'bg-yellow-50 text-yellow-700'}`}>
                        {p.verified ? '✓ Verified' : 'Pending'}
                      </span>
                    </div>
                    <div className="mt-2 text-sm font-bold text-gray-900">
                      {p.listingType === 'Rent' ? `S$${p.price.toLocaleString()}/mo` : p.price >= 1000000 ? `S$${(p.price / 1000000).toFixed(2)}M` : `S$${p.price.toLocaleString()}`}
                    </div>
                    <div className="mt-2 flex gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Eye size={11} /> {p.viewCount}</span>
                      <span className="flex items-center gap-1"><MessageSquare size={11} /> {p.enquiryCount} leads</span>
                    </div>
                    <Link to={`/property/${p.id}`} className="mt-2 inline-block text-xs text-emerald-600 hover:underline">View listing →</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'Analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <TrendingUp size={16} className="text-emerald-600" /> Lead Quality Score Over Time
                </h3>
                <div className="space-y-3">
                  {['Jan 2025', 'Feb 2025', 'Mar 2025'].map((month, i) => {
                    const scores = [68, 74, 82];
                    return (
                      <div key={month}>
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>{month}</span>
                          <span className="font-medium text-emerald-600">{scores[i]}/100</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full" style={{ width: `${scores[i]}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="text-xs text-emerald-600 mt-3 flex items-center gap-1">
                  <ArrowUpRight size={12} /> Lead quality improving by 7% month-on-month
                </p>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <BarChart3 size={16} className="text-blue-600" /> Listing Performance
                </h3>
                <div className="space-y-3">
                  {agentListings.map(p => (
                    <div key={p.id}>
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span className="truncate max-w-32">{p.title}</span>
                        <span>{p.viewCount} views · {p.enquiryCount} leads</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-400 rounded-full" style={{ width: `${Math.min(p.viewCount / 25, 100)}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-white">
              <h3 className="font-bold text-lg mb-1">Your Performance Snapshot</h3>
              <p className="text-emerald-100 text-sm mb-4">You're in the top 15% of agents on LiveAHome.sg</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Response Rate', value: '98%' },
                  { label: 'Conversion', value: `${agent.conversionRate}%` },
                  { label: 'Avg Close', value: `${agent.avgDaysToClose}d` },
                  { label: 'Sold 2024', value: `${agent.soldLastYear}` },
                ].map(s => (
                  <div key={s.label} className="bg-white/10 rounded-xl p-3 text-center">
                    <div className="text-xl font-bold">{s.value}</div>
                    <div className="text-xs text-emerald-200">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
