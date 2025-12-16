import React, { useEffect, useState } from 'react';
import ReviewCard from './ReviewCard';

const ReviewList = ({ movieId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // Gọi API Backend: GET /api/reviews/movie/:movieId
        const response = await fetch(`http://localhost:5000/api/reviews/movie/${movieId}`);
        const result = await response.json();
        if (result.success) {
          setReviews(result.data.reviews);
        }
      } catch (error) {
        console.error("Lỗi fetch reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    if (movieId) fetchReviews();
  }, [movieId]);

  if (loading) return <div className="text-center">Đang tải đánh giá...</div>;

  // Trong phần return của ReviewList.jsx, hãy dùng đúng tên trường từ Compass:
    {reviews.map((rev) => (
    <div key={rev._id} className="bg-white p-4 rounded shadow mb-4">
        <div className="flex justify-between">
        <h4 className="font-bold text-lg">{rev.title}</h4> {/* Tiêu đề review */}
        <span className="text-yellow-500 font-bold">⭐ {rev.rating}/10</span>
        </div>
        <p className="text-gray-600 my-2">{rev.content}</p> {/* Nội dung review */}
        <div className="text-sm text-gray-400">
        <span>Hữu ích: {rev.helpful_count}</span> | 
        <span> Trạng thái: {rev.status}</span>
        </div>
    </div>
    ))}
};

export default ReviewList;