import { Link } from 'react-router-dom';
import { Home, Share2, MessageCircle, Globe, PlayCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="bg-emerald-500 text-white rounded-lg p-1.5">
                <Home size={18} />
              </div>
              <span className="text-lg font-bold text-white">LiveAHome<span className="text-emerald-400">.sg</span></span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Singapore's smarter property marketplace. Find, compare, and connect with verified agents.
            </p>
            <div className="flex gap-3">
              {[Share2, MessageCircle, Globe, PlayCircle].map((Icon, i) => (
                <button key={i} className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center hover:bg-emerald-600 transition-colors">
                  <Icon size={14} />
                </button>
              ))}
            </div>
          </div>

          {/* Buy */}
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm">Buy</h3>
            <ul className="space-y-2 text-sm">
              {['HDB for Sale', 'Condo for Sale', 'Landed for Sale', 'New Launches', 'Commercial'].map(item => (
                <li key={item}><Link to="/listings" className="hover:text-emerald-400 transition-colors">{item}</Link></li>
              ))}
            </ul>
          </div>

          {/* Rent */}
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm">Rent</h3>
            <ul className="space-y-2 text-sm">
              {['HDB for Rent', 'Condo for Rent', 'Landed for Rent', 'Room Rental', 'Commercial Rent'].map(item => (
                <li key={item}><Link to="/listings" className="hover:text-emerald-400 transition-colors">{item}</Link></li>
              ))}
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm">Tools</h3>
            <ul className="space-y-2 text-sm">
              {['Mortgage Calculator', 'Stamp Duty Calculator', 'ABSD Calculator', 'Market Trends', 'Price Map'].map(item => (
                <li key={item}><Link to="/mortgage" className="hover:text-emerald-400 transition-colors">{item}</Link></li>
              ))}
            </ul>
          </div>

          {/* Agents */}
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm">Agents</h3>
            <ul className="space-y-2 text-sm">
              {['List a Property', 'Agent Dashboard', 'Lead Management', 'Pricing Plans', 'Find an Agent'].map(item => (
                <li key={item}><Link to="/dashboard" className="hover:text-emerald-400 transition-colors">{item}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">© 2025 LiveAHome.sg. All rights reserved. CEA Licensed Estate Agency.</p>
          <div className="flex gap-4 text-xs text-gray-500">
            <Link to="/" className="hover:text-gray-300">Privacy Policy</Link>
            <Link to="/" className="hover:text-gray-300">Terms of Use</Link>
            <Link to="/" className="hover:text-gray-300">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
