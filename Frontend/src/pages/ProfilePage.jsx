import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { authService } from '../services/authService';

export default function ProfilePage() {
  const { user, loading: authLoading, logout } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await authService.getProfile(); // { success, data: { user } }
        setProfile(res.data.user);
      } catch (err) {
        setError(err.message || 'Không tải được hồ sơ');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    if (!user) {
      setError('Bạn cần đăng nhập để xem hồ sơ');
      setLoading(false);
      return;
    }

    fetchProfile();
  }, [user, navigate]);

  const createdDate = useMemo(() => {
    if (!profile?.createdAt) return '';
    return new Date(profile.createdAt).toLocaleDateString();
  }, [profile]);

  if (authLoading || loading) {
    return <div className="p-6">Đang tải...</div>;
  }

  if (error && !profile) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center gap-4 mb-6">
          {profile.avatar ? (
            <img
              src={profile.avatar}
              alt="Avatar"
              className="h-16 w-16 rounded-full object-cover border border-gray-200"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          ) : (
            <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-semibold text-gray-700">
              {profile.username?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Hồ sơ cá nhân</h1>
            <p className="text-gray-600">Thông tin tài khoản của bạn</p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <ProfileRow label="Username" value={profile.username} />
          <ProfileRow label="Email" value={profile.email} />
          <ProfileRow label="Role" value={profile.role} />
          {createdDate && <ProfileRow label="Ngày tạo" value={createdDate} />}
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-gray-200 pt-6">
          <button
            onClick={() => navigate('/profile/edit')}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
          >
            Chỉnh sửa hồ sơ
          </button>
          <button
            onClick={() => navigate('/profile/change-password')}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Đổi mật khẩu
          </button>
          <button
            onClick={() => logout()}
            className="ml-auto text-red-600 hover:text-red-700 font-semibold"
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
}

function ProfileRow({ label, value }) {
  return (
    <div className="flex items-center justify-between border border-gray-200 rounded-lg p-4">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium text-gray-900 break-words text-right ml-4">{value}</span>
    </div>
  );
}

