import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Users, Play, Plus, ChevronRight, Check } from 'lucide-react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

export default function MovieDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Saved user review data (would come from API)
  const [savedReview, setSavedReview] = useState({
    rating: 0,
    title: '',
    content: '',
    hasSpoiler: false
  });
  
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [modalRating, setModalRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewContent, setReviewContent] = useState('');
  const [hasSpoiler, setHasSpoiler] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  // Wishlist states
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [showWishlistPopup, setShowWishlistPopup] = useState(false);

  // Movie data (mock - sẽ thay bằng API)
  const movieData = {
    id: id,
    title: 'Avatar',
    year: 2009,
    duration: '2h30m',
    rating: 7.9,
    ratingCount: 1000,
    genres: ['Fantasy', 'Action', 'Adventure', 'Thriller'],
    poster: '/placeholder.jpg',
    description: 'A paraplegic Marine sent to the moon Pandora on a special mission must struggle between following orders and protecting the world he calls home.',
    director: 'James Cameron',
    stars: ['James Cameron', 'James Cameron']
  };

  // Check if movie is in wishlist on mount
  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const isInList = wishlist.some(movie => movie.id === id);
    setIsInWishlist(isInList);
  }, [id]);

  // Auto-hide popup after 3 seconds
  useEffect(() => {
    if (showWishlistPopup) {
      const timer = setTimeout(() => {
        setShowWishlistPopup(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showWishlistPopup]);

  const reviews = [
    {
      author: 'Jimmy',
      rating: 4,
      date: 'Dec 1, 2025',
      content: "'Avatar' is celebrated for its stunning visual effects, immersive 3D experience, and innovative motion-capture technology. The depiction of Pandora and the Na'vi culture is frequently lauded."
    },
    {
      author: 'Jimmy',
      rating: 4,
      date: 'Dec 1, 2025',
      content: "'Avatar' is celebrated for its stunning visual effects, immersive 3D experience, and innovative motion-capture technology. The depiction of Pandora and the Na'vi culture is frequently lauded."
    },
    {
      author: 'Jimmy',
      rating: 4,
      date: 'Dec 1, 2025',
      content: "'Avatar' is celebrated for its stunning visual effects, immersive 3D experience, and innovative motion-capture technology. The depiction of Pandora and the Na'vi culture is frequently lauded."
    },
    {
      author: 'Jimmy',
      rating: 4,
      date: 'Dec 1, 2025',
      content: "'Avatar' is celebrated for its stunning visual effects, immersive 3D experience, and innovative motion-capture technology. The depiction of Pandora and the Na'vi culture is frequently lauded."
    }
  ];

  const handleOpenModal = () => {
    // Load saved review data when opening modal
    setModalRating(savedReview.rating);
    setReviewTitle(savedReview.title);
    setReviewContent(savedReview.content);
    setHasSpoiler(savedReview.hasSpoiler);
    setAgreedToTerms(savedReview.rating > 0); // Auto-check if already reviewed
    setShowRatingModal(true);
  };

  const handleSubmitRating = () => {
    if (!agreedToTerms) {
      alert('Please agree to the terms and conditions');
      return;
    }
    if (modalRating === 0) {
      alert('Please select a rating');
      return;
    }
    // Save review data
    setSavedReview({
      rating: modalRating,
      title: reviewTitle,
      content: reviewContent,
      hasSpoiler
    });
    // TODO: Submit to API
    console.log({
      rating: modalRating,
      title: reviewTitle,
      content: reviewContent,
      hasSpoiler
    });
    setShowRatingModal(false);
  };

  const handleRemoveRating = () => {
    // Clear saved review
    setSavedReview({
      rating: 0,
      title: '',
      content: '',
      hasSpoiler: false
    });
    setModalRating(0);
    setReviewTitle('');
    setReviewContent('');
    setHasSpoiler(false);
    setAgreedToTerms(false);
    setShowRatingModal(false);
  };

  const handleAddToWishlist = () => {
    // Get current wishlist from localStorage
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    
    // Check if already in wishlist
    if (wishlist.some(movie => movie.id === id)) {
      return;
    }

    // Add movie to wishlist
    const movieToAdd = {
      ...movieData,
      dateAdded: new Date().toISOString().split('T')[0]
    };
    
    wishlist.push(movieToAdd);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    
    // Update state and show popup
    setIsInWishlist(true);
    setShowWishlistPopup(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full relative">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Add your review</h2>

            {/* Star Rating */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-3">Your rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setModalRating(star)}
                    className="transition"
                  >
                    <Star 
                      size={28} 
                      className={
                        star <= (hoverRating || modalRating)
                          ? 'fill-gray-900 text-gray-900'
                          : 'fill-none text-gray-400'
                      }
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Review Title */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Title of your review"
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-gray-900"
              />
            </div>

            {/* Review Content */}
            <div className="mb-4">
              <textarea
                placeholder="Enter your review"
                value={reviewContent}
                onChange={(e) => setReviewContent(e.target.value)}
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-gray-900 resize-none"
              />
            </div>

            {/* Spoiler Toggle */}
            <div className="mb-4 p-4 border border-gray-300 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Does this User Review contain spoilers?</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-700">Yes</span>
                  <button
                    type="button"
                    onClick={() => setHasSpoiler(!hasSpoiler)}
                    className={`w-12 h-6 rounded-full transition relative ${
                      hasSpoiler ? 'bg-gray-900' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition transform ${
                      hasSpoiler ? 'left-7' : 'left-1'
                    }`} />
                  </button>
                  <span className="text-sm text-gray-700">No</span>
                </div>
              </div>
            </div>

            {/* Terms Agreement */}
            <div className="mb-6">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1 w-4 h-4"
                />
                <span className="text-xs text-gray-700">
                  I agree to the <span className="underline font-medium">Conditions of Use</span>. The data I'm submitting is true and not copyrighted by a third party.
                </span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleSubmitRating}
                className="flex-1 bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition font-semibold"
              >
                Add
              </button>
              <button
                onClick={() => setShowRatingModal(false)}
                className="flex-1 bg-white text-gray-900 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition font-semibold"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-8 py-8">
        {/* Movie Title and Info */}
        <div className="mb-6">
          <h1 className="text-5xl font-bold text-gray-900 mb-2">Avatar</h1>
          <p className="text-gray-600 text-lg">2009 - 2h30m</p>
        </div>

        {/* Movie Details Section */}
        <div className="rounded-lg overflow-hidden mb-8">
          {/* Hero Section with Images */}
          <div className="bg-gray-300 p-8 relative">
            <div className="flex gap-6 items-center justify-center">
              {/* Left Image */}
              <div className="w-48 h-64 bg-white flex items-center justify-center shadow-lg">
                <svg width="120" height="120" viewBox="0 0 120 120" className="text-gray-300">
                  <line x1="30" y1="30" x2="90" y2="90" stroke="currentColor" strokeWidth="12" />
                  <line x1="90" y1="30" x2="30" y2="90" stroke="currentColor" strokeWidth="12" />
                </svg>
              </div>

              {/* Center Image with Play Button */}
              <div className="relative">
                <div className="w-96 h-64 bg-white flex items-center justify-center shadow-lg">
                  <svg width="180" height="180" viewBox="0 0 180 180" className="text-gray-300">
                    <line x1="45" y1="45" x2="135" y2="135" stroke="currentColor" strokeWidth="18" />
                    <line x1="135" y1="45" x2="45" y2="135" stroke="currentColor" strokeWidth="18" />
                  </svg>
                </div>
                <button className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-8 py-3 flex items-center gap-3 hover:bg-gray-700 transition shadow-lg">
                  <Play size={20} fill="white" strokeWidth={0} />
                  <span className="font-semibold">Watch Trailer</span>
                </button>
              </div>

              {/* Right Side - Two Images Stacked */}
              <div className="flex flex-col gap-4">
                <div className="w-48 h-32 bg-white flex items-center justify-center shadow-lg">
                  <svg width="80" height="80" viewBox="0 0 80 80" className="text-gray-300">
                    <line x1="20" y1="20" x2="60" y2="60" stroke="currentColor" strokeWidth="8" />
                    <line x1="60" y1="20" x2="20" y2="60" stroke="currentColor" strokeWidth="8" />
                  </svg>
                </div>
                <div className="w-48 h-32 bg-white flex items-center justify-center shadow-lg">
                  <svg width="80" height="80" viewBox="0 0 80 80" className="text-gray-300">
                    <line x1="20" y1="20" x2="60" y2="60" stroke="currentColor" strokeWidth="8" />
                    <line x1="60" y1="20" x2="20" y2="60" stroke="currentColor" strokeWidth="8" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Rating Info - Top Right */}
            <div className="absolute top-6 right-6 flex gap-8">
              <div className="text-center">
                <div className="text-xs font-semibold text-gray-700 mb-1">CURRENT RATING</div>
                <div className="flex items-center gap-2">
                  <Star size={24} className="text-gray-700" fill="currentColor" />
                  <span className="text-2xl font-bold">7.9<span className="text-lg">/10</span></span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs font-semibold text-gray-700 mb-1">RATING COUNT</div>
                <div className="flex items-center gap-2">
                  <Users size={24} className="text-gray-700" />
                  <span className="text-2xl font-bold">1000</span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs font-semibold text-gray-700 mb-1">YOUR RATING</div>
                <button 
                  onClick={handleOpenModal}
                  className="flex items-center gap-2 hover:text-blue-600 transition"
                >
                  <Star size={24} className={savedReview.rating > 0 ? "text-yellow-500 fill-yellow-500" : "text-gray-700"} />
                  <span className="text-2xl font-bold">
                    {savedReview.rating > 0 ? `${savedReview.rating}/10` : 'Rate'}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Movie Info Section */}
          <div className="bg-white p-8">
            {/* Genre Tags */}
            <div className="flex gap-3 mb-6">
              <span className="px-4 py-1.5 bg-gray-800 text-white text-sm font-medium rounded">Fantasy</span>
              <span className="px-4 py-1.5 bg-gray-800 text-white text-sm font-medium rounded">Action</span>
              <span className="px-4 py-1.5 bg-gray-800 text-white text-sm font-medium rounded">Adventure</span>
              <span className="px-4 py-1.5 bg-gray-800 text-white text-sm font-medium rounded">Thriller</span>
            </div>

            {/* Description */}
            <p className="text-gray-900 text-base mb-6 leading-relaxed">
              A paraplegic Marine sent to the moon Pandora on a special mission must struggle between following orders and protecting the world he calls home.
            </p>

            {/* Director */}
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-300">
              <span className="font-bold text-gray-900">Director</span>
              <span className="text-gray-600">James Cameron</span>
            </div>

            {/* Stars */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-300 mb-6">
              <div className="flex items-center gap-3">
                <span className="font-bold text-gray-900">Stars</span>
                <span className="text-gray-600">James Cameron</span>
                <span className="text-gray-600">James Cameron</span>
              </div>
              <ChevronRight size={24} className="text-gray-700 cursor-pointer" />
            </div>

            {/* Add to Wishlist Button */}
            <button 
              onClick={handleAddToWishlist}
              disabled={isInWishlist}
              className={`w-full py-4 flex items-center justify-center gap-3 transition rounded text-lg font-semibold ${
                isInWishlist 
                  ? 'bg-green-600 text-white cursor-not-allowed' 
                  : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
            >
              {isInWishlist ? (
                <>
                  <Check size={24} />
                  <span>Added to Wishlist</span>
                </>
              ) : (
                <>
                  <Plus size={24} />
                  <span>Add to Wishlist</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate(`/movie/${id}/reviews`)}>
              <h2 className="text-3xl font-bold text-gray-900">Review</h2>
              <span className="text-2xl font-bold text-gray-900">1000</span>
              <ChevronRight size={28} className="text-gray-700 hover:text-gray-900 transition" />
            </div>
            <button className="flex items-center gap-2 text-gray-900 hover:text-gray-700 transition">
              <Plus size={24} strokeWidth={2.5} />
              <span className="font-semibold text-lg">Review</span>
            </button>
          </div>

          {/* Review Cards */}
          <div className="flex gap-6 overflow-x-auto pb-4">
            {reviews.map((review, index) => (
              <div key={index} className="flex-shrink-0 w-80 bg-gray-100 p-6 rounded-lg">
                {/* User Info */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gray-800 rounded-full"></div>
                  <div>
                    <h3 className="font-bold text-gray-900">{review.author}</h3>
                    <div className="flex items-center gap-1">
                      <Star size={14} fill="currentColor" className="text-gray-700" />
                      <span className="text-sm font-semibold">{review.rating}/5</span>
                    </div>
                  </div>
                </div>

                {/* Review Content */}
                <p className="text-gray-800 text-sm leading-relaxed mb-4">
                  {review.content}
                </p>

                {/* Date */}
                <p className="text-gray-600 text-sm text-right">{review.date}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Wishlist Success Popup */}
      {showWishlistPopup && (
        <div className="fixed bottom-8 right-8 bg-green-600 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 animate-slide-up z-50">
          <div className="bg-white rounded-full p-1">
            <Check size={24} className="text-green-600" />
          </div>
          <div>
            <p className="font-semibold text-lg">Added to Wishlist!</p>
            <p className="text-sm text-green-100">{movieData.title} has been added to your wishlist</p>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}