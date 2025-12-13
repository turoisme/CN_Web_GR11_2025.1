import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Play, Plus, ChevronRight, Check, X } from 'lucide-react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import { AuthContext } from '../context/AuthContext';
import movieService from '../services/movieService';
import reviewService from '../services/reviewService';
import listService from '../services/listService';

export default function MovieDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  // Data states
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  
  // Saved user review data
  const [savedReview, setSavedReview] = useState(null);
  const [userRating, setUserRating] = useState(null);
  
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [modalRating, setModalRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewContent, setReviewContent] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  // Wishlist states
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [showWishlistPopup, setShowWishlistPopup] = useState(false);
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  
  // Trailer modal state
  const [showTrailerModal, setShowTrailerModal] = useState(false);

  // Fetch movie data
  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await movieService.getMovieById(id);
        if (response && response.success) {
          setMovie(response.data?.movie);
        }
      } catch (err) {
        console.error('Error fetching movie:', err);
        setError(err.message || 'Failed to load movie details');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [id]);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setReviewsLoading(true);
        const response = await reviewService.getMovieReviews(id, { limit: 10 });
        if (response && response.success) {
          setReviews(response.data?.reviews || []);
          
          // Find user's review if logged in
          if (user) {
            const myReview = response.data?.reviews.find(
              review => review.user?._id === user._id
            );
            if (myReview) {
              setSavedReview(myReview);
              setUserRating(myReview.rating);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching reviews:', err);
      } finally {
        setReviewsLoading(false);
      }
    };

    if (movie) {
      fetchReviews();
    }
  }, [id, movie, user]);

  // Check if movie is in wishlist
  useEffect(() => {
    const checkWishlist = async () => {
      if (!user) return;
      
      try {
        const response = await listService.getWatchlist();
        if (response && response.success) {
          const watchlistItems = response.data?.watchlist || [];
          const isInList = watchlistItems.some(item => item.movie?._id === id);
          setIsInWishlist(isInList);
        }
      } catch (err) {
        console.error('Error checking wishlist:', err);
        // Don't show error to user, just keep wishlist state as false
      }
    };

    checkWishlist();
  }, [id, user]);

  // Auto-hide popup after 3 seconds
  useEffect(() => {
    if (showWishlistPopup) {
      const timer = setTimeout(() => {
        setShowWishlistPopup(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showWishlistPopup]);

  // Auto-hide login alert after 3 seconds
  useEffect(() => {
    if (showLoginAlert) {
      const timer = setTimeout(() => {
        setShowLoginAlert(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showLoginAlert]);

  const handleOpenModal = () => {
    if (!user) {
      setShowLoginAlert(true);
      return;
    }
    
    // Load saved review data when opening modal
    if (savedReview) {
      setModalRating(savedReview.rating);
      setReviewContent(savedReview.content);
      setAgreedToTerms(true);
    } else if (userRating) {
      setModalRating(userRating);
      setAgreedToTerms(true);
    }
    setShowRatingModal(true);
  };

  const handleSubmitRating = async () => {
    if (!agreedToTerms) {
      alert('Please agree to the terms and conditions');
      return;
    }
    if (modalRating === 0) {
      alert('Please select a rating');
      return;
    }

    try {
      // First create/update rating
      await reviewService.createRating({
        movieId: id,
        score: modalRating // API expects 'score' not 'rating'
      });

      // Then create/update review if content provided and meets minimum length
      const trimmedContent = reviewContent.trim();
      if (trimmedContent && trimmedContent.length >= 10) {
        const reviewData = {
          movieId: id,
          rating: modalRating,
          content: trimmedContent
        };

        if (savedReview) {
          await reviewService.updateReview(savedReview._id, reviewData);
        } else {
          await reviewService.createReview(reviewData);
        }
      }

      // Refresh reviews
      const response = await reviewService.getMovieReviews(id, { limit: 10 });
      if (response && response.success) {
        setReviews(response.data?.reviews || []);
        const myReview = response.data?.reviews.find(
          review => review.user?._id === user._id
        );
        if (myReview) {
          setSavedReview(myReview);
        }
      }

      // Refresh movie to get updated rating
      const movieResponse = await movieService.getMovieById(id);
      if (movieResponse && movieResponse.success) {
        setMovie(movieResponse.data?.movie);
      }

      setUserRating(modalRating);
      setShowRatingModal(false);
      
      // Show success message
      alert('Rating submitted successfully!');
    } catch (err) {
      console.error('Error submitting rating:', err);
      
      // Better error handling
      let errorMessage = 'Failed to submit rating';
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.errors) {
        // Handle validation errors
        const validationErrors = err.response.data.errors
          .map(e => `${e.field}: ${e.message}`)
          .join('\n');
        errorMessage = `Validation failed:\n${validationErrors}`;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      alert(errorMessage);
    }
  };

  const handleRemoveRating = async () => {
    if (!savedReview) {
      setShowRatingModal(false);
      return;
    }

    try {
      await reviewService.deleteReview(savedReview._id);
      
      // Clear state
      setSavedReview(null);
      setUserRating(null);
      setModalRating(0);
      setReviewContent('');
      setAgreedToTerms(false);
      setShowRatingModal(false);

      // Refresh reviews and movie
      const response = await reviewService.getMovieReviews(id, { limit: 10 });
      if (response && response.success) {
        setReviews(response.data?.reviews || []);
      }

      const movieResponse = await movieService.getMovieById(id);
      if (movieResponse && movieResponse.success) {
        setMovie(movieResponse.data?.movie);
      }
    } catch (err) {
      console.error('Error removing rating:', err);
      alert(err.message || 'Failed to remove rating');
    }
  };

  const handleAddToWishlist = async () => {
    if (!user) {
      setShowLoginAlert(true);
      return;
    }

    try {
      if (isInWishlist) {
        await listService.removeFromWatchlist(id);
        setIsInWishlist(false);
      } else {
        await listService.addToWatchlist(id);
        setIsInWishlist(true);
        setShowWishlistPopup(true);
      }
    } catch (err) {
      console.error('Error updating wishlist:', err);
      alert(err.response?.data?.message || 'Failed to update wishlist');
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <Loading />
        <Footer />
      </div>
    );
  }

  // Show error state
  if (error || !movie) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <ErrorMessage message={error || 'Movie not found'} />
        </div>
        <Footer />
      </div>
    );
  }

  // Helper functions for display
  const formatDuration = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full relative shadow-2xl transform transition-all">
            {/* Close Button */}
            <button 
              onClick={() => setShowRatingModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="text-3xl font-bold text-gray-900 mb-2">Rate & Review</h2>
            <p className="text-gray-600 mb-6">{movie?.title}</p>

            {/* Star Rating */}
            <div className="mb-8">
              <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide">
                Your Rating <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-3 justify-center bg-gray-50 py-6 rounded-lg">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setModalRating(star)}
                    className="transition transform hover:scale-110"
                  >
                    <Star 
                      size={32} 
                      className={
                        star <= (hoverRating || modalRating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'fill-none text-gray-300'
                      }
                    />
                  </button>
                ))}
              </div>
              {modalRating > 0 && (
                <p className="text-center mt-3 text-2xl font-bold text-gray-900">
                  {modalRating}/10
                </p>
              )}
            </div>

            {/* Review Content */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                Your Review (Optional)
              </label>
              <textarea
                placeholder="Share your thoughts about this movie..."
                value={reviewContent}
                onChange={(e) => setReviewContent(e.target.value)}
                rows={6}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg outline-none focus:border-gray-900 transition resize-none"
              />
              <p className="text-xs text-gray-500 mt-2">
                {reviewContent.trim().length >= 10 ? (
                  <span className="text-green-600 font-semibold">✓ Review meets minimum length ({reviewContent.trim().length} characters)</span>
                ) : reviewContent.trim().length > 0 ? (
                  <span className="text-orange-600">Need {10 - reviewContent.trim().length} more characters ({reviewContent.trim().length}/10)</span>
                ) : (
                  <span>Optional: Minimum 10 characters required if you want to write a review</span>
                )}
              </p>
            </div>

            {/* Terms Agreement */}
            <div className="mb-6 bg-gray-50 p-4 rounded-lg">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1 w-5 h-5 accent-gray-900"
                />
                <span className="text-sm text-gray-700 leading-relaxed">
                  I agree to the <span className="font-semibold text-gray-900">Terms of Use</span>. 
                  The content I'm submitting is original and not copyrighted by a third party.
                </span>
              </label>
            </div>

            {/* Validation Message */}
            {(modalRating === 0 || !agreedToTerms) && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  {modalRating === 0 && !agreedToTerms ? (
                    <span>⚠️ Please select a rating and agree to the terms to submit</span>
                  ) : modalRating === 0 ? (
                    <span>⚠️ Please select a rating (1-10 stars)</span>
                  ) : (
                    <span>⚠️ Please agree to the terms of use</span>
                  )}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleSubmitRating}
                disabled={modalRating === 0 || !agreedToTerms}
                className="flex-1 bg-gray-900 text-white py-4 rounded-lg hover:bg-gray-800 transition font-bold text-lg disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg"
              >
                {savedReview ? 'Update Review' : 'Submit Rating'}
              </button>
              {savedReview ? (
                <button
                  onClick={handleRemoveRating}
                  className="flex-1 bg-red-600 text-white py-4 rounded-lg hover:bg-red-700 transition font-bold text-lg shadow-lg"
                >
                  Delete Review
                </button>
              ) : (
                <button
                  onClick={() => setShowRatingModal(false)}
                  className="px-6 bg-white text-gray-700 py-4 rounded-lg border-2 border-gray-300 hover:bg-gray-50 transition font-bold"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section with Backdrop */}
        <div className="relative rounded-xl overflow-hidden mb-8 shadow-2xl">
          {/* Backdrop with Gradient Overlay */}
          <div className="relative h-[500px]">
            {movie?.backdropUrl ? (
              <img 
                src={movie.backdropUrl} 
                alt={movie?.title} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            
            {/* Content Overlay */}
            <div className="absolute inset-0 flex items-end">
              <div className="w-full p-8">
                <div className="flex gap-8 items-end">
                  {/* Poster */}
                  <div className="flex-shrink-0">
                    <div className="w-60 h-[340px] bg-gray-800 rounded-lg shadow-2xl overflow-hidden border-4 border-white/10">
                      {movie?.posterUrl ? (
                        <img 
                          src={movie.posterUrl} 
                          alt={movie?.title} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg width="120" height="120" viewBox="0 0 120 120" className="text-gray-600">
                            <line x1="30" y1="30" x2="90" y2="90" stroke="currentColor" strokeWidth="12" />
                            <line x1="90" y1="30" x2="30" y2="90" stroke="currentColor" strokeWidth="12" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Movie Info */}
                  <div className="flex-1 pb-4">
                    <h1 className="text-5xl font-bold text-white mb-3 drop-shadow-lg">
                      {movie?.title || 'Loading...'}
                    </h1>
                    <div className="flex items-center gap-4 text-white/90 text-lg mb-4">
                      <span className="font-medium">{movie?.releaseYear || 'N/A'}</span>
                      <span>•</span>
                      <span>{formatDuration(movie?.duration)}</span>
                      {movie?.country && (
                        <>
                          <span>•</span>
                          <span>{movie.country}</span>
                        </>
                      )}
                    </div>

                    {/* Genre Tags */}
                    <div className="flex gap-2 mb-6 flex-wrap">
                      {movie?.genres && movie.genres.map((genre, index) => (
                        <span 
                          key={index} 
                          className="px-4 py-1.5 bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-full border border-white/30"
                        >
                          {genre.name || genre}
                        </span>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                      {movie?.trailerUrl && (
                        <button 
                          onClick={() => setShowTrailerModal(true)}
                          className="bg-white text-gray-900 px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-gray-100 transition font-semibold shadow-lg"
                        >
                          <Play size={20} fill="currentColor" strokeWidth={0} />
                          <span>Watch Trailer</span>
                        </button>
                      )}
                      <button 
                        onClick={handleAddToWishlist}
                        className={`px-6 py-3 rounded-lg flex items-center gap-2 transition font-semibold shadow-lg ${
                          isInWishlist 
                            ? 'bg-green-500 text-white hover:bg-green-600' 
                            : 'bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30'
                        }`}
                      >
                        {isInWishlist ? (
                          <>
                            <Check size={20} />
                            <span>In Wishlist</span>
                          </>
                        ) : (
                          <>
                            <Plus size={20} />
                            <span>Add to Wishlist</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Rating Stats */}
                  <div className="flex-shrink-0 bg-black/40 backdrop-blur-md rounded-lg p-6 border border-white/10">
                    <div className="text-center mb-6">
                      <div className="text-xs font-semibold text-white/70 mb-2 uppercase tracking-wide">
                        Current Rating
                      </div>
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <Star size={32} className="text-yellow-400" fill="currentColor" />
                        <span className="text-4xl font-bold text-white">
                          {movie?.averageRating?.toFixed(1) || '0.0'}
                        </span>
                      </div>
                      <div className="text-white/60 text-sm">
                        {movie?.ratingCount || 0} ratings
                      </div>
                    </div>

                    <button 
                      onClick={handleOpenModal}
                      className="w-full bg-yellow-500 hover:bg-yellow-400 text-gray-900 py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition font-bold shadow-lg"
                    >
                      <Star size={20} className={userRating > 0 ? "fill-current" : ""} />
                      <span>{userRating > 0 ? `Your Rating: ${userRating}/10` : 'Rate This'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Movie Info Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          {/* Description */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              {movie?.description || 'No description available.'}
            </p>
          </div>

          {/* Cast & Crew Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Director */}
            {movie?.directors && movie.directors.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">
                  Director{movie.directors.length > 1 ? 's' : ''}
                </h3>
                <div className="space-y-2">
                  {movie.directors.map((director, index) => (
                    <div key={index} className="text-gray-900 font-medium text-lg">
                      {director.name}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stars */}
            {movie?.actors && movie.actors.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">
                  Cast
                </h3>
                <div className="space-y-2">
                  {movie.actors.slice(0, 5).map((actor, index) => (
                    <div key={index} className="text-gray-900 font-medium text-lg">
                      {actor.name}
                    </div>
                  ))}
                  {movie.actors.length > 5 && (
                    <button className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1">
                      <span>See all cast</span>
                      <ChevronRight size={18} />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <div 
              className="flex items-center gap-3 cursor-pointer hover:opacity-70 transition" 
              onClick={() => navigate(`/movie/${id}/reviews`)}
            >
              <h2 className="text-3xl font-bold text-gray-900">User Reviews</h2>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-lg font-semibold">
                {movie?.reviewCount || 0}
              </span>
              <ChevronRight size={28} className="text-gray-400" />
            </div>
            <button 
              onClick={handleOpenModal}
              className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition font-semibold"
            >
              <Plus size={20} strokeWidth={2.5} />
              <span>Write a Review</span>
            </button>
          </div>

          {/* Review Cards */}
          {reviewsLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-gray-900"></div>
            </div>
          ) : reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.slice(0, 6).map((review, index) => (
                <div 
                  key={review._id || index} 
                  className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition-shadow border border-gray-200"
                >
                  {/* User Info */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                      {review.user?.username?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">
                        {review.user?.username || 'Anonymous'}
                      </h3>
                      <div className="flex items-center gap-1">
                        <Star size={16} fill="currentColor" className="text-yellow-500" />
                        <span className="text-sm font-semibold text-gray-700">
                          {review.rating}/10
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Review Content */}
                  <p className="text-gray-700 text-sm leading-relaxed mb-3 line-clamp-4">
                    {review.content}
                  </p>

                  {/* Review Date */}
                  <p className="text-xs text-gray-500">
                    {formatDate(review.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
                <Star size={48} className="text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg">No reviews yet</p>
              <p className="text-gray-400 text-sm mt-2">Be the first to share your thoughts!</p>
            </div>
          )}

          {/* View All Reviews Link */}
          {reviews.length > 6 && (
            <div className="mt-6 text-center">
              <button 
                onClick={() => navigate(`/movie/${id}/reviews`)}
                className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 mx-auto"
              >
                <span>View all {movie?.reviewCount || reviews.length} reviews</span>
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Wishlist Success Popup */}
      {showWishlistPopup && (
        <div className="fixed bottom-8 right-8 bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-5 rounded-xl shadow-2xl flex items-center gap-4 animate-slide-up z-50 border border-green-400">
          <div className="bg-white rounded-full p-2 shadow-lg">
            <Check size={24} className="text-green-600" strokeWidth={3} />
          </div>
          <div>
            <p className="font-bold text-lg">Success!</p>
            <p className="text-sm text-green-50">Added to your wishlist</p>
          </div>
          <button 
            onClick={() => setShowWishlistPopup(false)}
            className="ml-4 text-white/80 hover:text-white transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Trailer Modal */}
      {showTrailerModal && movie?.trailerUrl && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setShowTrailerModal(false)}
        >
          <div 
            className="relative w-full max-w-5xl bg-gray-900 rounded-lg overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowTrailerModal(false)}
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition"
            >
              <X size={24} />
            </button>

            {/* Video Container */}
            <div className="relative" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute inset-0 w-full h-full"
                src={movie.trailerUrl.replace('watch?v=', 'embed/').split('&')[0]}
                title={`${movie.title} Trailer`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {/* Login Required Alert */}
      {showLoginAlert && (
        <div className="fixed bottom-8 right-8 bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-5 rounded-xl shadow-2xl flex items-center gap-4 animate-slide-up z-50 border border-red-400">
          <div className="bg-white rounded-full p-2 shadow-lg">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <p className="font-bold text-lg">Login Required</p>
            <p className="text-sm text-red-50">Please sign in to continue</p>
          </div>
          <button 
            onClick={() => setShowLoginAlert(false)}
            className="ml-4 text-white/80 hover:text-white transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <Footer />
    </div>
  );
}