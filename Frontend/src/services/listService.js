import api from './api';

const listService = {
  // Get user's watchlist
  getWatchlist: async () => {
    const response = await api.get('/lists/watchlist/me');
    return response;
  },

  // Add movie to watchlist
  addToWatchlist: async (movieId) => {
    const response = await api.post(`/lists/watchlist/${movieId}`);
    return response;
  },

  // Remove movie from watchlist
  removeFromWatchlist: async (movieId) => {
    const response = await api.delete(`/lists/watchlist/${movieId}`);
    return response;
  },

  // Get all custom lists
  getAllLists: async (params) => {
    const response = await api.get('/lists', { params });
    return response;
  },

  // Get list by ID
  getListById: async (listId) => {
    const response = await api.get(`/lists/${listId}`);
    return response;
  },

  // Create a new list
  createList: async (listData) => {
    const response = await api.post('/lists', listData);
    return response;
  },

  // Update a list
  updateList: async (listId, listData) => {
    const response = await api.put(`/lists/${listId}`, listData);
    return response;
  },

  // Delete a list
  deleteList: async (listId) => {
    const response = await api.delete(`/lists/${listId}`);
    return response;
  },

  // Add movie to list
  addMovieToList: async (listId, movieId) => {
    const response = await api.post(`/lists/${listId}/movies`, { movieId });
    return response;
  },

  // Remove movie from list
  removeMovieFromList: async (listId, movieId) => {
    const response = await api.delete(`/lists/${listId}/movies/${movieId}`);
    return response;
  }
};

export default listService;
