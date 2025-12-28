import api from './api';

const normalizeMovie = (movie) => {
  if (!movie) return movie;

  return {
    ...movie,
    // Normalize common field differences between API responses
    posterUrl: movie.posterUrl ?? movie.poster_url ?? movie.poster,
    backgroundUrl: movie.backgroundUrl ?? movie.background_url,
    trailerUrl: movie.trailerUrl ?? movie.trailer_url,
    releaseYear: movie.releaseYear ?? movie.release_year,

    averageRating:
      typeof movie.averageRating === 'number'
        ? movie.averageRating
        : (movie.average_score ?? movie.averageScore ?? 0),

    // Frontend expects ratingCount/reviewCount in multiple places
    ratingCount: movie.ratingCount ?? movie.totalRatings ?? 0,
    reviewCount: movie.reviewCount ?? movie.totalReviews ?? 0
  };
};

const normalizeMoviesResponse = (response) => {
  if (!response?.success) return response;

  // List responses: data.movies
  if (response.data?.movies && Array.isArray(response.data.movies)) {
    return {
      ...response,
      data: {
        ...response.data,
        movies: response.data.movies.map(normalizeMovie)
      }
    };
  }

  // Single response: data.movie
  if (response.data?.movie) {
    return {
      ...response,
      data: {
        ...response.data,
        movie: normalizeMovie(response.data.movie)
      }
    };
  }

  return response;
};

const movieService = {
  // Get all movies
  getAllMovies: async (params) => {
    const response = await api.get('/movies', { params });
    return normalizeMoviesResponse(response);
  },

  // Get movie by ID
  getMovieById: async (movieId) => {
    const response = await api.get(`/movies/${movieId}`);
    return normalizeMoviesResponse(response);
  },

  // Get movies by genre
  getMoviesByGenre: async (genreId, params) => {
    const response = await api.get(`/movies/genre/${genreId}`, { params });
    return normalizeMoviesResponse(response);
  },

  // Search movies
  searchMovies: async (params) => {
    const response = await api.get('/movies/search', { params });
    return normalizeMoviesResponse(response);
  },

  // Get top rated movies
  getTopRatedMovies: async (limit = 10) => {
    const response = await api.get('/movies/top-rated', { 
      params: { limit } 
    });
    return normalizeMoviesResponse(response);
  }
};

export default movieService;
