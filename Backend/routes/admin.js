const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUserRole,
  updateUserStatus,
  deleteUser,
  getAllMovies,
  createMovie,
  updateMovie,
  deleteMovie,
  getAllReviews,
  toggleReviewVisibility,
  deleteReview,
  getDashboardStats,
  uploadMovieImages
} = require('../controllers/adminController');
const { protect } = require('../middlewares/authMiddleware');
const { isAdmin } = require('../middlewares/adminMiddleware');
const { validateObjectId, validateMovie } = require('../middlewares/validationMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// All admin routes require authentication and admin role
router.use(protect, isAdmin);

// Dashboard
router.get('/stats', getDashboardStats);

// User management
router.get('/users', getAllUsers);
router.get('/users/:id', validateObjectId('id'), getUserById);
router.put('/users/:id/role', validateObjectId('id'), updateUserRole);
router.put('/users/:id/status', validateObjectId('id'), updateUserStatus);
router.delete('/users/:id', validateObjectId('id'), deleteUser);

// Movie management
router.get('/movies', getAllMovies);

// Upload movie images - MUST be before /:id routes
router.post('/movies/upload-images', upload.fields([
  { name: 'poster', maxCount: 1 },
  { name: 'background', maxCount: 1 }
]), uploadMovieImages);

router.post('/movies', validateMovie, createMovie);
router.put('/movies/:id', validateObjectId('id'), validateMovie, updateMovie);
router.delete('/movies/:id', validateObjectId('id'), deleteMovie);

// Review moderation
router.get('/reviews', getAllReviews);
router.put('/reviews/:id/visibility', validateObjectId('id'), toggleReviewVisibility);
router.delete('/reviews/:id', validateObjectId('id'), deleteReview);

module.exports = router;