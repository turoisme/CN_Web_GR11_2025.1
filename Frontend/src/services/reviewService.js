import api from './api';

const reviewService = {
  // Get reviews for a movie
  getMovieReviews: async (movieId, params) => {
    const response = await api.get(`/reviews/movie/${movieId}`, { params });
    return response;
  },

  // Create a rating
  createRating: async (ratingData) => {
    const response = await api.post('/reviews/rating', ratingData);
    return response;
  },

  // Create a review
  createReview: async (reviewData) => {
    const response = await api.post('/reviews', reviewData);
    return response;
  },

  // Update a review
  updateReview: async (reviewId, reviewData) => {
    const response = await api.put(`/reviews/${reviewId}`, reviewData);
    return response;
  },

  // Delete a review
  deleteReview: async (reviewId) => {
    const response = await api.delete(`/reviews/${reviewId}`);
    return response;
  },

  // Delete a rating
  deleteRating: async (movieId) => {
    const response = await api.delete(`/reviews/rating/${movieId}`);
    return response;
  },

  // Vote on a review
  voteReview: async (reviewId, voteType) => {
    const response = await api.post(`/reviews/${reviewId}/vote`, { voteType });
    return response;
  }
};

export default reviewService;
