import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, X, ChevronDown, MapPin, Grid3X3, List, ArrowUpDown } from 'lucide-react';
import { useApp } from '../context/AppContext';
import PropertyCard from '../components/PropertyCard';
import { PROPERTY_TYPES, DISTRICTS, TENURE_TYPES } from '../data/properties';

const BEDROOM_OPTIONS = ['Any', '1', '2', '3', '4', '5+'];
const SORT_OPTIONS = ['Newest', 'Price: Low to High', 'Price: High to Low', 'Most Popular', 'Highest PSF'];
const PRICE_RANGES_SALE = [
  { label: 'Any', min: '', max: '' },
  { label: 'Under S$500K', min: '', max: '500000' },
  { label: 'S$500K - S$800K', min: '500000', max: '800000' },
  { label: 'S$800K - S$1.2M', min: '800000', max: '1200000' },
  { label: 'S$1.2M - S$2M', min: '1200000', max: '2000000' },
  { label: 'S$2M - S$5M', min: '2000000', max: '5000000' },
  { label: 'Above S$5M', min: '5000000', max: '' },
];
const PRICE_RANGES_RENT = [
  { label: 'Any', min: '', max: '' },
  { label: 'Under S$2,000', min: '', max: '2000' },
  { label: 'S$2,000 - S$4,000', min: '2000', max: '4000' },
  { label: 'S$4,000 - S$7,000', min: '4000', max: '7000' },
  { label: 'S$7,000 - S$12,000', min: '7000', max: '12000' },
  { label: 'Above S$12,000', min: '12000', max: '' },
];

export default function ListingsPage() {
  const { searchQuery, setSearchQuery, filteredProperties, allProperties } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('Newest');
  const [viewMode, setViewMode] = useState('grid');
  const [localFilters, setLocalFilters] = useState({ ...searchQuery });

  // Parse URL params on mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const type = params.get('type');
    const newLaunch = params.get('new');
    if (type) setLocalFilters(f => ({ ...f, listingType: type }));
    if (newLaunch) setLocalFilters(f => ({ ...f, newLaunch: true }));
  }, [location.search]);

  const applyFilters = () => {
    setSearchQuery(localFilters);
    setShowFilters(false);
  };

  const clearFilters = () => {
    const cleared = { keyword: '', type: 'All Types', listingType: localFilters.listingType, district: 'All Districts', minPrice: '', maxPrice: '', bedrooms: 'Any', tenure: 'All Tenure' };
    setLocalFilters(cleared);
    setSearchQuery(cleared);
  };

  // Sort
  const sorted = [...filteredProperties].sort((a, b) => {
    if (sortBy === 'Price: Low to High') return a.price - b.price;
    if (sortBy === 'Price: High to Low') return b.price - a.price;
    if (sortBy === 'Most Popular') return b.viewCount - a.viewCount;
    if (sortBy === 'Highest PSF') return b.pricePerSqft - a.pricePerSqft;
    return new Date(b.postedDate) - new Date(a.postedDate);
  });

  const isRent = localFilters.listingType === 'Rent';
  const priceRanges = isRent ? PRICE_RANGES_RENT : PRICE_RANGES_SALE;

  const activeFilterCount = [
    localFilters.keyword, localFilters.type !== 'All Types', localFilters.district !== 'All Districts',
    localFilters.minPrice, localFilters.maxPrice, localFilters.bedrooms !== 'Any', localFilters.tenure !== 'All Tenure'
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search bar strip */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex gap-2 items-center">
            {/* Listing type toggle */}
            <div className="flex bg-gray-100 rounded-lg p-0.5">
              {['Sale', 'Rent'].map(t => (
                <button
                  key={t}
                  onClick={() => setLocalFilters(f => ({ ...f, listingType: t }))}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${localFilters.listingType === t ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  {t === 'Sale' ? 'Buy' : 'Rent'}
                </button>
              ))}
            </div>

            {/* Search input */}
            <div className="flex-1 relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={localFilters.keyword}
                onChange={e => setLocalFilters(f => ({ ...f, keyword: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && applyFilters()}
                className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Type */}
            <select
              value={localFilters.type}
              onChange={e => setLocalFilters(f => ({ ...f, type: e.target.value }))}
              className="hidden md:block px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {PROPERTY_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>

            {/* Filters toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${showFilters || activeFilterCount > 0 ? 'border-emerald-500 text-emerald-600 bg-emerald-50' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
            >
              <SlidersHorizontal size={15} />
              Filters
              {activeFilterCount > 0 && (
                <span className="bg-emerald-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">{activeFilterCount}</span>
              )}
            </button>

            <button onClick={applyFilters} className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors">
              Search
            </button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {/* District */}
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">District</label>
                  <select
                    value={localFilters.district}
                    onChange={e => setLocalFilters(f => ({ ...f, district: e.target.value }))}
                    className="w-full px-2 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {DISTRICTS.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                {/* Bedrooms */}
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Bedrooms</label>
                  <select
                    value={localFilters.bedrooms}
                    onChange={e => setLocalFilters(f => ({ ...f, bedrooms: e.target.value }))}
                    className="w-full px-2 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {BEDROOM_OPTIONS.map(b => <option key={b}>{b === 'Any' ? 'Any' : `${b}+`}</option>)}
                  </select>
                </div>
                {/* Price */}
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Price Range</label>
                  <select
                    onChange={e => {
                      const range = priceRanges[e.target.value];
                      setLocalFilters(f => ({ ...f, minPrice: range.min, maxPrice: range.max }));
                    }}
                    className="w-full px-2 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {priceRanges.map((r, i) => <option key={r.label} value={i}>{r.label}</option>)}
                  </select>
                </div>
                {/* Tenure */}
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Tenure</label>
                  <select
                    value={localFilters.tenure}
                    onChange={e => setLocalFilters(f => ({ ...f, tenure: e.target.value }))}
                    className="w-full px-2 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {TENURE_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <button onClick={applyFilters} className="bg-emerald-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-emerald-700">Apply Filters</button>
                <button onClick={clearFilters} className="text-gray-500 px-4 py-1.5 rounded-lg text-sm hover:bg-gray-200 transition-colors">Clear All</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header row */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-lg font-bold text-gray-900">
              {sorted.length} Properties {localFilters.listingType === 'Sale' ? 'for Sale' : 'for Rent'}
            </h1>
            {localFilters.district !== 'All Districts' && (
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <MapPin size={12} /> {localFilters.district}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="pl-3 pr-8 py-1.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none"
              >
                {SORT_OPTIONS.map(s => <option key={s}>{s}</option>)}
              </select>
              <ArrowUpDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            {/* View toggle */}
            <div className="hidden sm:flex bg-gray-100 rounded-lg p-0.5">
              <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}>
                <Grid3X3 size={15} className="text-gray-600" />
              </button>
              <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}>
                <List size={15} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Active filter chips */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {localFilters.type !== 'All Types' && (
              <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs px-3 py-1 rounded-full border border-emerald-200">
                {localFilters.type}
                <button onClick={() => { setLocalFilters(f => ({ ...f, type: 'All Types' })); setSearchQuery(s => ({ ...s, type: 'All Types' })); }}>
                  <X size={11} />
                </button>
              </span>
            )}
            {localFilters.district !== 'All Districts' && (
              <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs px-3 py-1 rounded-full border border-emerald-200">
                {localFilters.district.split(' - ')[0]}
                <button onClick={() => { setLocalFilters(f => ({ ...f, district: 'All Districts' })); setSearchQuery(s => ({ ...s, district: 'All Districts' })); }}>
                  <X size={11} />
                </button>
              </span>
            )}
            {localFilters.bedrooms !== 'Any' && (
              <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs px-3 py-1 rounded-full border border-emerald-200">
                {localFilters.bedrooms}+ Bed
                <button onClick={() => { setLocalFilters(f => ({ ...f, bedrooms: 'Any' })); setSearchQuery(s => ({ ...s, bedrooms: 'Any' })); }}>
                  <X size={11} />
                </button>
              </span>
            )}
            <button onClick={clearFilters} className="text-xs text-red-500 hover:underline px-1">Clear all</button>
          </div>
        )}

        {/* Grid/List */}
        {sorted.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🏠</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No properties found</h3>
            <p className="text-gray-400 mb-4">Try adjusting your filters or search terms</p>
            <button onClick={clearFilters} className="bg-emerald-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700">
              Clear Filters
            </button>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {sorted.map(p => <PropertyCard key={p.id} property={p} compact={viewMode === 'list'} />)}
          </div>
        )}
      </div>
    </div>
  );
}
