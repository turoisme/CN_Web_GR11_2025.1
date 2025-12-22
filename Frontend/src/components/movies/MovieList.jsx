import React from 'react';
import ReviewList from '../reviews/ReviewList'; // Import "máy bơm" dữ liệu

const MovieDetail = ({ movie }) => {
  // movie._id là mã định danh để Backend biết cần lấy review của phim nào
  return (
    <div className="movie-container">
      <h1 className="text-2xl font-bold">{movie?.title}</h1>
      <p>{movie?.description}</p>
      
      <div className="mt-10 bg-gray-50 p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4">Đánh giá từ khán giả</h2>
        {/* Gọi component ReviewList và truyền ID phim vào */}
        <ReviewList movieId={movie?._id} />
      </div>
    </div>
  );
};

export default MovieDetail;