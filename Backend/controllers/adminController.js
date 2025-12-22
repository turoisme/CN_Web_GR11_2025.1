const User = require('../models/User');
const Movie = require('../models/Movie');
const Review = require('../models/Review');
const Genre = require('../models/Genre');
const Director = require('../models/Director');
const Actor = require('../models/Actor');
const { HTTP_STATUS, MESSAGES } = require('../utils/constants');
const { validatePaginationParams } = require('../utils/validators');

// ========== USER MANAGEMENT (UC014) ==========

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res, next) => {
  try {
    const { page, limit } = validatePaginationParams(
      req.query.page,
      req.query.limit
    );
    const { search, role, isActive } = req.query;

    // Build filter
    const filter = {};
    if (search) {
      filter.$or = [
        { username: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') }
      ];
    }
    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const total = await User.countDocuments(filter);

    const users = await User.find(filter)
      .select('-password')
      .sort('-createdAt')
      .limit(limit)
      .skip((page - 1) * limit);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Private/Admin
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: MESSAGES.USER_NOT_FOUND
      });
    }

    // Get user statistics
    const Review = require('../models/Review');
    const Rating = require('../models/Rating');
    const List = require('../models/List');

    const stats = {
      totalReviews: await Review.countDocuments({ user: user._id }),
      totalRatings: await Rating.countDocuments({ user: user._id }),
      totalLists: await List.countDocuments({ user: user._id })
    };

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: { user, stats }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
exports.updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: MESSAGES.USER_NOT_FOUND
      });
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'User role updated successfully',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Activate/Deactivate user
// @route   PUT /api/admin/users/:id/status
// @access  Private/Admin
exports.updateUserStatus = async (req, res, next) => {
  try {
    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: MESSAGES.USER_NOT_FOUND
      });
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: MESSAGES.USER_NOT_FOUND
      });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'You cannot delete your own account'
      });
    }

    await user.deleteOne();

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: MESSAGES.DELETED
    });
  } catch (error) {
    next(error);
  }
};

// ========== MOVIE MANAGEMENT (UC015) ==========

// @desc    Get all movies (admin - no filter)
// @route   GET /api/admin/movies
// @access  Private/Admin
exports.getAllMovies = async (req, res, next) => {
  try {
    const { page, limit } = validatePaginationParams(
      req.query.page,
      req.query.limit
    );
    const { search, isActive } = req.query;

    const filter = {};
    
    if (search) {
      filter.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      ];
    }
    
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    const total = await Movie.countDocuments(filter);

    const moviesRaw = await Movie.find(filter)
      .sort('-createdAt')
      .limit(limit)
      .skip((page - 1) * limit)
      .select('-__v')
      .lean();

    const movies = await Promise.all(
      moviesRaw.map(async (movie) => {
        try {
          const genresArray = Array.isArray(movie.genres) ? movie.genres : [];
          const directorsArray = Array.isArray(movie.directors) ? movie.directors : [];
          const actorsArray = Array.isArray(movie.actors) ? movie.actors : [];

          const validGenreIds = genresArray.filter(id => {
            if (!id) return false;
            const idStr = id.toString();
            return /^[0-9a-fA-F]{24}$/.test(idStr) && !idStr.includes('|');
          });

          const validDirectorIds = directorsArray.filter(id => {
            if (!id) return false;
            return /^[0-9a-fA-F]{24}$/.test(id.toString());
          });

          const validActorIds = actorsArray.filter(id => {
            if (!id) return false;
            return /^[0-9a-fA-F]{24}$/.test(id.toString());
          });

          const populatedMovie = { ...movie };
          
          if (validGenreIds.length > 0) {
            const genres = await Genre.find({ _id: { $in: validGenreIds } }).select('name slug').lean();
            populatedMovie.genres = genres;
          } else {
            populatedMovie.genres = [];
          }

          if (validDirectorIds.length > 0) {
            const directors = await Director.find({ _id: { $in: validDirectorIds } }).select('name').lean();
            populatedMovie.directors = directors;
          } else {
            populatedMovie.directors = [];
          }

          if (validActorIds.length > 0) {
            const actors = await Actor.find({ _id: { $in: validActorIds } }).select('name').lean();
            populatedMovie.actors = actors;
          } else {
            populatedMovie.actors = [];
          }

          if (movie.createdBy) {
            const user = await User.findById(movie.createdBy).select('username').lean();
            populatedMovie.createdBy = user;
          }

          return populatedMovie;
        } catch (error) {
          console.error(`Error populating movie ${movie._id}:`, error.message);
          return {
            ...movie,
            genres: [],
            directors: [],
            actors: [],
            createdBy: null
          };
        }
      })
    );

    const transformedMovies = movies.map(movie => {
      return {
        ...movie,
        posterUrl: movie.posterUrl || movie.poster_url,
        trailerUrl: movie.trailerUrl || movie.trailer_url,
        releaseYear: movie.releaseYear || movie.release_year,
        originalTitle: movie.originalTitle || movie.original_title,
        averageRating: movie.averageRating || movie.average_score || 0,
        totalRatings: movie.totalRatings || movie.total_ratings || 0,
        isActive: movie.isActive !== undefined ? movie.isActive : (movie.is_active !== undefined ? movie.is_active : true)
      };
    });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        movies: transformedMovies,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create movie
// @route   POST /api/admin/movies
// @access  Private/Admin
exports.createMovie = async (req, res, next) => {
  try {
    console.log('CREATE MOVIE - Request Body:', req.body);
    const movieData = {
      ...req.body,
      createdBy: req.user._id
    };
    console.log('CREATE MOVIE - Movie Data:', movieData);

    const movie = await Movie.create(movieData);

    const populatedMovie = await Movie.findById(movie._id)
      .populate('genres', 'name')
      .populate('directors', 'name')
      .populate('actors', 'name');

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'Movie created successfully',
      data: { movie: populatedMovie }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update movie
// @route   PUT /api/admin/movies/:id
// @access  Private/Admin
exports.updateMovie = async (req, res, next) => {
  try {
    console.log('UPDATE MOVIE - Movie ID:', req.params.id);
    console.log('UPDATE MOVIE - Request Body:', req.body);
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('genres', 'name')
      .populate('directors', 'name')
      .populate('actors', 'name');

    if (!movie) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: MESSAGES.MOVIE_NOT_FOUND
      });
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: MESSAGES.UPDATED,
      data: { movie }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete movie
// @route   DELETE /api/admin/movies/:id
// @access  Private/Admin
exports.deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: MESSAGES.MOVIE_NOT_FOUND
      });
    }

    await movie.deleteOne();

    // Optional: Delete associated reviews and ratings
    await Review.deleteMany({ movie: req.params.id });
    await require('../models/Rating').deleteMany({ movie: req.params.id });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: MESSAGES.DELETED
    });
  } catch (error) {
    next(error);
  }
};

// ========== REVIEW MODERATION (UC016) ==========

// @desc    Get all reviews (with filters)
// @route   GET /api/admin/reviews
// @access  Private/Admin
exports.getAllReviews = async (req, res, next) => {
  try {
    const { page, limit } = validatePaginationParams(
      req.query.page,
      req.query.limit
    );
    const { isHidden, movieId, userId } = req.query;

    // Build filter
    const filter = {};
    if (isHidden !== undefined) filter.isHidden = isHidden === 'true';
    if (movieId) filter.movie = movieId;
    if (userId) filter.user = userId;

    const total = await Review.countDocuments(filter);

    const reviews = await Review.find(filter)
      .populate('user', 'username email')
      .populate('movie', 'title')
      .sort('-createdAt')
      .limit(limit)
      .skip((page - 1) * limit);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        reviews,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Hide/Unhide review
// @route   PUT /api/admin/reviews/:id/visibility
// @access  Private/Admin
exports.toggleReviewVisibility = async (req, res, next) => {
  try {
    const { isHidden } = req.body;

    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { isHidden },
      { new: true }
    );

    if (!review) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: MESSAGES.REVIEW_NOT_FOUND
      });
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: `Review ${isHidden ? 'hidden' : 'unhidden'} successfully`,
      data: { review }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete review
// @route   DELETE /api/admin/reviews/:id
// @access  Private/Admin
exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: MESSAGES.REVIEW_NOT_FOUND
      });
    }

    await review.deleteOne();

    // Recalculate movie rating
    const recalculateMovieRating = require('./reviewController').recalculateMovieRating;
    if (recalculateMovieRating) {
      await recalculateMovieRating(review.movie);
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: MESSAGES.DELETED
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getDashboardStats = async (req, res, next) => {
  try {
    const Rating = require('../models/Rating');
    const totalUsers = await User.countDocuments();
    const totalMovies = await Movie.countDocuments();
    const totalReviews = await Review.countDocuments();
    const totalRatings = await Rating.countDocuments();
    
    console.log('Dashboard stats - Total movies:', totalMovies);
    console.log('Dashboard stats - Total ratings:', totalRatings);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const newUsers = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });
    const oldUsers = totalUsers - newUsers;

    const fifteenDaysAgo = new Date();
    fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);
    
    const ratingsByDate = await Rating.aggregate([
      {
        $match: {
          createdAt: { $gte: fifteenDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%b %d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const ratingsMap = new Map();
    ratingsByDate.forEach(item => {
      const key = item._id.trim();
      ratingsMap.set(key, item.count);
    });

    const chartData = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 14; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const day = date.getDate();
      const dateStr = `${monthNames[date.getMonth()]} ${String(day).padStart(2, '0')}`;
      
      const count = ratingsMap.get(dateStr) || 0;
      
      chartData.push({
        date: dateStr,
        value: count
      });
    }
    
    if (chartData.length !== 15) {
      console.warn(`Warning: Expected 15 days but got ${chartData.length} days`);
    }

    const recentUsers = await User.find()
      .select('username email createdAt')
      .sort('-createdAt')
      .limit(5);
    
    let topRatedMovies = [];
    
    try {
      const topRatedMoviesAggregation = await Rating.aggregate([
        {
          $match: {
            createdAt: { $gte: thirtyDaysAgo }
          }
        },
        {
          $group: {
            _id: '$movie',
            recentRatingCount: { $sum: 1 }
          }
        },
        {
          $sort: { recentRatingCount: -1 }
        },
        {
          $limit: 10
        },
        {
          $lookup: {
            from: 'movies',
            localField: '_id',
            foreignField: '_id',
            as: 'movieData'
          }
        },
        {
          $unwind: '$movieData'
        },
        {
          $project: {
            _id: '$movieData._id',
            title: '$movieData.title',
            averageRating: '$movieData.averageRating',
            totalRatings: '$movieData.totalRatings',
            posterUrl: '$movieData.posterUrl',
            recentRatingCount: 1
          }
        }
      ]);

      console.log('Top rated movies aggregation result:', topRatedMoviesAggregation);
      console.log('Aggregation length:', topRatedMoviesAggregation ? topRatedMoviesAggregation.length : 0);
      
      if (topRatedMoviesAggregation && topRatedMoviesAggregation.length > 0) {
        topRatedMovies = topRatedMoviesAggregation.map(item => ({
          _id: item._id ? item._id.toString() : null,
          title: item.title || 'Untitled',
          averageRating: item.averageRating || 0,
          totalRatings: item.totalRatings || 0,
          posterUrl: item.posterUrl || '',
          recentRatingCount: item.recentRatingCount || 0
        }));
        console.log('Mapped from aggregation:', topRatedMovies.length);
      }
    } catch (error) {
      console.error('Error in aggregation:', error);
    }
    
    if (!topRatedMovies || topRatedMovies.length === 0) {
      console.log('No recent ratings found, using fallback - getting all movies');
      try {
        const movieCount = await Movie.countDocuments();
        console.log('Total movies in database:', movieCount);
        
        if (movieCount > 0) {
          const allMovies = await Movie.find({})
            .sort('-totalRatings -averageRating -createdAt')
            .limit(10)
            .select('title averageRating totalRatings posterUrl _id')
            .lean();
          
          console.log('All movies query result count:', allMovies ? allMovies.length : 0);
          console.log('All movies query result:', JSON.stringify(allMovies, null, 2));
          
          if (allMovies && allMovies.length > 0) {
            topRatedMovies = allMovies.map(movie => ({
              _id: movie._id ? movie._id.toString() : null,
              title: movie.title || 'Untitled',
              averageRating: movie.averageRating || 0,
              totalRatings: movie.totalRatings || 0,
              posterUrl: movie.posterUrl || '',
              recentRatingCount: 0
            }));
            console.log('Mapped movies:', topRatedMovies.length);
          } else {
            console.log('Query returned empty array even though count > 0');
          }
        } else {
          console.log('No movies found in database at all - database is empty');
        }
      } catch (error) {
        console.error('Error in fallback query:', error);
        console.error('Error stack:', error.stack);
      }
    }
    
    console.log('Final top rated movies count:', topRatedMovies ? topRatedMovies.length : 0);
    console.log('Final top rated movies:', JSON.stringify(topRatedMovies, null, 2));
    
    if (!topRatedMovies || topRatedMovies.length === 0) {
      console.warn('WARNING: No movies to return! Database may be empty or query failed.');
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalMovies,
          totalReviews,
          totalRatings,
          newUsers,
          oldUsers
        },
        chartData,
        recentUsers,
        topRatedMovies: topRatedMovies || []
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload movie images (poster, background)
// @route   POST /api/admin/movies/upload-images
// @access  Private/Admin
exports.uploadMovieImages = async (req, res, next) => {
  try {
    const uploadedUrls = {};

    // Get base URL
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    // Handle poster
    if (req.files.poster && req.files.poster[0]) {
      uploadedUrls.posterUrl = `${baseUrl}/uploads/movies/${req.files.poster[0].filename}`;
    }

    // Handle background
    if (req.files.background && req.files.background[0]) {
      uploadedUrls.backgroundUrl = `${baseUrl}/uploads/movies/${req.files.background[0].filename}`;
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Images uploaded successfully',
      data: uploadedUrls
    });
  } catch (error) {
    next(error);
  }
};
