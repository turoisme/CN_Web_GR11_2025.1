# FilmRate - Movie Rating & Review Platform

A full-stack web application for rating and reviewing movies, built with React and Node.js.

## 🚀 Features

- **User Authentication**: Register, login, and manage user profiles
- **Movie Browsing**: Browse movies with detailed information
- **Rating & Reviews**: Rate movies (1-10 stars) and write detailed reviews
- **Wishlist**: Save movies to personal wishlist
- **Admin Dashboard**: Manage users, movies, and reviews
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MongoDB Atlas Account** - [Sign up](https://www.mongodb.com/cloud/atlas)
- **Git** - [Download](https://git-scm.com/)

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/turoisme/CN_Web_GR11_2025.1.git
cd FilmRate
```

### 2. Backend Setup

```bash
# Navigate to Backend folder
cd Backend

# Install dependencies
npm install

# Create .env file
# Copy and paste the following into Backend/.env
```

**Backend/.env** file:
```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://filmrate_user:filmrate2025@cluster0.g8nbbyz.mongodb.net/filmrate?retryWrites=true&w=majority

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=filmrate_super_secret_key_2025_gr11_cnweb
JWT_EXPIRE=7d
```

### 3. Frontend Setup

```bash
# Navigate to Frontend folder (from root)
cd Frontend

# Install dependencies
npm install

# Create .env file
# Copy and paste the following into Frontend/.env
```

**Frontend/.env** file:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🚦 Running the Application

### Start Backend Server

```bash
# From Backend folder
cd Backend
npm start
```

You should see:
```
🚀 Server running on port 5000
✅ MongoDB Connected: ac-tgjwxdd-shard-00-01.g8nbbyz.mongodb.net
```

Backend will run on: `http://localhost:5000`

### Start Frontend Development Server

Open a **new terminal** and run:

```bash
# From Frontend folder
cd Frontend
npm start
```

Frontend will automatically open at: `http://localhost:3000`

## 👤 Default Admin Accounts

Two admin accounts are available for testing:

**Admin 1:**
- Email: `admin1@filmrate.com`
- Password: `Admin123@`

**Admin 2:**
- Email: `admin2@filmrate.com`
- Password: `Admin123@`

## 📁 Project Structure

```
FilmRate/
├── Backend/
│   ├── config/          # Configuration files (database, auth, etc.)
│   ├── controllers/     # Route controllers
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── services/        # Business logic services
│   ├── middlewares/     # Custom middleware
│   ├── utils/           # Utility functions
│   ├── server.js        # Entry point
│   ├── package.json
│   └── .env
│
├── Frontend/
│   ├── public/
│   │   ├── logo/        # Application logo
│   │   └── index.html
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   │   ├── common/  # Header, Footer, etc.
│   │   │   ├── auth/    # Login, Register components
│   │   │   ├── movies/  # Movie-related components
│   │   │   └── reviews/ # Review components
│   │   ├── context/     # React Context (Auth, Theme)
│   │   ├── pages/       # Page components
│   │   ├── services/    # API service calls
│   │   ├── styles/      # Global CSS
│   │   ├── utils/       # Helper functions
│   │   ├── App.jsx      # Main app component
│   │   └── index.js     # Entry point
│   ├── package.json
│   ├── tailwind.config.js
│   └── .env
│
├── .gitignore
└── README.md
```

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Movies
- `GET /api/movies` - Get all movies
- `GET /api/movies/:id` - Get movie by ID
- `POST /api/movies` - Create movie (Admin only)
- `PUT /api/movies/:id` - Update movie (Admin only)
- `DELETE /api/movies/:id` - Delete movie (Admin only)

### Reviews
- `GET /api/reviews` - Get all reviews
- `GET /api/reviews/movie/:movieId` - Get reviews for a movie
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/stats` - Get dashboard statistics
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user

## 🎨 Pages

1. **Home** (`/`) - Landing page with movie carousel
2. **Movie Detail** (`/movie/:id`) - Detailed movie information with reviews
3. **Movie Reviews** (`/movie/:id/reviews`) - All reviews for a specific movie
4. **Wishlist** (`/wishlist`) - User's saved movies
5. **Reviews** (`/reviews`) - All reviews across platform
6. **Login** (`/login`) - User authentication
7. **Register** (`/register`) - New user registration
8. **Profile** (`/profile`) - User profile management
9. **Admin Dashboard** (`/admin`) - Admin panel (Admin only)

## 🔐 Authentication Flow

1. User registers with email, username, and password
2. Password is hashed using bcrypt
3. Upon login, JWT token is generated
4. Token is stored in localStorage
5. Protected routes check for valid token
6. Admin routes check for admin role

## 🛡️ Environment Variables

### Backend
- `MONGODB_URI` - MongoDB connection string
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `JWT_SECRET` - Secret key for JWT signing
- `JWT_EXPIRE` - JWT expiration time

### Frontend
- `REACT_APP_API_URL` - Backend API URL

## 📦 Main Dependencies

### Backend
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication
- `cors` - CORS middleware
- `dotenv` - Environment variables

### Frontend
- `react` - UI library
- `react-router-dom` - Routing
- `axios` - HTTP client
- `tailwindcss` - CSS framework
- `lucide-react` - Icons

## 🐛 Troubleshooting

### Backend won't start
- Check if MongoDB URI is correct in `.env`
- Ensure port 5000 is not in use
- Run `npm install` to ensure all dependencies are installed

### Frontend won't start
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check if Backend is running on port 5000
- Ensure REACT_APP_API_URL is correctly set in `.env`

### Cannot login
- Check Backend console for errors
- Verify user exists in database
- Clear browser localStorage and try again

### CORS errors
- Ensure Backend CORS is configured to allow Frontend origin
- Check if API URL in Frontend `.env` is correct

## 👥 Team

**Group 11 - CN Web 2025.1**
- Member 1: Nguyen Thanh Tan
- Member 2: Nguyen Duc Tin
- Member 3: Phan Van Nghi
- Member 4: Nguyen Trong Giap
- Member 5: Nguyen Khac Diep
- Member 6: Tran Quoc Duy
  

## 📝 License

This project is created for educational purposes as part of the CN Web course.

## 🔄 Git Workflow

```bash
# Pull latest changes
git pull origin main

# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "Description of changes"

# Push to repository
git push origin feature/your-feature-name
```

## 📧 Contact

For questions or issues, please contact the development team or create an issue in the GitHub repository.

---

**Happy Coding! 🚀**
