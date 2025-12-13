import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { X, Upload, Image } from 'lucide-react';

export default function MovieForm({ movie, onClose }) {
  const [formData, setFormData] = useState({
    title: '',
    originalTitle: '',
    description: '',
    releaseYear: new Date().getFullYear(),
    duration: 120,
    country: '',
    language: 'English',
    posterUrl: '',
    backgroundUrl: '',
    trailerUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [posterFile, setPosterFile] = useState(null);
  const [posterPreview, setPosterPreview] = useState('');
  const [backgroundFile, setBackgroundFile] = useState(null);
  const [backgroundPreview, setBackgroundPreview] = useState('');

  useEffect(() => {
    if (movie) {
      setFormData({
        title: movie.title || '',
        originalTitle: movie.originalTitle || movie.original_title || '',
        description: movie.description || '',
        releaseYear: movie.releaseYear || movie.release_year || new Date().getFullYear(),
        duration: movie.duration || 120,
        country: movie.country || '',
        language: movie.language || 'English',
        posterUrl: movie.posterUrl || movie.poster_url || '',
        backgroundUrl: movie.backgroundUrl || movie.background_url || '',
        trailerUrl: movie.trailerUrl || movie.trailer_url || ''
      });
      setPosterPreview(movie.posterUrl || movie.poster_url || '');
      setBackgroundPreview(movie.backgroundUrl || movie.background_url || '');
    }
  }, [movie]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      
      setPosterFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPosterPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBackgroundChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      
      setBackgroundFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBackgroundPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImages = async () => {
    const uploadFormData = new FormData();
    
    if (posterFile) {
      uploadFormData.append('poster', posterFile);
    }
    if (backgroundFile) {
      uploadFormData.append('background', backgroundFile);
    }

    if (posterFile || backgroundFile) {
      try {
        const response = await adminService.uploadMovieImages(uploadFormData);
        return response.data;
      } catch (error) {
        throw new Error('Failed to upload images: ' + error.message);
      }
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload images if any were selected
      const uploadedUrls = await uploadImages();
      console.log('Uploaded URLs:', uploadedUrls);
      
      const submitData = {
        ...formData,
        posterUrl: uploadedUrls?.posterUrl || formData.posterUrl,
        backgroundUrl: uploadedUrls?.backgroundUrl || formData.backgroundUrl
      };

      console.log('Submit Data:', submitData);

      if (movie) {
        await adminService.updateMovie(movie._id, submitData);
        alert('Movie updated successfully');
      } else {
        await adminService.createMovie(submitData);
        alert('Movie created successfully');
      }
      onClose();
    } catch (error) {
      alert('Error saving movie: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">
          {movie ? 'Edit Movie' : 'Add New Movie'}
        </h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded transition"
        >
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Original Title
            </label>
            <input
              type="text"
              name="originalTitle"
              value={formData.originalTitle}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Release Year *
            </label>
            <input
              type="number"
              name="releaseYear"
              value={formData.releaseYear}
              onChange={handleChange}
              required
              min="1800"
              max={new Date().getFullYear() + 5}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration (minutes) *
            </label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              required
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country *
            </label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Movie Poster *
          </label>
          
          {/* File Upload Area */}
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <label className="flex-1 cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-gray-400 transition">
                  <div className="flex items-center justify-center gap-3">
                    <Upload size={24} className="text-gray-400" />
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-700">
                        {posterFile ? posterFile.name : 'Click to upload poster image'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG, WEBP up to 5MB
                      </p>
                    </div>
                  </div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Preview */}
            {posterPreview && (
              <div className="relative w-48 h-64 border border-gray-300 rounded-lg overflow-hidden">
                <img
                  src={posterPreview}
                  alt="Poster preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setPosterFile(null);
                    setPosterPreview('');
                    setFormData({ ...formData, posterUrl: '' });
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {/* Or URL Input */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or paste URL</span>
              </div>
            </div>

            <input
              type="url"
              name="posterUrl"
              value={formData.posterUrl}
              onChange={(e) => {
                handleChange(e);
                if (e.target.value) {
                  setPosterPreview(e.target.value);
                  setPosterFile(null);
                }
              }}
              placeholder="https://example.com/poster.jpg"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Background Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Background Image (Ảnh nền/cảnh phim)
          </label>
          
          <div className="space-y-3">
            <label className="cursor-pointer">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-gray-400 transition">
                <div className="flex items-center justify-center gap-3">
                  <Image size={24} className="text-gray-400" />
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-700">
                      {backgroundFile ? backgroundFile.name : 'Click to upload background image'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Wide format recommended (1920x1080)
                    </p>
                  </div>
                </div>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleBackgroundChange}
                className="hidden"
              />
            </label>

            {/* Background Preview */}
            {backgroundPreview && (
              <div className="relative w-full h-48 border border-gray-300 rounded-lg overflow-hidden">
                <img
                  src={backgroundPreview}
                  alt="Background preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setBackgroundFile(null);
                    setBackgroundPreview('');
                    setFormData({ ...formData, backgroundUrl: '' });
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {/* Or URL Input */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or paste URL</span>
              </div>
            </div>

            <input
              type="url"
              name="backgroundUrl"
              value={formData.backgroundUrl}
              onChange={(e) => {
                handleChange(e);
                if (e.target.value) {
                  setBackgroundPreview(e.target.value);
                  setBackgroundFile(null);
                }
              }}
              placeholder="https://example.com/background.jpg"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Trailer URL
          </label>
          <input
            type="url"
            name="trailerUrl"
            value={formData.trailerUrl}
            onChange={handleChange}
            placeholder="https://www.youtube.com/watch?v=..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-700 transition disabled:opacity-50"
          >
            {loading ? 'Saving...' : movie ? 'Update Movie' : 'Create Movie'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
