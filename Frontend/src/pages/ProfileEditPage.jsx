import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { authService } from '../services/authService';

export default function ProfileEditPage() {
  const { user, loading: authLoading, updateUser } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formUsername, setFormUsername] = useState('');
  const [formAvatar, setFormAvatar] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await authService.getProfile();
        const fetched = res.data.user;
        setProfile(fetched);
        setFormUsername(fetched.username || '');
        setFormAvatar(fetched.avatar || '');
      } catch (err) {
        setError(err.message || 'Không tải được hồ sơ');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    if (!user) {
      setError('Bạn cần đăng nhập để chỉnh sửa hồ sơ');
      setLoading(false);
      return;
    }

    fetchProfile();
  }, [user, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      const res = await authService.updateProfile({
        username: formUsername,
        avatar: formAvatar
      });
      const updated = res.data.user;
      setProfile(updated);
      updateUser({
        id: updated._id || updated.id,
        username: updated.username,
        email: updated.email,
        role: updated.role,
        avatar: updated.avatar
      });
      setSuccess('Cập nhật hồ sơ thành công');
    } catch (err) {
      setError(err.message || 'Cập nhật thất bại');
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return <div className="p-6">Đang tải...</div>;
  }

  if (error && !profile) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center gap-4 mb-6 flex-wrap">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            <span className="text-lg leading-none">←</span>
            Quay lại
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Chỉnh sửa hồ sơ</h1>
        </div>

        {error && (
          <div className="mb-3 text-red-600">{error}</div>
        )}
        {success && (
          <div className="mb-3 text-green-600">{success}</div>
        )}

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              value={formUsername}
              onChange={(e) => setFormUsername(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-gray-900"
              minLength={3}
              maxLength={30}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Avatar URL</label>
            <input
              type="url"
              value={formAvatar}
              onChange={(e) => setFormAvatar(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-gray-900"
              placeholder="https://..."
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
            <button
              type="button"
              onClick={() => {
                setFormUsername(profile.username || '');
                setFormAvatar(profile.avatar || '');
                setError('');
                setSuccess('');
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Khôi phục
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

