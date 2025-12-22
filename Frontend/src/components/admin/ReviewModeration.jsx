import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { Trash2, Eye, EyeOff, Search } from 'lucide-react';

export default function ReviewModeration() {
  const [activeTab, setActiveTab] = useState('reviews');
  const [reviews, setReviews] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMovie, setFilterMovie] = useState('');
  const [filterUser, setFilterUser] = useState('');

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'reviews') {
        const response = await adminService.getAllReviews();
        if (response && response.data && response.data.data) {
          setReviews(response.data.data.reviews || []);
        }
      } else {
        const params = {};
        if (filterMovie) params.movieId = filterMovie;
        if (filterUser) params.userId = filterUser;
        const response = await adminService.getAllRatings(params);
        if (response && response.data && response.data.data) {
          setRatings(response.data.data.ratings || []);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa review này?')) {
      return;
    }

    try {
      await adminService.deleteReview(reviewId);
      setReviews(reviews.filter(r => r._id !== reviewId));
      alert('Xóa review thành công');
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Lỗi khi xóa review');
    }
  };

  const handleDeleteRating = async (ratingId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa rating này?')) {
      return;
    }

    try {
      await adminService.deleteRating(ratingId);
      setRatings(ratings.filter(r => r._id !== ratingId));
      alert('Xóa rating thành công');
    } catch (error) {
      console.error('Error deleting rating:', error);
      alert('Lỗi khi xóa rating');
    }
  };

  const handleToggleVisibility = async (reviewId, currentVisibility) => {
    try {
      await adminService.toggleReviewVisibility(reviewId, !currentVisibility);
      setReviews(reviews.map(r => 
        r._id === reviewId ? { ...r, isHidden: !currentVisibility } : r
      ));
    } catch (error) {
      console.error('Error toggling visibility:', error);
      alert('Lỗi khi thay đổi trạng thái');
    }
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = !searchTerm || 
      review.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.movie?.title?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const filteredRatings = ratings.filter(rating => {
    const matchesSearch = !searchTerm ||
      rating.user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rating.movie?.title?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Quản lý Reviews và Ratings</h1>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === 'reviews'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Reviews
            </button>
            <button
              onClick={() => setActiveTab('ratings')}
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === 'ratings'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Ratings
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-4 flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8 text-gray-500">Đang tải...</div>
          ) : activeTab === 'reviews' ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">User</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Movie</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Rating</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Content</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReviews.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-8 text-gray-500">
                        Không có review nào
                      </td>
                    </tr>
                  ) : (
                    filteredReviews.map((review) => (
                      <tr key={review._id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div className="font-medium">{review.user?.username || 'N/A'}</div>
                          <div className="text-sm text-gray-500">{review.user?.email || ''}</div>
                        </td>
                        <td className="py-4 px-4">{review.movie?.title || 'N/A'}</td>
                        <td className="py-4 px-4">
                          <span className="font-semibold">⭐ {review.rating || 0}</span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="max-w-md truncate">{review.content || 'N/A'}</div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-1 rounded text-xs ${
                            review.isHidden 
                              ? 'bg-red-100 text-red-700' 
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {review.isHidden ? 'Ẩn' : 'Hiển thị'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleToggleVisibility(review._id, review.isHidden)}
                              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                              title={review.isHidden ? 'Hiển thị' : 'Ẩn'}
                            >
                              {review.isHidden ? <Eye size={18} /> : <EyeOff size={18} />}
                            </button>
                            <button
                              onClick={() => handleDeleteReview(review._id)}
                              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                              title="Xóa"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">User</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Movie</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Rating</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRatings.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-8 text-gray-500">
                        Không có rating nào
                      </td>
                    </tr>
                  ) : (
                    filteredRatings.map((rating) => (
                      <tr key={rating._id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div className="font-medium">{rating.user?.username || 'N/A'}</div>
                          <div className="text-sm text-gray-500">{rating.user?.email || ''}</div>
                        </td>
                        <td className="py-4 px-4">{rating.movie?.title || 'N/A'}</td>
                        <td className="py-4 px-4">
                          <span className="font-semibold">⭐ {rating.score || 0}</span>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600">
                          {new Date(rating.createdAt).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="py-4 px-4">
                          <button
                            onClick={() => handleDeleteRating(rating._id)}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                            title="Xóa"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
