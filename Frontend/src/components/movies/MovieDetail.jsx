import React from 'react';
import ReviewList from '../reviews/ReviewList';

const MovieDetail = ({ movie }) => {
  // movie.movie_id chính là số 2, 7, 3... trong hình Compass của bạn
  const currentMovieId = movie?.movie_id; 

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Phần thông tin phim */}
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-4">{movie?.title}</h1>
          <p className="text-lg text-gray-700">{movie?.content || "Mô tả phim đang cập nhật..."}</p>
        </div>
      </div>

      {/* PHẦN QUAN TRỌNG: Hiển thị các Review từ DB */}
      <div className="mt-12 border-t pt-8">
        <h2 className="text-2xl font-bold mb-6">Đánh giá từ người dùng</h2>
        {currentMovieId ? (
          <ReviewList movieId={currentMovieId} />
        ) : (
          <p>Đang tải ID phim...</p>
        )}
      </div>
    </div>
  );
};

export default MovieDetail;