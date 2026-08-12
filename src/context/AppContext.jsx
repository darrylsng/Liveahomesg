import { createContext, useContext, useState } from 'react';
import { properties } from '../data/properties';
import { leadsData } from '../data/agents';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [searchQuery, setSearchQuery] = useState({ keyword: '', type: 'All Types', listingType: 'Sale', district: 'All Districts', minPrice: '', maxPrice: '', bedrooms: 'Any', tenure: 'All Tenure' });
  const [savedProperties, setSavedProperties] = useState([]);
  const [leads, setLeads] = useState(leadsData);
  const [userRole, setUserRole] = useState('buyer'); // 'buyer' | 'agent'
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'New lead for The Atelier', time: '5 min ago', read: false },
    { id: 2, text: 'James Koh marked as Hot Lead', time: '1 hr ago', read: false },
    { id: 3, text: 'Price drop on Emerald of Katong', time: '3 hr ago', read: true },
  ]);

  const toggleSave = (propertyId) => {
    setSavedProperties(prev =>
      prev.includes(propertyId) ? prev.filter(id => id !== propertyId) : [...prev, propertyId]
    );
  };

  const addLead = (lead) => {
    const score = calculateLeadScore(lead);
    const newLead = {
      ...lead,
      id: leads.length + 1,
      score,
      status: score >= 80 ? 'Hot' : score >= 50 ? 'Warm' : 'Cold',
      date: new Date().toISOString().split('T')[0],
      viewed: false,
      followedUp: false,
    };
    setLeads(prev => [newLead, ...prev]);
    setNotifications(prev => [
      { id: Date.now(), text: `New lead for ${lead.propertyTitle}`, time: 'Just now', read: false },
      ...prev,
    ]);
    return newLead;
  };

  const calculateLeadScore = (lead) => {
    let score = 0;
    // Timeline scoring
    if (lead.timeline === 'Within 1 month') score += 35;
    else if (lead.timeline === 'Within 3 months') score += 25;
    else if (lead.timeline === '3-6 months') score += 15;
    else score += 5;
    // Financing scoring
    if (lead.financing === 'Full Cash') score += 30;
    else if (lead.financing === 'Bank Loan') score += 25;
    else if (lead.financing === 'Cash') score += 28;
    else score += 10;
    // Budget provided
    if (lead.budget && lead.budget !== 'Not specified') score += 20;
    // Phone provided
    if (lead.phone) score += 15;
    return Math.min(score, 100);
  };

  const markLeadFollowedUp = (leadId) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, followedUp: true } : l));
  };

  const markLeadViewed = (leadId) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, viewed: true } : l));
  };

  const markNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const filteredProperties = properties.filter(p => {
    const q = searchQuery;
    if (q.listingType && p.listingType !== q.listingType) return false;
    if (q.type && q.type !== 'All Types' && p.type !== q.type) return false;
    if (q.district && q.district !== 'All Districts' && p.district !== q.district) return false;
    if (q.bedrooms && q.bedrooms !== 'Any' && p.bedrooms < parseInt(q.bedrooms)) return false;
    if (q.minPrice && p.price < parseFloat(q.minPrice)) return false;
    if (q.maxPrice && p.price > parseFloat(q.maxPrice)) return false;
    if (q.tenure && q.tenure !== 'All Tenure' && p.tenure !== q.tenure) return false;
    if (q.keyword) {
      const kw = q.keyword.toLowerCase();
      if (!p.title.toLowerCase().includes(kw) && !p.address.toLowerCase().includes(kw) && !p.district.toLowerCase().includes(kw)) return false;
    }
    return true;
  });

  return (
    <AppContext.Provider value={{
      searchQuery, setSearchQuery,
      savedProperties, toggleSave,
      leads, addLead, markLeadFollowedUp, markLeadViewed,
      userRole, setUserRole,
      notifications, markNotificationsRead,
      filteredProperties,
      allProperties: properties,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
