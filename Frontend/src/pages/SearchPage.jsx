import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Star, Filter, X } from 'lucide-react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Loading from '../components/common/Loading';
import movieService from '../services/movieService';

export default function SearchPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [searchType, setSearchType] = useState('all');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    genre: '',
    year: '',
    minRating: 0
  });
  const [showFilters, setShowFilters] = useState(false);

  // Search movies
  useEffect(() => {
    if (queryParam) {
      performSearch(queryParam);
    }
  }, [queryParam]);

  const performSearch = async (query) => {
    if (!query || !query.trim()) return;

    try {
      setLoading(true);
      const response = await movieService.searchMovies({
        q: query
      });

      if (response.success) {
        setMovies(response.data?.movies || []);
      }
    } catch (error) {
      console.error('Search error:', error);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    await performSearch(searchQuery);
  };

  const clearFilters = () => {
    setFilters({
      genre: '',
      year: '',
      minRating: 0
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Search Movies</h1>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-4 mb-4">
            <div className="flex-1 flex items-center gap-2 bg-white px-4 py-3 rounded-lg border-2 border-gray-200 focus-within:border-gray-900 transition">
              <select 
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="bg-transparent outline-none text-sm font-medium text-gray-700 border-r border-gray-300 pr-3"
              >
                <option value="all">All</option>
                <option value="title">Title</option>
                <option value="actor">Actor</option>
                <option value="director">Director</option>
              </select>
              <Search size={20} className="text-gray-500" />
              <input 
                type="text" 
                placeholder="Search for movies, actors, directors..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent outline-none text-base flex-1 w-full"
              />
            </div>
            <button 
              type="submit"
              className="bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition font-semibold"
            >
              Search
            </button>
            <button 
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="bg-white text-gray-700 px-6 py-3 rounded-lg border-2 border-gray-200 hover:border-gray-900 transition font-semibold flex items-center gap-2"
            >
              <Filter size={20} />
              Filters
            </button>
          </form>

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-white p-6 rounded-lg border border-gray-200 mb-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                <button 
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear All
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Genre Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Genre</label>
                  <select 
                    value={filters.genre}
                    onChange={(e) => setFilters({...filters, genre: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-gray-900"
                  >
                    <option value="">All Genres</option>
                    <option value="Action">Action</option>
                    <option value="Comedy">Comedy</option>
                    <option value="Drama">Drama</option>
                    <option value="Horror">Horror</option>
                    <option value="Science Fiction">Science Fiction</option>
                    <option value="Romance">Romance</option>
                    <option value="Thriller">Thriller</option>
                    <option value="Animation">Animation</option>
                  </select>
                </div>

                {/* Year Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Year</label>
                  <select 
                    value={filters.year}
                    onChange={(e) => setFilters({...filters, year: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-gray-900"
                  >
                    <option value="">All Years</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                    <option value="2021">2021</option>
                    <option value="2020">2020</option>
                    <option value="2019">2019</option>
                    <option value="2018">2018</option>
                    <option value="2015-2017">2015-2017</option>
                    <option value="2010-2014">2010-2014</option>
                    <option value="2000-2009">2000-2009</option>
                    <option value="1990-1999">1990-1999</option>
                  </select>
                </div>

                {/* Rating Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Min Rating: {filters.minRating}/10
                  </label>
                  <input 
                    type="range" 
                    min="0" 
                    max="10" 
                    step="0.5"
                    value={filters.minRating}
                    onChange={(e) => setFilters({...filters, minRating: parseFloat(e.target.value)})}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Search Info */}
          {searchQuery && !loading && (
            <p className="text-gray-600">
              {movies.length > 0 ? (
                <>Found <span className="font-semibold text-gray-900">{movies.length}</span> results for "<span className="font-semibold">{searchQuery}</span>"</>
              ) : (
                <>No results found for "<span className="font-semibold">{searchQuery}</span>"</>
              )}
            </p>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <Loading />
        ) : movies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {movies.map((movie) => (
              <div 
                key={movie._id}
                onClick={() => navigate(`/movie/${movie._id}`)}
                className="cursor-pointer group"
              >
                {/* Movie Poster */}
                <div className="aspect-[2/3] bg-gray-200 rounded-lg overflow-hidden shadow-md group-hover:shadow-2xl transition-all duration-300 relative">
                  {movie.posterUrl ? (
                    <>
                      <img 
                        src={movie.posterUrl} 
                        alt={movie.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {/* Rating Badge */}
                      {movie.averageRating > 0 && (
                        <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1">
                          <Star size={14} className="text-yellow-400" fill="#facc15" />
                          <span className="text-white font-bold text-xs">
                            {movie.averageRating.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <div className="text-gray-300">
                        <svg width="80" height="80" viewBox="0 0 100 100">
                          <line x1="20" y1="20" x2="80" y2="80" stroke="currentColor" strokeWidth="8" />
                          <line x1="80" y1="20" x2="20" y2="80" stroke="currentColor" strokeWidth="8" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>

                {/* Movie Info */}
                <div className="mt-3">
                  <h3 className="font-bold text-gray-900 text-sm line-clamp-2 group-hover:text-blue-600 transition">
                    {movie.title}
                  </h3>
                  <div className="flex items-center justify-between mt-1 text-xs text-gray-600">
                    <span>{movie.releaseYear || 'N/A'}</span>
                    {movie.ratingCount > 0 && (
                      <span>{movie.ratingCount} ratings</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : !loading && searchQuery ? (
          <div className="text-center py-16">
            <div className="inline-block p-6 bg-gray-100 rounded-full mb-6">
              <Search size={64} className="text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search terms or filters</p>
            <button 
              onClick={clearFilters}
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Clear filters and try again
            </button>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-block p-6 bg-gray-100 rounded-full mb-6">
              <Search size={64} className="text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Start searching</h3>
            <p className="text-gray-600">Enter a movie title, actor, or director above</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}