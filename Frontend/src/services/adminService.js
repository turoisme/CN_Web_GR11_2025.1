import api from './api';

export const adminService = {
  // Dashboard stats
  getDashboardStats: async () => {
    const response = await api.get('/admin/stats');
    return response;
  },

  // User management
  getAllUsers: async () => {
    const response = await api.get('/admin/users');
    return response;
  },

  getUserById: async (userId) => {
    const response = await api.get(`/admin/users/${userId}`);
    return response;
  },

  updateUserRole: async (userId, role) => {
    const response = await api.put(`/admin/users/${userId}/role`, { role });
    return response;
  },

  updateUserStatus: async (userId, isActive) => {
    const response = await api.put(`/admin/users/${userId}/status`, { isActive });
    return response;
  },

  deleteUser: async (userId) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response;
  },

  // Review moderation
  getAllReviews: async () => {
    const response = await api.get('/admin/reviews');
    return response;
  },

  toggleReviewVisibility: async (reviewId, isVisible) => {
    const response = await api.put(`/admin/reviews/${reviewId}/visibility`, { isVisible });
    return response;
  },

  deleteReview: async (reviewId) => {
    const response = await api.delete(`/admin/reviews/${reviewId}`);
    return response;
  },

  // Rating management
  getAllRatings: async (params) => {
    const response = await api.get('/admin/ratings', { params });
    return response;
  },

  deleteRating: async (ratingId) => {
    const response = await api.delete(`/admin/ratings/${ratingId}`);
    return response;
  },

  // Movie management
  getAllMovies: async () => {
    const response = await api.get('/admin/movies');
    return response;
  },

  createMovie: async (movieData) => {
    const response = await api.post('/admin/movies', movieData);
    return response;
  },

  updateMovie: async (movieId, movieData) => {
    const response = await api.put(`/admin/movies/${movieId}`, movieData);
    return response;
  },

  deleteMovie: async (movieId) => {
    const response = await api.delete(`/admin/movies/${movieId}`);
    return response;
  },

  // Upload movie images (poster, backdrop, screenshots)
  uploadMovieImages: async (formData) => {
    const response = await api.post('/admin/movies/upload-images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response;
  }
};
