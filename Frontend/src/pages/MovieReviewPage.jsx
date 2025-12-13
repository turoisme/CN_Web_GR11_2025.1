import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ThumbsUp, ThumbsDown, Star, Filter, ChevronLeft, MessageSquare, TrendingUp, AlertCircle } from 'lucide-react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import reviewService from '../services/reviewService';
import movieService from '../services/movieService';

export default function MovieReviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    rating: 'all',
    sortBy: 'recent',
    hideSpoiler: false
  });

  // Fetch movie and reviews
  useEffect(() => {
    fetchMovieAndReviews();
  }, [id]);

  const fetchMovieAndReviews = async () => {
    try {
      setLoading(true);

      // Fetch movie details
      const movieResponse = await movieService.getMovieById(id);
      if (movieResponse.success) {
        setMovie(movieResponse.data);
      }

      // Fetch reviews with filters
      const params = {
        sortBy: filters.sortBy,
        minRating: filters.rating !== 'all' ? parseInt(filters.rating) : undefined,
        hideSpoiler: filters.hideSpoiler
      };

      const reviewsResponse = await reviewService.getMovieReviews(id, params);
      if (reviewsResponse.success) {
        setReviews(reviewsResponse.data?.reviews || reviewsResponse.data || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch when filters change
  useEffect(() => {
    if (!loading) {
      fetchMovieAndReviews();
    }
  }, [filters]);

  const handleVote = async (reviewId, voteType) => {
    try {
      const response = await reviewService.voteReview(reviewId, voteType);
      if (response.success) {
        // Update the review in state
        setReviews(reviews.map(review => 
          review._id === reviewId ? response.data : review
        ));
      }
    } catch (error) {
      console.error('Error voting:', error);
      alert('Bạn cần đăng nhập để vote!');
    }
  };

  const ReviewCard = ({ review }) => {
    const [showSpoiler, setShowSpoiler] = useState(false);

    return (
      <div className="bg-white rounded-2xl p-6 mb-4 shadow-sm hover:shadow-xl transition-all duration-300 border-2 border-gray-100 hover:border-blue-200">
        <div className="flex gap-6">
          {/* Review Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  {/* Rating Badge */}
                  <div className="flex items-center gap-1.5 bg-gradient-to-r from-yellow-400 to-orange-500 px-3 py-1.5 rounded-full shadow-md">
                    <Star size={16} className="text-white" fill="white" />
                    <span className="font-black text-white text-sm">{review.rating}/10</span>
                  </div>
                  
                  {/* Author and Date */}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xs">
                        {review.user?.username?.charAt(0).toUpperCase() || review.author?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900">
                        {review.user?.username || review.author || 'Anonymous'}
                      </span>
                      <span className="text-gray-500 mx-2">•</span>
                      <span className="text-gray-500">
                        {new Date(review.createdAt || review.date).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Review Title */}
                {review.title && (
                  <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
                    {review.title}
                  </h3>
                )}
              </div>

              {/* Spoiler Badge */}
              {review.hasSpoiler && (
                <div className="flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">
                  <AlertCircle size={14} />
                  <span>SPOILER</span>
                </div>
              )}
            </div>

            {/* Review Content */}
            <div className="mb-4">
              {review.hasSpoiler && !showSpoiler ? (
                <div>
                  <p className="text-gray-700 mb-3 line-clamp-2">{review.content}</p>
                  <button 
                    onClick={() => setShowSpoiler(true)}
                    className="text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 hover:gap-2 transition-all"
                  >
                    <span>Xem spoiler</span>
                    <span>▼</span>
                  </button>
                </div>
              ) : (
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {review.content || review.comment}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-6 text-sm border-t border-gray-100 pt-4">
              <button 
                onClick={() => handleVote(review._id, 'helpful')}
                className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors font-medium group"
              >
                <div className="p-1.5 rounded-lg group-hover:bg-green-50 transition">
                  <ThumbsUp size={18} />
                </div>
                <span>Hữu ích</span>
                <span className="font-bold text-gray-900">{review.helpfulCount || review.helpful || 0}</span>
              </button>
              
              <div className="w-px h-6 bg-gray-200"></div>
              
              <button 
                onClick={() => handleVote(review._id, 'unhelpful')}
                className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors font-medium group"
              >
                <div className="p-1.5 rounded-lg group-hover:bg-red-50 transition">
                  <ThumbsDown size={18} />
                </div>
                <span>Không hữu ích</span>
                <span className="font-bold text-gray-900">{review.unhelpfulCount || review.notHelpful || 0}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button and Title */}
        <div className="mb-8">
          <button 
            onClick={() => navigate(`/movie/${id}`)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors font-medium group"
          >
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span>Quay lại trang phim</span>
          </button>
          
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900">
              {movie?.title || 'Movie'} - Reviews
            </h1>
            {reviews.length > 0 && (
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                {reviews.length} đánh giá
              </span>
            )}
          </div>
          <p className="text-gray-600 text-lg">Tất cả đánh giá và nhận xét về bộ phim</p>
        </div>

        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Filters Bar */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 mb-6 shadow-lg border-2 border-gray-100">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* Left Side */}
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Filter size={18} className="text-blue-600" />
                    <span className="font-bold text-gray-900">{reviews.length} đánh giá</span>
                  </div>
                  
                  <div className="w-px h-6 bg-gray-300 hidden md:block"></div>
                  
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={filters.hideSpoiler}
                      onChange={(e) => setFilters({...filters, hideSpoiler: e.target.checked})}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 font-medium group-hover:text-gray-900 transition">
                      Ẩn spoiler
                    </span>
                  </label>
                </div>

                {/* Right Side - Filters */}
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Star size={16} className="text-yellow-500" fill="currentColor" />
                    <span className="text-sm text-gray-600 font-medium">Đánh giá</span>
                    <select 
                      value={filters.rating}
                      onChange={(e) => setFilters({...filters, rating: e.target.value})}
                      className="border-2 border-gray-200 rounded-lg px-3 py-2 text-sm outline-none cursor-pointer hover:border-blue-500 transition font-medium"
                    >
                      <option value="all">Tất cả</option>
                      <option value="10">10 sao</option>
                      <option value="9">9+ sao</option>
                      <option value="8">8+ sao</option>
                      <option value="7">7+ sao</option>
                      <option value="6">6+ sao</option>
                    </select>
                  </div>

                  <div className="w-px h-6 bg-gray-300 hidden md:block"></div>

                  <div className="flex items-center gap-2">
                    <TrendingUp size={16} className="text-purple-600" />
                    <span className="text-sm text-gray-600 font-medium">Sắp xếp</span>
                    <select 
                      value={filters.sortBy}
                      onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                      className="border-2 border-gray-200 rounded-lg px-3 py-2 text-sm outline-none cursor-pointer hover:border-blue-500 transition font-medium"
                    >
                      <option value="recent">Mới nhất</option>
                      <option value="helpful">Hữu ích nhất</option>
                      <option value="rating">Đánh giá cao</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews List */}
            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block p-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl mb-6 shadow-xl">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
                </div>
                <p className="text-gray-600 text-lg font-medium">Đang tải đánh giá...</p>
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-20">
                <div className="inline-block p-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl mb-6 shadow-xl">
                  <MessageSquare size={80} className="text-gray-400" />
                </div>
                <h3 className="text-3xl font-black text-gray-900 mb-3">Chưa có đánh giá</h3>
                <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
                  Hãy là người đầu tiên đánh giá bộ phim này
                </p>
                <button 
                  onClick={() => navigate(`/movie/${id}`)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-bold shadow-lg hover:shadow-xl"
                >
                  Viết đánh giá
                </button>
              </div>
            ) : (
              <div>
                {reviews.map(review => <ReviewCard key={review._id || review.id} review={review} />)}
              </div>
            )}
          </div>

          {/* Sidebar - Movie Info */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 sticky top-24 shadow-lg border-2 border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MessageSquare size={20} className="text-blue-600" />
                Thông tin phim
              </h2>
              
              {/* Movie Poster */}
              <div className="aspect-[2/3] bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl mb-4 overflow-hidden shadow-md">
                {movie?.posterUrl ? (
                  <img 
                    src={movie.posterUrl} 
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg width="120" height="120" viewBox="0 0 120 120" className="text-gray-300">
                      <line x1="30" y1="30" x2="90" y2="90" stroke="currentColor" strokeWidth="12" />
                      <line x1="90" y1="30" x2="30" y2="90" stroke="currentColor" strokeWidth="12" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Movie Details */}
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {movie?.title || 'Movie Title'}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {movie?.releaseYear || '2024'} • {movie?.duration || '2h 30m'}
              </p>
              
              {/* Rating */}
              <div className="flex items-center gap-2 mb-6 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                <Star size={24} className="text-yellow-500" fill="currentColor" />
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-gray-900">
                      {movie?.averageRating?.toFixed(1) || '7.9'}
                    </span>
                    <span className="text-sm text-gray-600">/10</span>
                  </div>
                  <span className="text-xs text-gray-600">
                    ({movie?.ratingCount || reviews.length} đánh giá)
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button 
                  onClick={() => navigate(`/movie/${id}`)}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-bold shadow-lg hover:shadow-xl"
                >
                  Xem chi tiết phim
                </button>
                
                <button 
                  onClick={() => navigate(`/movie/${id}#write-review`)}
                  className="w-full bg-white text-gray-900 border-2 border-gray-200 py-3 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all font-bold"
                >
                  Viết đánh giá
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}