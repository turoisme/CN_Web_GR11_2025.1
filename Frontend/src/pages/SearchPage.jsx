import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Star, Filter, X, Calendar, Film, Sparkles, TrendingUp, ArrowUpDown } from 'lucide-react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Loading from '../components/common/Loading';
import movieService from '../services/movieService';

export default function SearchPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    genre: '',
    year: '',
    minRating: 0
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');

  // Auto search when URL has query parameter
  useEffect(() => {
    if (queryParam) {
      performSearch(queryParam);
    }
  }, [queryParam]);

  const performSearch = async (query = queryParam) => {
    if (!query.trim()) return;

    try {
      setLoading(true);
      
      // Build search params
      const params = {
        q: query,
        genre: filters.genre || undefined,
        year: filters.year || undefined,
        minRating: filters.minRating > 0 ? filters.minRating : undefined,
        sortBy: sortBy !== 'relevance' ? sortBy : undefined
      };

      // Remove undefined values
      Object.keys(params).forEach(key => 
        params[key] === undefined && delete params[key]
      );
      
      const response = await movieService.searchMovies(params);

      if (response.success) {
        setMovies(response.data?.movies || response.data || []);
      } else {
        setMovies([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      genre: '',
      year: '',
      minRating: 0
    });
    setSortBy('relevance');
    if (queryParam.trim()) {
      setTimeout(() => performSearch(), 100);
    }
  };

  const applyFilters = () => {
    performSearch();
    setShowFilters(false);
  };

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  // Re-fetch when sort changes
  useEffect(() => {
    if (queryParam && !loading) {
      performSearch();
    }
  }, [sortBy]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl md:text-5xl font-black text-gray-900">
                  Kết quả tìm kiếm
                </h1>
                {queryParam && !loading && (
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                    {movies.length} phim
                  </span>
                )}
              </div>
              {queryParam && (
                <p className="text-lg text-gray-600">
                  Kết quả cho <span className="font-bold text-gray-900">"{queryParam}"</span>
                </p>
              )}
            </div>

            {/* Filter Toggle Button - Desktop */}
            {queryParam && (
              <button 
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={`hidden md:flex items-center gap-2 px-6 py-3 rounded-xl border-2 transition-all duration-300 font-bold shadow-lg hover:shadow-xl ${
                  showFilters 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-200 bg-white text-gray-700 hover:border-blue-500'
                }`}
              >
                <Filter size={20} />
                <span>Bộ lọc & Sắp xếp</span>
              </button>
            )}
          </div>

          {/* Mobile Filter Button */}
          {queryParam && (
            <button 
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`md:hidden w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 transition-all duration-300 font-bold shadow-lg ${
                showFilters 
                  ? 'border-blue-500 bg-blue-50 text-blue-700' 
                  : 'border-gray-200 bg-white text-gray-700'
              }`}
            >
              <Filter size={20} />
              <span>Bộ lọc & Sắp xếp</span>
            </button>
          )}
        </div>

        {/* Filters & Sort Panel */}
        {showFilters && queryParam && (
          <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="bg-white/90 backdrop-blur-xl p-6 rounded-2xl border-2 border-blue-100 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Filter size={20} className="text-blue-600" />
                  Bộ lọc & Sắp xếp
                </h3>
                <button 
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-700 font-semibold px-4 py-2 rounded-lg hover:bg-blue-50 transition"
                >
                  Xóa tất cả
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Sort By */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <ArrowUpDown size={16} className="text-green-600" />
                    Sắp xếp theo
                  </label>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-500 transition bg-white font-medium text-gray-700"
                  >
                    <option value="relevance">Liên quan nhất</option>
                    <option value="rating">Đánh giá cao nhất</option>
                    <option value="year">Năm mới nhất</option>
                    <option value="title">Tên A-Z</option>
                  </select>
                </div>

                {/* Genre Filter */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <Film size={16} className="text-purple-600" />
                    Thể loại
                  </label>
                  <select 
                    value={filters.genre}
                    onChange={(e) => setFilters({...filters, genre: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-500 transition bg-white font-medium text-gray-700"
                  >
                    <option value="">Tất cả thể loại</option>
                    <option value="Action">Hành động</option>
                    <option value="Comedy">Hài</option>
                    <option value="Drama">Chính kịch</option>
                    <option value="Horror">Kinh dị</option>
                    <option value="Science Fiction">Khoa học viễn tưởng</option>
                    <option value="Romance">Lãng mạn</option>
                    <option value="Thriller">Ly kỳ</option>
                    <option value="Animation">Hoạt hình</option>
                  </select>
                </div>

                {/* Year Filter */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <Calendar size={16} className="text-blue-600" />
                    Năm phát hành
                  </label>
                  <select 
                    value={filters.year}
                    onChange={(e) => setFilters({...filters, year: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-500 transition bg-white font-medium text-gray-700"
                  >
                    <option value="">Tất cả các năm</option>
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
                  <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Star size={16} className="text-yellow-500" fill="#eab308" />
                      Đánh giá tối thiểu
                    </span>
                    <span className="text-blue-600 text-lg">{filters.minRating}/10</span>
                  </label>
                  <input 
                    type="range" 
                    min="0" 
                    max="10" 
                    step="0.5"
                    value={filters.minRating}
                    onChange={(e) => setFilters({...filters, minRating: parseFloat(e.target.value)})}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #2563eb 0%, #2563eb ${filters.minRating * 10}%, #e5e7eb ${filters.minRating * 10}%, #e5e7eb 100%)`
                    }}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0</span>
                    <span>5</span>
                    <span>10</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={applyFilters}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-bold shadow-lg"
                >
                  Áp dụng bộ lọc
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {loading ? (
          <Loading />
        ) : !queryParam ? (
          // Initial Empty State
          <div className="text-center py-20">
            <div className="inline-block p-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl mb-6 shadow-xl">
              <Sparkles size={80} className="text-blue-500" />
            </div>
            <h3 className="text-3xl font-black text-gray-900 mb-3">Tìm kiếm phim yêu thích</h3>
            <p className="text-gray-600 text-lg max-w-md mx-auto">
              Sử dụng thanh tìm kiếm ở trên để khám phá hàng ngàn bộ phim tuyệt vời
            </p>
          </div>
        ) : movies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {movies.map((movie) => (
              <div 
                key={movie._id}
                onClick={() => handleMovieClick(movie._id)}
                className="cursor-pointer group"
              >
                {/* Movie Poster Card */}
                <div className="relative aspect-[2/3] bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-500 transform group-hover:-translate-y-2">
                  {movie.posterUrl ? (
                    <>
                      <img 
                        src={movie.posterUrl} 
                        alt={movie.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.querySelector('.fallback-icon').style.display = 'flex';
                        }}
                      />
                      {/* Fallback Icon */}
                      <div className="fallback-icon hidden w-full h-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                        <Film size={48} className="text-gray-300" />
                      </div>
                      
                      {/* Overlay Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Rating Badge */}
                      {movie.averageRating > 0 && (
                        <div className="absolute top-3 right-3 bg-gradient-to-br from-yellow-400 to-orange-500 px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg transform group-hover:scale-110 transition-transform">
                          <Star size={14} className="text-white" fill="white" />
                          <span className="text-white font-black text-sm">
                            {movie.averageRating.toFixed(1)}
                          </span>
                        </div>
                      )}

                      {/* Play Icon on Hover */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 transform scale-75 group-hover:scale-100 transition-transform">
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="text-blue-600">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                      <Film size={48} className="text-gray-300" />
                    </div>
                  )}
                </div>

                {/* Movie Info */}
                <div className="mt-4 px-1">
                  <h3 className="font-bold text-gray-900 text-sm leading-tight line-clamp-2 group-hover:text-blue-600 transition mb-2">
                    {movie.title}
                  </h3>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600 font-semibold bg-gray-100 px-2 py-1 rounded-md">
                      {movie.releaseYear || 'N/A'}
                    </span>
                    {movie.ratingCount > 0 && (
                      <span className="text-gray-500 flex items-center gap-1">
                        <Star size={12} className="text-yellow-500" fill="#eab308" />
                        {movie.ratingCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // No Results State
          <div className="text-center py-20">
            <div className="inline-block p-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl mb-6 shadow-xl">
              <Film size={80} className="text-gray-400" />
            </div>
            <h3 className="text-3xl font-black text-gray-900 mb-3">Không tìm thấy kết quả</h3>
            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
              Không tìm thấy phim nào phù hợp với "<span className="font-bold">{queryParam}</span>". 
              Hãy thử từ khóa khác hoặc điều chỉnh bộ lọc.
            </p>
            {(filters.genre || filters.year || filters.minRating > 0) && (
              <button 
                onClick={clearFilters}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-bold shadow-lg hover:shadow-xl"
              >
                Xóa bộ lọc và thử lại
              </button>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}