import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { Edit, Trash2, Plus, Search } from 'lucide-react';
import MovieForm from './MovieForm';

export default function MovieManagement() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllMovies();
      setMovies(response.data?.movies || []);
    } catch (error) {
      console.error('Error fetching movies:', error);
      alert('Error loading movies: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMovie = async (movieId) => {
    if (!window.confirm('Are you sure you want to delete this movie?')) return;
    
    try {
      await adminService.deleteMovie(movieId);
      fetchMovies();
      alert('Movie deleted successfully');
    } catch (error) {
      alert('Error deleting movie: ' + error.message);
    }
  };

  const handleEdit = (movie) => {
    setEditingMovie(movie);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingMovie(null);
    fetchMovies();
  };

  const filteredMovies = movies.filter(movie =>
    movie.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="text-gray-500">Loading movies...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Movie Management</h1>
          <p className="text-gray-600">Manage all movies in the system</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
        >
          <Plus size={20} />
          Add Movie
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search movies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredMovies.map((movie) => (
          <div key={movie._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="w-full aspect-[2/3] bg-gray-200 overflow-hidden">
              <img
                src={movie.posterUrl || movie.poster_url || '/placeholder-poster.jpg'}
                alt={movie.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x400?text=No+Poster';
                }}
              />
            </div>
            <div className="p-3">
              <h3 className="font-bold text-sm mb-1 line-clamp-1">{movie.title || 'Untitled'}</h3>
              <p className="text-gray-600 text-xs mb-2">{movie.releaseYear || movie.release_year || 'N/A'}</p>
              <div className="flex items-center justify-between">
                <span className="text-yellow-500 font-bold text-xs">
                  ⭐ {(movie.averageRating || movie.average_score || 0).toFixed(1)}
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(movie)}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition"
                    title="Edit movie"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteMovie(movie._id)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded transition"
                    title="Delete movie"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMovies.length === 0 && (
        <div className="text-center py-12 text-gray-500">No movies found</div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <MovieForm
              movie={editingMovie}
              onClose={handleFormClose}
            />
          </div>
        </div>
      )}
    </div>
  );
}

