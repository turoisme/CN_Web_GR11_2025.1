import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white font-bold text-lg mb-3">FilmRate</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Your ultimate destination for movie reviews, ratings, and recommendations.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="hover:text-white transition-colors"><Facebook size={18} /></a>
              <a href="#" className="hover:text-white transition-colors"><Twitter size={18} /></a>
              <a href="#" className="hover:text-white transition-colors"><Instagram size={18} /></a>
              <a href="#" className="hover:text-white transition-colors"><Youtube size={18} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/wishlist" className="hover:text-white transition-colors">Wishlist</Link></li>
              <li><Link to="/profile" className="hover:text-white transition-colors">Profile</Link></li>
              <li><Link to="/search" className="hover:text-white transition-colors">Search</Link></li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-white font-bold text-lg mb-3">Features</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/" className="hover:text-white transition-colors">Browse Movies</Link></li>
              <li><Link to="/wishlist" className="hover:text-white transition-colors">My Wishlist</Link></li>
              <li><Link to="/search" className="hover:text-white transition-colors">Search Movies</Link></li>
              <li><Link to="/admin" className="hover:text-white transition-colors">Admin Panel</Link></li>
            </ul>
          </div>

          {/* Help & Info */}
          <div>
            <h3 className="text-white font-bold text-lg mb-3">Help & Info</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="mailto:support@filmrate.com" className="hover:text-white transition-colors">Contact Support</a></li>
              <li><Link to="/admin" className="hover:text-white transition-colors">Admin Panel</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-sm text-gray-400">
          <p>&copy; 2025 FilmRate - Group 11. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
