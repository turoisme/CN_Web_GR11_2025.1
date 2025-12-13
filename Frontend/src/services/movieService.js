import api from './api';

const movieService = {
  // Get all movies
  getAllMovies: async (params) => {
    const response = await api.get('/movies', { params });
    return response;
  },

  // Get movie by ID
  getMovieById: async (movieId) => {
    const response = await api.get(`/movies/${movieId}`);
    return response;
  },

  // Get movies by genre
  getMoviesByGenre: async (genreId, params) => {
    const response = await api.get(`/movies/genre/${genreId}`, { params });
    return response;
  },

  // Search movies
  searchMovies: async (query, params) => {
    const response = await api.get('/movies/search', { 
      params: { query, ...params } 
    });
    return response;
  },

  // Get top rated movies
  getTopRatedMovies: async (limit = 10) => {
    const response = await api.get('/movies/top-rated', { 
      params: { limit } 
    });
    return response;
  }
};

export default movieService;
