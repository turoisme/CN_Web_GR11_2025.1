import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Home, Film, Users, Settings, ChevronDown, Bell, Search, MessageCircle, User, Activity, TrendingUp, MoreVertical, LogOut } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { adminService } from '../services/adminService';

export default function AdminDashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [timeFilter, setTimeFilter] = useState('This week');
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [usersData, statsData] = await Promise.all([
          adminService.getAllUsers(),
          adminService.getDashboardStats()
        ]);
        
        // Backend returns { success, data: { users } }
        setUsers(usersData.data?.users || []);
        setStats(statsData.data || null);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user && user.role === 'admin') {
      fetchData();
    }
  }, [user]);

  const statsData = stats ? [
    { value: stats.totalReviews || '0', label: 'New Ratings', icon: MessageCircle, iconBg: 'bg-gray-200' },
    { value: stats.totalUsers || '0', label: 'Active users', icon: User, iconBg: 'bg-gray-200' },
    { value: stats.averageRating?.toFixed(3) || '0.000', label: 'Average Rating', icon: Activity, iconBg: 'bg-gray-200' },
    { value: stats.totalMovies || '0', label: 'Total Movies', icon: TrendingUp, iconBg: 'bg-gray-200' },
  ] : [
    { value: '0', label: 'New Ratings', icon: MessageCircle, iconBg: 'bg-gray-200' },
    { value: '0', label: 'Active users', icon: User, iconBg: 'bg-gray-200' },
    { value: '0.000', label: 'Average Rating', icon: Activity, iconBg: 'bg-gray-200' },
    { value: '0', label: 'Total Movies', icon: TrendingUp, iconBg: 'bg-gray-200' },
  ];

  const chartData = [
    { date: 'Jul 01', value: 7500 },
    { date: 'Jul 02', value: 7200 },
    { date: 'Jul 03', value: 4000 },
    { date: 'Jul 04', value: 8500 },
    { date: 'Jul 05', value: 5500 },
    { date: 'Jul 06', value: 8000 },
    { date: 'Jul 07', value: 1200 },
    { date: 'Jul 08', value: 4500 },
    { date: 'Jul 09', value: 2800 },
    { date: 'Jul 10', value: 5800 },
    { date: 'Jul 11', value: 8200 },
    { date: 'Jul 12', value: 3500 },
  ];

  const maxValue = Math.max(...chartData.map(d => d.value));

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

  const getCurrentDate = () => {
    const date = new Date();
    const options = { year: 'numeric', month: 'short', day: '2-digit', weekday: 'long' };
    return date.toLocaleDateString('en-US', options);
  };

  const getCurrentTime = () => {
    const date = new Date();
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-24 bg-gray-200 flex flex-col items-center py-8 gap-8">
        <button className="w-12 h-12 bg-gray-800 text-white rounded-lg flex items-center justify-center hover:bg-gray-700 transition">
          <Home size={24} />
        </button>
        <button className="w-12 h-12 text-gray-700 hover:bg-gray-300 rounded-lg flex items-center justify-center transition">
          <Film size={24} />
        </button>
        <button className="w-12 h-12 text-gray-700 hover:bg-gray-300 rounded-lg flex items-center justify-center transition">
          <Users size={24} />
        </button>
        <button className="w-12 h-12 text-gray-700 hover:bg-gray-300 rounded-lg flex items-center justify-center transition">
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

        {/* Dashboard Content */}
        <main className="p-8">
          {/* Welcome Section */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Hello, {user.username}!</h1>
              <p className="text-gray-600">{getCurrentDate()} | {getCurrentTime()}</p>
            </div>
            <select 
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="px-6 py-2.5 border-2 border-gray-300 rounded-lg font-medium outline-none cursor-pointer"
            >
              <option>This week</option>
              <option>This month</option>
              <option>This year</option>
            </select>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-6 mb-12">
            {statsData.map((stat, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-4xl font-bold text-gray-900">{stat.value}</h3>
                  <div className={`w-12 h-12 ${stat.iconBg} rounded-full flex items-center justify-center`}>
                    <stat.icon size={24} className="text-gray-700" />
                  </div>
                </div>
                <p className="text-gray-700 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-2 gap-8 mb-12">
            {/* Pie Chart */}
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Active user</h2>
              <div className="flex items-center justify-center gap-16">
                <div className="relative w-64 h-64">
                  <svg viewBox="0 0 100 100" className="transform -rotate-90">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#94a3b8" strokeWidth="20" />
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="40" 
                      fill="none" 
                      stroke="#64748b" 
                      strokeWidth="20"
                      strokeDasharray="251.2"
                      strokeDashoffset="62.8"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-xl font-bold">1223 (45%)</div>
                    <div className="text-lg font-bold mt-2">1523 (55%)</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                    <span className="font-medium">New user</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-gray-600 rounded-full"></div>
                    <span className="font-medium">Old user</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">New ratings</h2>
              <div className="relative h-80">
                <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-gray-500">
                  <span>9K</span>
                  <span>8K</span>
                  <span>7K</span>
                  <span>6K</span>
                  <span>5K</span>
                  <span>4K</span>
                  <span>3K</span>
                  <span>2K</span>
                  <span>1K</span>
                  <span>0</span>
                </div>
                <div className="ml-12 h-full flex items-end justify-between gap-2">
                  {chartData.map((item, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2">
                      <div 
                        className="w-full bg-gray-400 rounded-t transition-all hover:bg-gray-500"
                        style={{ height: `${(item.value / maxValue) * 100}%` }}
                      ></div>
                      <span className="text-xs text-gray-600 whitespace-nowrap">{item.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-2 gap-8">
            {/* User List */}
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">User list</h2>
                <button className="text-sm font-semibold text-gray-700 hover:text-gray-900">See all</button>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2 font-semibold text-sm text-gray-700">User Name</th>
                    <th className="text-left py-3 px-2 font-semibold text-sm text-gray-700">Email</th>
                    <th className="text-left py-3 px-2 font-semibold text-sm text-gray-700">Rating counts</th>
                    <th className="text-left py-3 px-2 font-semibold text-sm text-gray-700">Most helpful review</th>
                    <th className="text-left py-3 px-2 font-semibold text-sm text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="text-center py-8 text-gray-500">
                        Loading users...
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-8 text-gray-500">
                        No users found
                      </td>
                    </tr>
                  ) : (
                    users.slice(0, 5).map((userData) => (
                      <tr key={userData._id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-2">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-800 text-white rounded-full flex items-center justify-center">
                              <span className="text-sm font-bold">{userData.username.charAt(0).toUpperCase()}</span>
                            </div>
                            <div>
                              <span className="font-medium">{userData.username}</span>
                              {userData.role === 'admin' && (
                                <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Admin</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-2 text-gray-600">{userData.email}</td>
                        <td className="py-4 px-2 text-gray-900 font-medium">{userData.reviewCount || 0}</td>
                        <td className="py-4 px-2 text-gray-900 font-medium">{userData.helpfulReviews || 0}</td>
                        <td className="py-4 px-2">
                          <button className="text-gray-600 hover:text-gray-900">
                            <MoreVertical size={20} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Top Trending Films */}
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Top trending films</h2>
              <div className="flex gap-6">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex-1 aspect-[3/4] bg-gray-200 rounded-lg flex items-center justify-center">
                    <div className="text-gray-400">
                      <svg width="100" height="100" viewBox="0 0 100 100">
                        <line x1="25" y1="25" x2="75" y2="75" stroke="currentColor" strokeWidth="8" />
                        <line x1="75" y1="25" x2="25" y2="75" stroke="currentColor" strokeWidth="8" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}