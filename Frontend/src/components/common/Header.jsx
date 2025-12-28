import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Heart, Bell, Settings, Search, User, LogOut, Menu, X } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import LoginSignupModal from '../auth/LoginSignupModal';

export default function Header() {
  const { user, logout } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const navigate = useNavigate();

  // Debug: Log user state
  console.log('Header - Current user:', user);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 sticky top-0 z-50">
      <div className="flex items-center gap-6 max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center flex-shrink-0">
          <img 
            src="/logo/Logo.png" 
            alt="FilmRate Logo" 
            className="h-12 object-contain"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/wishlist" className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition whitespace-nowrap">
            <Heart size={20} />
            <span className="font-medium">Wishlist</span>
          </Link>
        </nav>

        {/* Search Bar - Expanded */}
        <form onSubmit={handleSearch} className="hidden md:flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg flex-1 max-w-2xl">
          <select className="bg-transparent outline-none text-sm font-medium text-gray-700">
            <option>All</option>
            <option>Name</option>
            <option>Actor</option>
            <option>Director</option>
          </select>
          <Search size={18} className="text-gray-500" />
          <input 
            type="text" 
            placeholder="Search for..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent outline-none text-sm flex-1 w-full"
          />
        </form>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-4 flex-shrink-0">
          {user ? (
            <>
              <Link to="/profile" className="flex items-center gap-2 text-gray-700 hover:text-gray-900">
                <User size={20} />
                <span className="font-medium">{user.username}</span>
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  Admin
                </Link>
              )}
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-gray-700 hover:text-red-600 transition"
              >
                <LogOut size={20} />
                <span className="font-medium">Logout</span>
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => setShowAuthModal(true)}
                className="text-gray-700 hover:text-gray-900 font-medium"
              >
                Login
              </button>
              <button 
                onClick={() => setShowAuthModal(true)}
                className="text-gray-700 hover:text-gray-900 font-medium"
              >
                Sign Up
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 pb-4 border-t pt-4">
          <nav className="flex flex-col gap-4">
            <Link to="/" className="text-gray-700 hover:text-gray-900">Home</Link>
            <Link to="/movies" className="text-gray-700 hover:text-gray-900">Movies</Link>
            <Link to="/reviews" className="text-gray-700 hover:text-gray-900">Reviews</Link>
            {user ? (
              <>
                <Link to="/watchlist" className="text-gray-700 hover:text-gray-900">Watchlist</Link>
                <Link to="/profile" className="text-gray-700 hover:text-gray-900">Profile</Link>
                <button onClick={handleLogout} className="text-left text-gray-700 hover:text-gray-900">
                  Logout
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => setShowAuthModal(true)}
                  className="text-left text-gray-700 hover:text-gray-900"
                >
                  Login
                </button>
                <button 
                  onClick={() => setShowAuthModal(true)}
                  className="text-left text-gray-700 hover:text-gray-900"
                >
                  Sign Up
                </button>
              </>
            )}
          </nav>
        </div>
      )}

      {/* Login/Signup Modal */}
      <LoginSignupModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </header>
  );
}
