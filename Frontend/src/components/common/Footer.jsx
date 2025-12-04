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
              <li><Link to="/movies" className="hover:text-white transition-colors">Movies</Link></li>
              <li><Link to="/reviews" className="hover:text-white transition-colors">Reviews</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-bold text-lg mb-3">Categories</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/genre/action" className="hover:text-white transition-colors">Action</Link></li>
              <li><Link to="/genre/comedy" className="hover:text-white transition-colors">Comedy</Link></li>
              <li><Link to="/genre/drama" className="hover:text-white transition-colors">Drama</Link></li>
              <li><Link to="/genre/thriller" className="hover:text-white transition-colors">Thriller</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-bold text-lg mb-3">Support</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
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
