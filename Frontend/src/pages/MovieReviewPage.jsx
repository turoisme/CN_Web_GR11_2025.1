import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ThumbsUp, ThumbsDown, Star, Filter, ChevronLeft } from 'lucide-react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

export default function MovieReviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    rating: 'all',
    sortBy: 'recent',
    hideSpoiler: false
  });

  // Mock data - sẽ thay bằng API call
  useEffect(() => {
    setTimeout(() => {
      setReviews([
        {
          id: 1,
          rating: 7.9,
          author: 'Samiam',
          date: 'Sep 23, 2022',
          title: 'After a decade, Cameron sets the avatar of our new generation',
          content: 'I was waiting for this day for the longest time. I was a kid back in 2009 when this movie released. So never got to watch it back then. But now when it rereleased I booked the first day show in a IMAX show and oh boy was I blown away! This is nothing short of a masterpiece! It\'s everything a film like this could\'ve been made. Every scene you are in complete awe in the beautiful world that is created on screen and it is nothing short of perfection.',
          helpful: 1000,
          notHelpful: 1000,
          hasSpoiler: false
        },
        {
          id: 2,
          rating: 7.9,
          author: 'Samiam',
          date: 'Sep 23, 2022',
          title: 'After a decade, Cameron sets the avatar of our new generation',
          content: 'I was waiting for this day for the longest time...',
          helpful: 1000,
          notHelpful: 1000,
          hasSpoiler: true
        },
        {
          id: 3,
          rating: 7.9,
          author: 'Samiam',
          date: 'Sep 23, 2022',
          title: 'After a decade, Cameron sets the avatar of our new generation',
          content: 'I was waiting for this day for the longest time...',
          helpful: 1000,
          notHelpful: 1000,
          hasSpoiler: false
        },
        {
          id: 4,
          rating: 8.5,
          author: 'MovieFan',
          date: 'Oct 10, 2022',
          title: 'Visually stunning masterpiece',
          content: 'The visual effects are incredible and the world-building is unmatched. James Cameron created something truly special.',
          helpful: 850,
          notHelpful: 50,
          hasSpoiler: false
        }
      ]);
      setLoading(false);
    }, 500);
  }, [id]);

  const ReviewCard = ({ review }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4 hover:shadow-md transition">
      <div className="flex gap-6">
        {/* Review Content */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                  <Star size={16} className="fill-gray-700 text-gray-700" />
                  <span className="font-bold text-gray-900">{review.rating}/10</span>
                </div>
                <span className="text-sm text-gray-600">
                  By <span className="font-medium text-gray-900">{review.author}</span> • {review.date}
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{review.title}</h3>
            </div>
          </div>

          <p className="text-gray-700 mb-4">{review.content}</p>

          {review.hasSpoiler && (
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium mb-3">
              Show Spoiler ▼
            </button>
          )}

          <div className="flex items-center gap-4 text-sm">
            <button className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition">
              <ThumbsUp size={18} />
              <span>Helpful {review.helpful}</span>
            </button>
            <span className="text-gray-400">•</span>
            <button className="flex items-center gap-2 text-gray-700 hover:text-red-600 transition">
              <ThumbsDown size={18} />
              <span>{review.notHelpful}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Avatar - Reviews</h1>
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
              reviews.map(review => <ReviewCard key={review.id} review={review} />)
            )}
          </div>

          {/* Sidebar - Movie Info */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Movie Info</h2>
              
              <div className="aspect-[2/3] bg-gray-200 rounded mb-4 flex items-center justify-center">
                <div className="text-gray-400">
                  <svg width="120" height="120" viewBox="0 0 120 120">
                    <line x1="30" y1="30" x2="90" y2="90" stroke="currentColor" strokeWidth="12" />
                    <line x1="90" y1="30" x2="30" y2="90" stroke="currentColor" strokeWidth="12" />
                  </svg>
                </div>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2">Avatar</h3>
              <p className="text-sm text-gray-600 mb-4">2009 • 2h30m</p>
              
              <div className="flex items-center gap-2 mb-4">
                <Star size={20} className="text-yellow-500" fill="currentColor" />
                <span className="text-lg font-bold">7.9/10</span>
                <span className="text-sm text-gray-600">(1000 reviews)</span>
              </div>

              <button 
                onClick={() => navigate(`/movie/${id}`)}
                className="w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-700 transition"
              >
                View Movie Details
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
