import React, { useState, useEffect } from 'react';
import { MessageCircle, User, Activity, TrendingUp, MoreVertical, Film } from 'lucide-react';
import { adminService } from '../../services/adminService';

export default function Dashboard({ user, setCurrentView }) {
  const [timeFilter, setTimeFilter] = useState('This week');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [topMovies, setTopMovies] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const statsData = await adminService.getDashboardStats();

        if (statsData && statsData.data) {
          const { stats: statsInfo, chartData, recentUsers, topRatedMovies } = statsData.data;

          console.log('Top rated movies received:', topRatedMovies);
          console.log('Top rated movies type:', typeof topRatedMovies);
          console.log('Top rated movies is array:', Array.isArray(topRatedMovies));
          console.log('Top rated movies length:', topRatedMovies ? topRatedMovies.length : 0);

          setStats(statsInfo || null);
          setChartData(Array.isArray(chartData) ? chartData : []);
          setUsers(Array.isArray(recentUsers) ? recentUsers : []);
          setTopMovies(Array.isArray(topRatedMovies) ? topRatedMovies : []);
        } else {
          console.warn('No data received from API');
          setStats(null);
          setChartData([]);
          setUsers([]);
          setTopMovies([]);
        }
      } catch (error) {
        console.error('Error fetching admin data:', error);
        setStats(null);
        setChartData([]);
        setUsers([]);
        setTopMovies([]);
      } finally {
        setLoading(false);
      }
    };

    if (user && user.role === 'admin') {
      fetchData();
    }
  }, [user]);

  const statsData = stats ? [
    { value: stats.totalRatings || '0', label: 'New Ratings', icon: MessageCircle, iconBg: 'bg-gray-200' },
    { value: stats.totalUsers || '0', label: 'Active users', icon: User, iconBg: 'bg-gray-200' },
    { value: stats.totalReviews ? (stats.totalReviews / (stats.totalUsers || 1)).toFixed(3) : '0.000', label: 'Retention rate', icon: Activity, iconBg: 'bg-gray-200' },
    { value: stats.totalMovies || '0', label: 'Most trending film', icon: TrendingUp, iconBg: 'bg-gray-200' },
  ] : [
    { value: '0', label: 'New Ratings', icon: MessageCircle, iconBg: 'bg-gray-200' },
    { value: '0', label: 'Active users', icon: User, iconBg: 'bg-gray-200' },
    { value: '0.000', label: 'Retention rate', icon: Activity, iconBg: 'bg-gray-200' },
    { value: '0', label: 'Most trending film', icon: TrendingUp, iconBg: 'bg-gray-200' },
  ];

  const activeUsers = stats?.totalUsers || 0;
  const newUsers = stats?.newUsers || 0;
  const oldUsers = stats?.oldUsers || 0;
  const piePercentage = activeUsers > 0 ? (newUsers / activeUsers) * 100 : 0;
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (piePercentage / 100) * circumference;

  const rawMaxValue = chartData.length > 0 
    ? Math.max(...chartData.map(d => Number(d.value) || 0), 1) 
    : 1;
  
  const roundUpToNiceNumber = (num) => {
    if (num <= 0) return 1;
    if (num <= 10) return 10;
    if (num <= 20) return 20;
    if (num <= 50) return 50;
    if (num <= 100) return 100;
    if (num <= 200) return 200;
    if (num <= 500) return 500;
    if (num <= 1000) return 1000;
    return Math.ceil(num / 100) * 100;
  };
  
  const maxValue = roundUpToNiceNumber(rawMaxValue);
  
  const formatYAxisLabel = (value) => {
    if (value === 0) return '0';
    if (maxValue >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
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

  return (
    <>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {statsData.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-4xl font-bold text-gray-900">{stat.value}</h3>
              <div className={`w-12 h-12 ${stat.iconBg} rounded-full flex items-center justify-center`}>
                <stat.icon size={24} className="text-gray-700" />
              </div>
            </div>
            <p className="text-gray-600 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-8 mb-12">
        <div className="bg-white p-8 rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Active user</h2>
          <div className="flex items-center justify-center gap-16">
            <div className="relative w-64 h-64">
              <svg viewBox="0 0 100 100" className="transform -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#60a5fa" strokeWidth="20" />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  fill="none" 
                  stroke="#2563eb" 
                  strokeWidth="20"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-xl font-bold">{newUsers} ({Math.round(piePercentage)}%)</div>
                <div className="text-lg font-bold mt-2">{oldUsers} ({Math.round(100 - piePercentage)}%)</div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-blue-400 rounded-full"></div>
                <span className="font-medium">New user</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                <span className="font-medium">Old user</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">New ratings</h2>
          <div className="h-80 relative">
            <div className="flex h-full pb-16">
              <div className="flex-shrink-0 w-12 flex flex-col justify-between text-xs text-gray-500 pr-2">
                <span>{formatYAxisLabel(maxValue)}</span>
                <span>{formatYAxisLabel(maxValue * 0.8)}</span>
                <span>{formatYAxisLabel(maxValue * 0.6)}</span>
                <span>{formatYAxisLabel(maxValue * 0.4)}</span>
                <span>{formatYAxisLabel(maxValue * 0.2)}</span>
                <span>{formatYAxisLabel(0)}</span>
              </div>
              <div className="flex-1 overflow-x-auto">
                <div className="h-full flex items-end gap-1.5" style={{ minWidth: `${Math.max(chartData.length * 40, 600)}px` }}>
              {loading ? (
                <div className="w-full text-center text-gray-500 py-8">Loading chart data...</div>
              ) : chartData.length > 0 ? (
                chartData.map((item, index) => {
                  const value = Number(item.value) || 0;
                  const heightPercent = maxValue > 0 ? (value / maxValue) * 100 : 0;
                  
                  return (
                    <div key={index} className="flex flex-col items-center justify-end h-full" style={{ minWidth: '36px', flex: '0 0 auto' }}>
                      <div 
                        className={`rounded-t transition-all ${
                          value > 0 
                            ? 'bg-green-500 hover:bg-green-600' 
                            : 'bg-gray-200 border border-gray-300'
                        }`}
                        style={{ 
                          height: value > 0 ? `${heightPercent}%` : '2px',
                          minHeight: value > 0 ? '4px' : '2px',
                          width: '32px'
                        }}
                        title={`${value} ratings on ${item.date}`}
                      ></div>
                    </div>
                  );
                })
              ) : (
                <div className="w-full text-center text-gray-500 py-8">
                  No rating data available. Ratings will appear here once users start rating movies.
                </div>
              )}
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 left-12 right-0 overflow-x-auto">
              <div className="flex gap-1.5" style={{ minWidth: `${Math.max(chartData.length * 40, 600)}px`, height: '60px', paddingTop: '20px' }}>
              {chartData.length > 0 && chartData.map((item, index) => (
                <div key={index} className="flex items-start justify-center" style={{ minWidth: '36px', flex: '0 0 auto' }}>
                  <span className="text-xs text-gray-600 whitespace-nowrap transform -rotate-45 origin-left">
                    {item.date}
                  </span>
                </div>
              ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">User list</h2>
            <button 
              onClick={() => setCurrentView('users')}
              className="text-sm font-semibold text-gray-700 hover:text-gray-900"
            >
              See all
            </button>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2 font-semibold text-sm text-gray-700">User Name</th>
                <th className="text-left py-3 px-2 font-semibold text-sm text-gray-700">Email</th>
                <th className="text-left py-3 px-2 font-semibold text-sm text-gray-700">Rating counts</th>
                <th className="text-left py-3 px-2 font-semibold text-sm text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center py-8 text-gray-500">
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-8 text-gray-500">
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
                    <td className="py-4 px-2 text-gray-900 font-medium">100</td>
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

        <div className="bg-white p-8 rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Top trending films</h2>
          <div className="flex gap-6 items-start">
            {loading ? (
              <div className="w-full text-center py-8 text-gray-500">Loading movies...</div>
            ) : topMovies && topMovies.length > 0 ? (
              topMovies.slice(0, 3).map((movie) => {
                console.log('Rendering movie:', movie);
                if (!movie || !movie._id) {
                  console.warn('Invalid movie data:', movie);
                  return null;
                }
                const posterUrl = movie.posterUrl || movie.poster_url || null;
                return (
                  <div key={movie._id} className="flex-1 flex flex-col min-w-0">
                    <div className="bg-gray-200 rounded-lg overflow-hidden mb-2 w-full" style={{ aspectRatio: '3/4', maxHeight: '400px' }}>
                      {posterUrl ? (
                        <img 
                          src={posterUrl} 
                          alt={movie.title || 'Movie poster'}
                          className="w-full h-full object-cover object-center"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            const parent = e.target.parentElement;
                            if (!parent.querySelector('.error-placeholder')) {
                              const placeholder = document.createElement('div');
                              placeholder.className = 'w-full h-full flex flex-col items-center justify-center text-gray-400 error-placeholder';
                              placeholder.innerHTML = `
                                <svg width="60" height="60" viewBox="0 0 100 100" class="mb-2">
                                  <line x1="25" y1="25" x2="75" y2="75" stroke="currentColor" stroke-width="6" />
                                  <line x1="75" y1="25" x2="25" y2="75" stroke="currentColor" stroke-width="6" />
                                </svg>
                                <span class="text-xs text-center px-2">${movie.title || 'No image'}</span>
                              `;
                              parent.appendChild(placeholder);
                            }
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                          <svg width="60" height="60" viewBox="0 0 100 100" className="mb-2">
                            <line x1="25" y1="25" x2="75" y2="75" stroke="currentColor" strokeWidth="6" />
                            <line x1="75" y1="25" x2="25" y2="75" stroke="currentColor" strokeWidth="6" />
                          </svg>
                          <span className="text-xs text-center px-2">{movie.title || 'No image'}</span>
                        </div>
                      )}
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-gray-900 truncate">{movie.title || 'Untitled'}</p>
                      {movie.averageRating > 0 && (
                        <p className="text-xs text-gray-600 mt-1">
                          ⭐ {movie.averageRating.toFixed(1)} ({movie.totalRatings || 0} ratings)
                        </p>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="w-full text-center py-8 text-gray-500">
                {topMovies && topMovies.length === 0 ? 'No movies found' : 'No trending movies available'}
                <div className="text-xs mt-2">Check console for debug info</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

