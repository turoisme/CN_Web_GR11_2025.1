import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { authService } from '../services/authService';

export default function ChangePasswordPage() {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu mới và xác nhận không khớp');
      return;
    }
    try {
      setSaving(true);
      await authService.changePassword(currentPassword, newPassword);
      setSuccess('Đổi mật khẩu thành công');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message || 'Đổi mật khẩu thất bại');
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) {
    return <div className="p-6">Đang tải...</div>;
  }

  if (!user) {
    return <div className="p-6 text-red-600">Bạn cần đăng nhập để đổi mật khẩu</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white shadow rounded-lg p-6 space-y-4">
        <div className="flex items-center gap-4 flex-wrap">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            <span className="text-lg leading-none">←</span>
            Quay lại
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Đổi mật khẩu</h1>
        </div>

        <p className="text-sm text-gray-600">Mật khẩu mới tối thiểu 6 ký tự, nên có hoa/thường/số.</p>

        {error && <div className="text-red-600">{error}</div>}
        {success && <div className="text-green-600">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu hiện tại</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-gray-900"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-gray-900"
              minLength={6}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu mới</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-gray-900"
              minLength={6}
              required
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Đang lưu...' : 'Đổi mật khẩu'}
            </button>
            <button
              type="button"
              onClick={() => {
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setError('');
                setSuccess('');
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Nhập lại
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

