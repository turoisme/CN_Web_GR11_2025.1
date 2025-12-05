import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/AdminPage';
import MovieDetailPage from './pages/MovieDetailPage';
import MovieReviewPage from './pages/MovieReviewPage';
import WishlistPage from './pages/WishlistPage';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="app">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/movie/:id" element={<MovieDetailPage />} />
              <Route path="/movie/:id/reviews" element={<MovieReviewPage />} />
              <Route path="/admin/*" element={<AdminPage />} />
              <Route path="*" element={<HomePage />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;