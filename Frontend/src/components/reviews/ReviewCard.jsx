import React from 'react';

const ReviewCard = ({ review }) => {
  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white">
      <div className="flex justify-between items-center">
        <span className="font-bold text-blue-600">{review.user?.username || 'Người dùng'}</span>
        <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-sm">
          ⭐ {review.rating}/10
        </span>
      </div>
      <p className="mt-2 text-gray-700">{review.content}</p>
      <div className="mt-3 text-xs text-gray-400 flex justify-between">
        <span>Hữu ích: {review.helpfulVotes}</span>
        <span>{new Date(review.createdAt).toLocaleDateString('vi-VN')}</span>
      </div>
    </div>
  );
};

export default ReviewCard;