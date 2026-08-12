import { Link } from 'react-router-dom';
import { Heart, MapPin, BedDouble, Bath, Maximize, Star, BadgeCheck, Zap, Eye } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { agents } from '../data/agents';

export default function PropertyCard({ property, compact = false }) {
  const { savedProperties, toggleSave } = useApp();
  const isSaved = savedProperties.includes(property.id);
  const agent = agents.find(a => a.id === property.agentId);
  const isRent = property.listingType === 'Rent';

  const formatPrice = (price) => {
    if (isRent) return `S$${price.toLocaleString()}/mo`;
    if (price >= 1000000) return `S$${(price / 1000000).toFixed(2)}M`;
    return `S$${price.toLocaleString()}`;
  };

  return (
    <div className={`bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all group ${compact ? '' : 'hover:-translate-y-0.5'}`}>
      {/* Image */}
      <div className="relative overflow-hidden" style={{ height: compact ? '160px' : '200px' }}>
        <Link to={`/property/${property.id}`}>
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
          {property.newLaunch && (
            <span className="bg-orange-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
              <Zap size={10} /> New Launch
            </span>
          )}
          {property.featured && !property.newLaunch && (
            <span className="bg-emerald-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">Featured</span>
          )}
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${isRent ? 'bg-blue-600 text-white' : 'bg-white text-gray-800'}`}>
            {property.type}
          </span>
        </div>

        {/* Save button */}
        <button
          onClick={() => toggleSave(property.id)}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:scale-110 transition-transform"
        >
          <Heart size={16} className={isSaved ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
        </button>

        {/* Virtual tour badge */}
        {property.virtualTour && (
          <span className="absolute bottom-3 left-3 bg-black/70 text-white text-xs px-2 py-0.5 rounded-full">
            360° Tour
          </span>
        )}

        {/* View count */}
        <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
          <Eye size={10} /> {property.viewCount}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Price */}
        <div className="flex items-baseline justify-between mb-1">
          <span className="text-xl font-bold text-gray-900">{formatPrice(property.price)}</span>
          {!isRent && property.pricePerSqft && (
            <span className="text-xs text-gray-400">S${property.pricePerSqft}/psf</span>
          )}
        </div>

        {/* Title */}
        <Link to={`/property/${property.id}`}>
          <h3 className="font-semibold text-gray-800 hover:text-emerald-600 transition-colors line-clamp-1 mb-1">
            {property.title}
          </h3>
        </Link>

        {/* Address */}
        <div className="flex items-center gap-1 text-gray-500 text-xs mb-3">
          <MapPin size={11} />
          <span className="line-clamp-1">{property.address}</span>
        </div>

        {/* Specs */}
        <div className="flex items-center gap-3 text-sm text-gray-600 border-t border-gray-100 pt-3 mb-3">
          <div className="flex items-center gap-1">
            <BedDouble size={14} className="text-gray-400" />
            <span>{property.bedrooms} {compact ? 'bd' : 'Bed'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath size={14} className="text-gray-400" />
            <span>{property.bathrooms} {compact ? 'ba' : 'Bath'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Maximize size={14} className="text-gray-400" />
            <span>{property.area.toLocaleString()} sqft</span>
          </div>
        </div>

        {/* MRT & Tenure */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
          <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded-full">🚇 {property.mrtStation} · {property.mrtDistance} min</span>
          <span className="bg-gray-50 text-gray-600 px-2 py-0.5 rounded-full">{property.tenure}</span>
        </div>

        {/* Agent */}
        {!compact && agent && (
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <img src={agent.photo} alt={agent.name} className="w-7 h-7 rounded-full object-cover" />
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-medium text-gray-700">{agent.name}</span>
                  {agent.badges.includes('Verified') && <BadgeCheck size={11} className="text-emerald-500" />}
                </div>
                <div className="flex items-center gap-1">
                  <Star size={10} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-xs text-gray-400">{agent.rating}</span>
                </div>
              </div>
            </div>
            <Link
              to={`/property/${property.id}`}
              className="text-xs font-medium text-emerald-600 border border-emerald-200 px-3 py-1 rounded-full hover:bg-emerald-50 transition-colors"
            >
              Enquire
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
