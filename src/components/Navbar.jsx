import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Home, Bell, Heart, Menu, X, ChevronDown, User, LayoutDashboard, LogOut } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Navbar() {
  const { savedProperties, notifications, markNotificationsRead, userRole, setUserRole } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotifOpen = () => {
    setNotifOpen(!notifOpen);
    if (!notifOpen) markNotificationsRead();
  };

  const navLinks = [
    { label: 'Buy', path: '/listings?type=Sale' },
    { label: 'Rent', path: '/listings?type=Rent' },
    { label: 'New Launches', path: '/listings?new=true' },
    { label: 'Mortgage', path: '/mortgage' },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-emerald-600 text-white rounded-lg p-1.5">
              <Home size={20} />
            </div>
            <span className="text-xl font-bold text-gray-900">LiveAHome<span className="text-emerald-600">.sg</span></span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <Link
                key={link.label}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-emerald-600 ${location.pathname === link.path.split('?')[0] ? 'text-emerald-600' : 'text-gray-700'}`}
              >
                {link.label}
              </Link>
            ))}
            <Link to="/list-property" className="text-sm font-medium text-gray-700 hover:text-emerald-600">
              List Property
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Saved */}
            <Link to="/saved" className="relative hidden sm:flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors">
              <Heart size={20} className="text-gray-600" />
              {savedProperties.length > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {savedProperties.length}
                </span>
              )}
            </Link>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={handleNotifOpen}
                className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
              >
                <Bell size={20} className="text-gray-600" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-gray-100 font-semibold text-gray-800">Notifications</div>
                  {notifications.map(n => (
                    <div key={n.id} className={`px-4 py-3 hover:bg-gray-50 border-b border-gray-50 ${!n.read ? 'bg-emerald-50' : ''}`}>
                      <p className="text-sm text-gray-800">{n.text}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 border border-gray-200 rounded-full px-3 py-1.5 hover:bg-gray-50 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center">
                  <User size={15} className="text-emerald-700" />
                </div>
                <span className="hidden sm:block text-sm font-medium text-gray-700 capitalize">{userRole}</span>
                <ChevronDown size={14} className="text-gray-500" />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50">
                  <div className="p-3 border-b border-gray-100">
                    <p className="text-xs text-gray-500">Viewing as</p>
                    <div className="flex gap-2 mt-1.5">
                      <button onClick={() => { setUserRole('buyer'); setUserMenuOpen(false); }} className={`flex-1 text-xs py-1.5 rounded-lg font-medium transition-colors ${userRole === 'buyer' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600'}`}>Buyer</button>
                      <button onClick={() => { setUserRole('agent'); setUserMenuOpen(false); }} className={`flex-1 text-xs py-1.5 rounded-lg font-medium transition-colors ${userRole === 'agent' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600'}`}>Agent</button>
                    </div>
                  </div>
                  {userRole === 'agent' && (
                    <button onClick={() => { navigate('/dashboard'); setUserMenuOpen(false); }} className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                      <LayoutDashboard size={16} /> Agent Dashboard
                    </button>
                  )}
                  <button onClick={() => { navigate('/list-property'); setUserMenuOpen(false); }} className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                    <Home size={16} /> List a Property
                  </button>
                  <button className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-gray-50 border-t border-gray-100">
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100">
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100 pt-3 space-y-1">
            {navLinks.map(link => (
              <Link key={link.label} to={link.path} onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-emerald-600 hover:bg-gray-50 rounded-lg">
                {link.label}
              </Link>
            ))}
            <Link to="/list-property" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-emerald-600 hover:bg-gray-50 rounded-lg">
              List Property
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
