import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ThumbsUp, ThumbsDown, Star, Filter, ChevronLeft, Trash2 } from 'lucide-react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { AuthContext } from '../context/AuthContext';
import movieService from '../services/movieService';
import reviewService from '../services/reviewService';

export default function MovieReviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    rating: 'all',
    sortBy: 'recent',
    hideSpoiler: false
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const movieResponse = await movieService.getMovieById(id);
        if (movieResponse && movieResponse.success) {
          setMovie(movieResponse.data?.movie);
        }

        const reviewsResponse = await reviewService.getMovieReviews(id);
        if (reviewsResponse && reviewsResponse.success) {
          let reviewsData = reviewsResponse.data?.reviews || [];
          
          if (filters.rating !== 'all') {
            const minRating = parseInt(filters.rating);
            reviewsData = reviewsData.filter(r => r.rating >= minRating);
          }

          if (filters.sortBy === 'helpful') {
            reviewsData.sort((a, b) => (b.helpfulVotes || 0) - (a.helpfulVotes || 0));
          } else if (filters.sortBy === 'rating') {
            reviewsData.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          } else {
            reviewsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          }

          setReviews(reviewsData);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, filters.rating, filters.sortBy]);

  const handleDeleteReview = async (reviewId) => {
    const isAdmin = user?.role === 'admin';
    const confirmMessage = isAdmin 
      ? 'Bạn có chắc chắn muốn xóa review này? (Admin)' 
      : 'Bạn có chắc chắn muốn xóa review này?';
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      await reviewService.deleteReview(reviewId);
      setReviews(reviews.filter(r => r._id !== reviewId));
      
      if (movie) {
        const movieResponse = await movieService.getMovieById(id);
        if (movieResponse && movieResponse.success) {
          setMovie(movieResponse.data?.movie);
        }
      }
    } catch (err) {
      console.error('Error deleting review:', err);
      alert(err.message || 'Failed to delete review');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const ReviewCard = ({ review }) => {
    const isOwner = user && review.user?._id === user._id;
    const isAdmin = user?.role === 'admin';
    const showDelete = isOwner || isAdmin;

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4 hover:shadow-md transition relative">
        {showDelete && (
          <button
            onClick={() => handleDeleteReview(review._id)}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition"
            title={isAdmin ? 'Admin: Xóa review' : 'Xóa review'}
          >
            <Trash2 size={18} />
          </button>
        )}

        <div className="flex gap-6">
          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                    <Star size={16} className="fill-gray-700 text-gray-700" />
                    <span className="font-bold text-gray-900">{review.rating}/10</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    By <span className="font-medium text-gray-900">{review.user?.username || 'Anonymous'}</span> • {formatDate(review.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-gray-700 mb-4">{review.content}</p>

            <div className="flex items-center gap-4 text-sm">
              <button className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition">
                <ThumbsUp size={18} />
                <span>Helpful {review.helpfulVotes || 0}</span>
              </button>
              <span className="text-gray-400">•</span>
              <button className="flex items-center gap-2 text-gray-700 hover:text-red-600 transition">
                <ThumbsDown size={18} />
                <span>{review.unhelpfulVotes || 0}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Back Button and Title */}
        <div className="mb-8">
          <button 
            onClick={() => navigate(`/movie/${id}`)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition"
          >
            <ChevronLeft size={20} />
            <span className="font-medium">Back to Movie</span>
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {movie ? `${movie.title} - Reviews` : 'Loading...'}
          </h1>
          <p className="text-gray-600">All reviews for this movie</p>
        </div>

        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Filters Bar */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Filter size={18} className="text-gray-600" />
                    <span className="font-medium text-gray-900">{reviews.length} Reviews</span>
                  </div>
                  
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={filters.hideSpoiler}
                      onChange={(e) => setFilters({...filters, hideSpoiler: e.target.checked})}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-gray-700">Hide Spoiler</span>
                  </label>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Rating</span>
                    <select 
                      value={filters.rating}
                      onChange={(e) => setFilters({...filters, rating: e.target.value})}
                      className="border border-gray-300 rounded px-3 py-1 text-sm outline-none cursor-pointer"
                    >
                      <option value="all">All ratings</option>
                      <option value="10">10 star</option>
                      <option value="9">9+ star</option>
                      <option value="8">8+ star</option>
                      <option value="7">7+ star</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Sort by</span>
                    <select 
                      value={filters.sortBy}
                      onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                      className="border border-gray-300 rounded px-3 py-1 text-sm outline-none cursor-pointer"
                    >
                      <option value="recent">Review Date</option>
                      <option value="helpful">Most Helpful</option>
                      <option value="rating">Highest Rating</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews List */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                <p className="text-gray-600 mt-4">Loading reviews...</p>
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No reviews found</p>
              </div>
            ) : (
              reviews.map(review => <ReviewCard key={review._id} review={review} />)
            )}
          </div>

          {/* Sidebar - Movie Info */}
          {movie && (
            <div className="w-80 flex-shrink-0">
              <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Movie Info</h2>
                
                <div className="aspect-[2/3] bg-gray-200 rounded mb-4 overflow-hidden">
                  {movie.posterUrl ? (
                    <img 
                      src={movie.posterUrl} 
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg width="120" height="120" viewBox="0 0 120 120">
                        <line x1="30" y1="30" x2="90" y2="90" stroke="currentColor" strokeWidth="12" />
                        <line x1="90" y1="30" x2="30" y2="90" stroke="currentColor" strokeWidth="12" />
                      </svg>
                    </div>
                  )}
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2">{movie.title}</h3>
                <p className="text-sm text-gray-600 mb-4">
                  {movie.releaseYear} • {movie.duration ? `${Math.floor(movie.duration / 60)}h${movie.duration % 60}m` : 'N/A'}
                </p>
                
                <div className="flex items-center gap-2 mb-4">
                  <Star size={20} className="text-yellow-500" fill="currentColor" />
                  <span className="text-lg font-bold">{movie.averageRating?.toFixed(1) || '0'}/10</span>
                  <span className="text-sm text-gray-600">({movie.totalRatings || 0} ratings)</span>
                </div>

                <button 
                  onClick={() => navigate(`/movie/${id}`)}
                  className="w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-700 transition"
                >
                  View Movie Details
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
