import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Trash2, Filter, Grid, List } from 'lucide-react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { AuthContext } from '../context/AuthContext';
import listService from '../services/listService';

export default function WishlistPage() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('date-added');
  const [filterGenre, setFilterGenre] = useState('all');

  // Load wishlist from API
  useEffect(() => {
    const loadWishlist = async () => {
      if (!user) {
        setLoading(false);
        setWishlist([]);
        return;
      }

      try {
        setLoading(true);
        const response = await listService.getWatchlist();
        
        // Extract watchlist from response
        const watchlistData = response?.data?.watchlist || [];
        
        // Transform API data to match component's expected format
        const transformedMovies = watchlistData.map(item => {
          console.log('Movie item:', item.movie);
          console.log('Genres:', item.movie.genres);
          return {
            id: item.movie._id,
            title: item.movie.title,
            year: item.movie.releaseYear,
            duration: item.movie.duration ? `${Math.floor(item.movie.duration / 60)}h ${item.movie.duration % 60}m` : 'N/A',
            rating: item.movie.averageRating || 0,
            ratingCount: item.movie.totalRatings || 0,
            genres: Array.isArray(item.movie.genres) 
              ? item.movie.genres.map(g => typeof g === 'string' ? g : g.name).filter(Boolean)
              : [],
            poster: item.movie.posterUrl,
            dateAdded: item.addedAt
          };
        });
        
        console.log('Transformed movies:', transformedMovies);
        setWishlist(transformedMovies);
      } catch (error) {
        console.error('Error loading wishlist:', error);
        setWishlist([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadWishlist();
  }, [user]);

  // Reload wishlist when window gains focus
  useEffect(() => {
    const handleFocus = async () => {
      if (user) {
        try {
          const response = await listService.getWatchlist();
          const watchlistData = response?.data?.watchlist || [];
          const transformedMovies = watchlistData.map(item => ({
            id: item.movie._id,
            title: item.movie.title,
            year: item.movie.releaseYear,
            duration: item.movie.duration ? `${Math.floor(item.movie.duration / 60)}h ${item.movie.duration % 60}m` : 'N/A',
            rating: item.movie.averageRating || 0,
            ratingCount: item.movie.totalRatings || 0,
            genres: Array.isArray(item.movie.genres) 
              ? item.movie.genres.map(g => typeof g === 'string' ? g : g.name).filter(Boolean)
              : [],
            poster: item.movie.posterUrl,
            dateAdded: item.addedAt
          }));
          setWishlist(transformedMovies);
        } catch (error) {
          console.error('Error reloading wishlist:', error);
        }
      }
    };
    
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [user]);

  const handleRemoveFromWishlist = async (movieId) => {
    if (window.confirm('Remove this movie from your wishlist?')) {
      try {
        await listService.removeFromWatchlist(movieId);
        const updatedWishlist = wishlist.filter(movie => movie.id !== movieId);
        setWishlist(updatedWishlist);
      } catch (error) {
        console.error('Error removing from wishlist:', error);
        alert('Failed to remove from wishlist');
      }
    }
  };

  const MovieGridCard = ({ movie }) => (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition overflow-hidden group">
      {/* Poster */}
      <div 
        onClick={() => navigate(`/movie/${movie.id}`)}
        className="relative aspect-[2/3] bg-gray-200 cursor-pointer overflow-hidden"
      >
        {movie.poster ? (
          <img 
            src={movie.poster} 
            alt={movie.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <svg width="120" height="120" viewBox="0 0 120 120">
              <line x1="30" y1="30" x2="90" y2="90" stroke="currentColor" strokeWidth="12" />
              <line x1="90" y1="30" x2="30" y2="90" stroke="currentColor" strokeWidth="12" />
            </svg>
          </div>
        )}
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition flex items-center justify-center">
          <span className="text-white font-semibold opacity-0 group-hover:opacity-100 transition">View Details</span>
        </div>
        {/* Remove button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleRemoveFromWishlist(movie.id);
          }}
          className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-red-700"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 
          onClick={() => navigate(`/movie/${movie.id}`)}
          className="font-bold text-lg text-gray-900 mb-1 cursor-pointer hover:text-blue-600 transition line-clamp-1"
        >
          {movie.title}
        </h3>
        <p className="text-sm text-gray-600 mb-2">{movie.year} • {movie.duration}</p>
        
        <div className="flex items-center gap-2 mb-3">
          <Star size={16} className="text-yellow-500 fill-yellow-500" />
          <span className="font-bold text-gray-900">{movie.rating}/10</span>
          <span className="text-sm text-gray-600">({movie.ratingCount})</span>
        </div>

        <div className="flex flex-wrap gap-1">
          {movie.genres.slice(0, 3).map((genre, index) => (
            <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
              {genre}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  const MovieListCard = ({ movie }) => (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition p-4 flex gap-4 group">
      {/* Poster */}
      <div 
        onClick={() => navigate(`/movie/${movie.id}`)}
        className="relative w-32 flex-shrink-0 aspect-[2/3] bg-gray-200 cursor-pointer rounded overflow-hidden"
      >
        {movie.poster ? (
          <img 
            src={movie.poster} 
            alt={movie.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <svg width="60" height="60" viewBox="0 0 60 60">
              <line x1="15" y1="15" x2="45" y2="45" stroke="currentColor" strokeWidth="6" />
              <line x1="45" y1="15" x2="15" y2="45" stroke="currentColor" strokeWidth="6" />
            </svg>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 
              onClick={() => navigate(`/movie/${movie.id}`)}
              className="font-bold text-xl text-gray-900 mb-1 cursor-pointer hover:text-blue-600 transition"
            >
              {movie.title}
            </h3>
            <p className="text-sm text-gray-600">{movie.year} • {movie.duration}</p>
          </div>
          <button
            onClick={() => handleRemoveFromWishlist(movie.id)}
            className="text-red-600 hover:text-red-700 transition p-2"
          >
            <Trash2 size={20} />
          </button>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <Star size={18} className="text-yellow-500 fill-yellow-500" />
          <span className="font-bold text-gray-900">{movie.rating}/10</span>
          <span className="text-sm text-gray-600">({movie.ratingCount} ratings)</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {movie.genres.map((genre, index) => (
            <span key={index} className="text-sm bg-gray-800 text-white px-3 py-1 rounded">
              {genre}
            </span>
          ))}
        </div>

        <p className="text-sm text-gray-500 mt-3">Added on {new Date(movie.dateAdded).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Wishlist</h1>
          <p className="text-gray-600">
            {wishlist.length} {wishlist.length === 1 ? 'movie' : 'movies'} saved
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              {/* Filter by Genre */}
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-gray-600" />
                <select
                  value={filterGenre}
                  onChange={(e) => setFilterGenre(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 text-sm outline-none cursor-pointer"
                >
                  <option value="all">All Genres</option>
                  <option value="action">Action</option>
                  <option value="adventure">Adventure</option>
                  <option value="fantasy">Fantasy</option>
                  <option value="sci-fi">Sci-Fi</option>
                  <option value="thriller">Thriller</option>
                </select>
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 text-sm outline-none cursor-pointer"
                >
                  <option value="date-added">Date Added</option>
                  <option value="title">Title</option>
                  <option value="rating">Rating</option>
                  <option value="year">Year</option>
                </select>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-gray-100 rounded p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition ${
                  viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                }`}
              >
                <Grid size={20} className={viewMode === 'grid' ? 'text-gray-900' : 'text-gray-600'} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition ${
                  viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                }`}
              >
                <List size={20} className={viewMode === 'list' ? 'text-gray-900' : 'text-gray-600'} />
              </button>
            </div>
          </div>
        </div>

        {/* Movies Grid/List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading your wishlist...</p>
          </div>
        ) : wishlist.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <svg className="w-24 h-24 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-6">Start adding movies you want to watch!</p>
            <button
              onClick={() => navigate('/')}
              className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
            >
              Browse Movies
            </button>
          </div>
        ) : (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'
              : 'flex flex-col gap-4'
          }>
            {wishlist.map((movie) =>
              viewMode === 'grid' ? (
                <MovieGridCard key={movie.id} movie={movie} />
              ) : (
                <MovieListCard key={movie.id} movie={movie} />
              )
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
