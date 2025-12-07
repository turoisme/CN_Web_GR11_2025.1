import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Home, Film, Users, Settings, ChevronDown, Bell, Search, LogOut } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import UserManagement from '../components/admin/UserManagement';
import MovieManagement from '../components/admin/MovieManagement';
import Dashboard from '../components/admin/Dashboard';

export default function AdminDashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState('dashboard');

  useEffect(() => {
    // Check if user is admin
    if (!user || user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };


  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-24 bg-gray-200 flex flex-col items-center py-8 gap-8">
        <button 
          onClick={() => setCurrentView('dashboard')}
          className={`w-12 h-12 rounded-lg flex items-center justify-center transition ${
            currentView === 'dashboard' 
              ? 'bg-gray-800 text-white' 
              : 'text-gray-700 hover:bg-gray-300'
          }`}
          title="Dashboard"
        >
          <Home size={24} />
        </button>
        <button 
          onClick={() => setCurrentView('movies')}
          className={`w-12 h-12 rounded-lg flex items-center justify-center transition ${
            currentView === 'movies' 
              ? 'bg-gray-800 text-white' 
              : 'text-gray-700 hover:bg-gray-300'
          }`}
          title="Movies"
        >
          <Film size={24} />
        </button>
        <button 
          onClick={() => setCurrentView('users')}
          className={`w-12 h-12 rounded-lg flex items-center justify-center transition ${
            currentView === 'users' 
              ? 'bg-gray-800 text-white' 
              : 'text-gray-700 hover:bg-gray-300'
          }`}
          title="Users"
        >
          <Users size={24} />
        </button>
        <button className="w-12 h-12 text-gray-700 hover:bg-gray-300 rounded-lg flex items-center justify-center transition" title="Settings">
          <Settings size={24} />
        </button>
        
        <div className="flex-1"></div>
        
        <button 
          onClick={handleLogout}
          className="w-12 h-12 text-gray-700 hover:bg-red-100 hover:text-red-600 rounded-lg flex items-center justify-center transition"
          title="Logout"
        >
          <LogOut size={24} />
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center">
                <img 
                  src="/logo/logo.png" 
                  alt="FilmRate Logo" 
                  className="h-12 object-contain cursor-pointer hover:opacity-80 transition"
                />
              </Link>

              <button className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition ml-8">
                <span className="font-semibold">Dashboard</span>
                <ChevronDown size={18} />
              </button>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 bg-gray-100 px-4 py-2 rounded-lg">
                <select className="bg-transparent outline-none text-sm font-medium">
                  <option>All</option>
                </select>
                <Search size={18} className="text-gray-500" />
                <input 
                  type="text" 
                  placeholder="Search for..." 
                  className="bg-transparent outline-none text-sm w-64"
                />
              </div>
              
              <Bell size={22} className="text-gray-700 cursor-pointer" />
              <Settings size={22} className="text-gray-700 cursor-pointer" />
              
              <div className="flex items-center gap-2">
                <span className="font-semibold">{user.username}</span>
                <div className="w-10 h-10 bg-gray-800 text-white rounded-full flex items-center justify-center">
                  <span className="font-bold">{user.username.charAt(0).toUpperCase()}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-8">
          {currentView === 'dashboard' && <Dashboard user={user} setCurrentView={setCurrentView} />}
          {currentView === 'users' && <UserManagement />}
          {currentView === 'movies' && <MovieManagement />}
        </main>
      </div>
    </div>
  );
}