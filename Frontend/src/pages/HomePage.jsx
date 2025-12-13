<<<<<<< Updated upstream
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Play, Menu } from 'lucide-react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

export default function HomePage() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 7;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Carousel */}
      <section className="bg-gray-200 relative py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            {/* Left Arrow */}
            <button 
              onClick={prevSlide}
              className="p-3 hover:bg-gray-300 rounded-full transition flex-shrink-0 z-10"
            >
              <ChevronLeft size={40} className="text-gray-700" strokeWidth={2.5} />
            </button>

            {/* Content Area */}
            <div className="flex items-center justify-between flex-1 px-12">
              {/* Movie Info */}
              <div className="space-y-3">
                <div className="text-lg font-medium text-gray-800">2025 2h25m</div>
                <div className="text-base text-gray-800">
                  <span className="font-semibold">United State</span>
                  <span className="mx-2">|</span>
                  <span>Crime, Thriller, Honor</span>
                </div>
                <button className="bg-gray-800 text-white px-7 py-3 flex items-center gap-2 hover:bg-gray-700 transition rounded-md mt-4">
                  <Play size={20} fill="white" />
                  <span className="font-medium">Watch Trailer</span>
                </button>
              </div>

              {/* Movie Poster */}
              <div 
                onClick={() => navigate('/movie/1')}
                className="w-72 h-96 bg-white flex items-center justify-center shadow-2xl cursor-pointer hover:opacity-80 transition"
              >
                <div className="text-gray-300">
                  <svg width="180" height="180" viewBox="0 0 180 180">
                    <line x1="30" y1="30" x2="150" y2="150" stroke="currentColor" strokeWidth="18" />
                    <line x1="150" y1="30" x2="30" y2="150" stroke="currentColor" strokeWidth="18" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Right Arrow */}
            <button 
              onClick={nextSlide}
              className="p-3 hover:bg-gray-300 rounded-full transition flex-shrink-0 z-10"
            >
              <ChevronRight size={40} className="text-gray-700" strokeWidth={2.5} />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {[...Array(totalSlides)].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2.5 rounded-full transition-all ${
                  index === currentSlide ? 'bg-gray-700 w-10' : 'bg-gray-400 w-2.5'
                }`}
              />
            ))}
=======
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Star,
  Clock,
  Heart,
  TrendingUp,
  Calendar,
  Film,
  Sparkles,
  Plus,
} from 'lucide-react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { AuthContext } from '../context/AuthContext';
import movieService from '../services/movieService';
import listService from '../services/listService';

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = [];
  // Fetch all data
  useEffect(() => {
    fetchAllData();
    if (user) {
      fetchWishlist();
    }
  }, [user]);

  const fetchAllData = async () => {
    try {
      setLoading(true);

      // Fetch all movies
      const allMoviesResponse = await movieService.getAllMovies({ limit: 50 });
      const allMovies = allMoviesResponse.data?.movies || allMoviesResponse.data || [];

      // Featured movies (top 5 highest rated)
      const featured = [...allMovies]
        .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
        .slice(0, 5);
      setFeaturedMovies(featured);

      // Top rated movies
      const topRatedResponse = await movieService.getTopRatedMovies(12);
      setTopRatedMovies(topRatedResponse.data?.movies || topRatedResponse.data || []);

      // Trending movies (random selection for demo)
      const trending = [...allMovies]
        .sort(() => Math.random() - 0.5)
        .slice(0, 12);
      setTrendingMovies(trending);

      // New releases (sorted by release year)
      const newMovies = [...allMovies]
        .sort((a, b) => (b.releaseYear || 0) - (a.releaseYear || 0))
        .slice(0, 12);
      setNewReleases(newMovies);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWishlist = async () => {
    try {
      const response = await listService.getWatchlist();
      if (response.success) {
        const movieIds = (response.data?.movies || []).map(m => m._id || m.id);
        setWishlist(movieIds);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  const toggleWishlist = async (movieId) => {
    if (!user) {
      alert('Vui lòng đăng nhập để thêm vào danh sách yêu thích!');
      return;
    }

    try {
      if (wishlist.includes(movieId)) {
        await listService.removeFromWatchlist(movieId);
        setWishlist(prev => prev.filter(id => id !== movieId));
      } else {
        await listService.addToWatchlist(movieId);
        setWishlist(prev => [...prev, movieId]);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      alert('Có lỗi xảy ra, vui lòng thử lại!');
    }
  };

  // Auto-play carousel
  useEffect(() => {
    if (featuredMovies.length === 0) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredMovies.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [featuredMovies.length]);

  const MovieCard = ({ movie, size = 'normal' }) => (
    <div 
      onClick={() => navigate(`/movie/${movie._id}`)}
      className="group relative bg-gray-800 rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/30 cursor-pointer"
    >
      <div className={`${size === 'large' ? 'aspect-[2/3]' : 'aspect-[2/3]'} bg-gray-900 relative overflow-hidden`}>
        {movie.posterUrl ? (
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.querySelector('.fallback-icon').style.display = 'flex';
            }}
          />
        ) : null}
        
        {/* Fallback Icon */}
        <div className={`fallback-icon ${movie.posterUrl ? 'hidden' : 'flex'} w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 items-center justify-center`}>
          <Film size={size === 'large' ? 80 : 60} className="text-gray-600" />
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 transform scale-0 group-hover:scale-100 transition-transform duration-300">
            <Play size={24} fill="white" />
          </div>
        </div>

        {/* Rating badge */}
        {movie.averageRating > 0 && (
          <div className="absolute top-3 left-3 bg-gradient-to-br from-yellow-400 to-orange-500 text-white px-2.5 py-1 rounded-lg font-bold text-sm flex items-center gap-1 shadow-lg">
            <Star size={14} fill="white" />
            {movie.averageRating.toFixed(1)}
          </div>
        )}

        {/* Wishlist button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(movie._id);
          }}
          className="absolute top-3 right-3 bg-black/70 hover:bg-black/90 text-white rounded-full p-2 transition-all backdrop-blur-sm z-10"
        >
          <Heart
            size={18}
            fill={wishlist.includes(movie._id) ? 'red' : 'none'}
            stroke={wishlist.includes(movie._id) ? 'red' : 'white'}
          />
        </button>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-white mb-2 line-clamp-1 group-hover:text-blue-400 transition">
          {movie.title}
        </h3>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span>{movie.releaseYear || 'N/A'}</span>
          {movie.genre && (
            <>
              <span>•</span>
              <span className="line-clamp-1">{movie.genre}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white">
        <Header />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-400 text-lg">Đang tải...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Header />

      {/* Hero Section with Carousel */}
      <section className="relative pt-20 mb-12">
        {featuredMovies.length > 0 && (
          <div className="relative h-[600px] bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 transition-all duration-1000">
            {/* Background Image */}
            {featuredMovies[currentSlide]?.posterUrl && (
              <div className="absolute inset-0">
                <img 
                  src={featuredMovies[currentSlide].posterUrl}
                  alt={featuredMovies[currentSlide].title}
                  className="w-full h-full object-cover opacity-30"
                />
              </div>
            )}
            
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/80 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-transparent to-transparent"></div>

            <div className="container mx-auto px-4 h-full flex items-center relative z-10">
              <div className="max-w-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-red-600 px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-1">
                    <Sparkles size={14} />
                    NỔI BẬT
                  </span>
                  <span className="bg-gray-900/80 backdrop-blur-sm px-3 py-1 rounded-lg text-sm font-semibold border border-gray-700">
                    {featuredMovies[currentSlide].releaseYear}
                  </span>
                  {featuredMovies[currentSlide].averageRating > 0 && (
                    <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-lg font-bold shadow-lg">
                      <Star size={16} fill="white" />
                      <span>{featuredMovies[currentSlide].averageRating.toFixed(1)}</span>
                    </div>
                  )}
                </div>

                <h1 className="text-6xl font-black mb-4 text-white drop-shadow-2xl leading-tight">
                  {featuredMovies[currentSlide].title}
                </h1>

                {featuredMovies[currentSlide].genre && (
                  <p className="text-gray-300 mb-4 text-lg font-medium">
                    {featuredMovies[currentSlide].genre}
                  </p>
                )}

                {featuredMovies[currentSlide].description && (
                  <p className="text-gray-400 mb-6 text-lg max-w-xl line-clamp-3">
                    {featuredMovies[currentSlide].description}
                  </p>
                )}

                {featuredMovies[currentSlide].duration && (
                  <div className="flex items-center gap-4 mb-6">
                    <Clock size={18} className="text-gray-400" />
                    <span className="text-gray-400">
                      {featuredMovies[currentSlide].duration}
                    </span>
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    onClick={() => navigate(`/movie/${featuredMovies[currentSlide]._id}`)}
                    className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-full flex items-center gap-3 font-bold text-lg transition-all hover:scale-105 shadow-xl"
                  >
                    <Play size={24} fill="white" />
                    Xem ngay
                  </button>
                  <button 
                    onClick={() => toggleWishlist(featuredMovies[currentSlide]._id)}
                    className="bg-gray-800/80 hover:bg-gray-700 px-8 py-4 rounded-full flex items-center gap-3 font-bold text-lg transition-all hover:scale-105 backdrop-blur border border-gray-700"
                  >
                    <Heart 
                      size={24}
                      fill={wishlist.includes(featuredMovies[currentSlide]._id) ? 'red' : 'none'}
                      stroke={wishlist.includes(featuredMovies[currentSlide]._id) ? 'red' : 'white'}
                    />
                    Thêm vào danh sách
                  </button>
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            {featuredMovies.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentSlide((prev) => (prev - 1 + featuredMovies.length) % featuredMovies.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 backdrop-blur p-3 rounded-full transition-all z-10"
                >
                  <ChevronLeft size={32} />
                </button>
                <button
                  onClick={() => setCurrentSlide((prev) => (prev + 1) % featuredMovies.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 backdrop-blur p-3 rounded-full transition-all z-10"
                >
                  <ChevronRight size={32} />
                </button>

                {/* Dots */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
                  {featuredMovies.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`h-2 rounded-full transition-all ${
                        idx === currentSlide
                          ? 'bg-blue-600 w-12'
                          : 'bg-gray-600 w-2 hover:bg-gray-500'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
>>>>>>> Stashed changes
          </div>
        )}
      </section>

<<<<<<< Updated upstream
      {/* Content Sections */}
      <section className="max-w-7xl mx-auto py-16 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Popular Interest */}
          <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Popular Interest</h2>
            <div className="bg-gray-200 p-8 rounded-lg">
              <div className="flex justify-between gap-5 mb-5">
                {[1, 2, 3].map((item) => (
                  <div 
                    key={item} 
                    onClick={() => navigate(`/movie/${item}`)}
                    className="flex-1 aspect-square bg-white flex items-center justify-center shadow-sm cursor-pointer hover:opacity-80 transition"
                  >
                    <div className="text-gray-300">
                      <svg width="100%" height="100%" viewBox="0 0 100 100" className="w-20 h-20">
                        <line x1="20" y1="20" x2="80" y2="80" stroke="currentColor" strokeWidth="8" />
                        <line x1="80" y1="20" x2="20" y2="80" stroke="currentColor" strokeWidth="8" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 text-gray-800">
                <Menu size={18} strokeWidth={2} />
                <span className="font-semibold text-sm">List</span>
              </div>
            </div>
            <h3 className="text-xl font-semibold mt-4 text-gray-900">What to watch in November</h3>
          </div>

          {/* Worst Reviewed */}
          <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Worst Reviewed</h2>
            <div className="bg-gray-200 p-8 rounded-lg">
              <div className="flex justify-between gap-5 mb-5">
                {[1, 2, 3].map((item) => (
                  <div 
                    key={item} 
                    onClick={() => navigate(`/movie/${item + 3}`)}
                    className="flex-1 aspect-square bg-white flex items-center justify-center shadow-sm cursor-pointer hover:opacity-80 transition"
                  >
                    <div className="text-gray-300">
                      <svg width="100%" height="100%" viewBox="0 0 100 100" className="w-20 h-20">
                        <line x1="20" y1="20" x2="80" y2="80" stroke="currentColor" strokeWidth="8" />
                        <line x1="80" y1="20" x2="20" y2="80" stroke="currentColor" strokeWidth="8" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 text-gray-800">
                <Menu size={18} strokeWidth={2} />
                <span className="font-semibold text-sm">List</span>
              </div>
            </div>
            <h3 className="text-xl font-semibold mt-4 text-gray-900">Lowest rated movie</h3>
          </div>
        </div>
      </section>
=======
      {/* Categories */}
      <section className="container mx-auto px-4 mb-12">
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => navigate(`/search?genre=${cat.value}`)}
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-full whitespace-nowrap transition-all hover:scale-105 border border-gray-700 hover:border-blue-500"
            >
              <span className="text-2xl">{cat.icon}</span>
              <span className="font-medium">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Top Rated Movies */}
      {topRatedMovies.length > 0 && (
        <section className="container mx-auto px-4 mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold flex items-center gap-3">
              <Star className="text-yellow-500" size={32} fill="currentColor" />
              Đánh giá cao nhất
            </h2>
            <button 
              onClick={() => navigate('/search?sort=rating')}
              className="text-blue-400 hover:text-blue-300 flex items-center gap-2 font-medium"
            >
              Xem tất cả
              <ChevronRight size={20} />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {topRatedMovies.slice(0, 12).map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        </section>
      )}

      {/* Trending Now */}
      {trendingMovies.length > 0 && (
        <section className="container mx-auto px-4 mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold flex items-center gap-3">
              <TrendingUp className="text-red-500" size={32} />
              Đang thịnh hành
            </h2>
            <button 
              onClick={() => navigate('/search?sort=trending')}
              className="text-blue-400 hover:text-blue-300 flex items-center gap-2 font-medium"
            >
              Xem tất cả
              <ChevronRight size={20} />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {trendingMovies.slice(0, 12).map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        </section>
      )}

      {/* New Releases */}
      {newReleases.length > 0 && (
        <section className="container mx-auto px-4 mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold flex items-center gap-3">
              <Calendar className="text-blue-500" size={32} />
              Mới phát hành
            </h2>
            <button 
              onClick={() => navigate('/search?sort=year')}
              className="text-blue-400 hover:text-blue-300 flex items-center gap-2 font-medium"
            >
              Xem tất cả
              <ChevronRight size={20} />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {newReleases.slice(0, 12).map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        </section>
      )}
>>>>>>> Stashed changes

      <Footer />
    </div>
  );
}