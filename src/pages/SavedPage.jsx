import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';
import PropertyCard from '../components/PropertyCard';

export default function SavedPage() {
  const { savedProperties, allProperties } = useApp();
  const saved = allProperties.filter(p => savedProperties.includes(p.id));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center gap-3">
            <Heart size={20} className="text-red-500 fill-red-500" />
            <h1 className="text-xl font-bold text-gray-900">Saved Properties</h1>
            <span className="bg-gray-100 text-gray-600 text-sm px-2 py-0.5 rounded-full">{saved.length}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {saved.length === 0 ? (
          <div className="text-center py-20">
            <Heart size={48} className="text-gray-200 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No saved properties yet</h3>
            <p className="text-gray-400 mb-6">Click the heart icon on any listing to save it here</p>
            <Link to="/listings" className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-emerald-700 transition-colors">
              Browse Listings
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {saved.map(p => <PropertyCard key={p.id} property={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
