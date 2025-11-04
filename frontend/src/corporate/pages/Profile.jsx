import React, { useState, useContext, useRef, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import SaveIcon from '@mui/icons-material/Save';
import BusinessIcon from '@mui/icons-material/Business';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import axiosInstance from '../../api/axiosInstance';
import Toast from '../../components/Toast';

const Profile = () => {
  const { user, login } = useContext(AuthContext);
  const fileInputRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState(null);
  const [profile, setProfile] = useState({
    companyName: '',
    email: '',
    phone: '',
    address: '',
    gstNumber: '',
    logo: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (user) {
      setProfile({
        companyName: user.companyName || user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        gstNumber: user.gstNumber || '',
        logo: user.logo || user.avatar || '',
      });
    }
  }, [user]);

  const handleLogoClick = () => {
    fileInputRef.current?.click();
  };

  const handleLogoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setToast({ message: 'Please select an image file', type: 'error' });
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('logo', file);

      const response = await axiosInstance.patch('/corporate/profile/logo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setProfile({ ...profile, logo: response.data.logo });
      setToast({ message: 'Company logo updated successfully', type: 'success' });
    } catch (error) {
      console.error('Error uploading logo:', error);
      setToast({ message: 'Failed to upload logo', type: 'error' });
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const response = await axiosInstance.patch('/corporate/profile', profile);
      if (login) {
        const currentToken = localStorage.getItem('token');
        login({ token: currentToken, user: response.data });
      }
      setIsEditing(false);
      setToast({ message: 'Profile updated successfully', type: 'success' });
    } catch (error) {
      console.error('Error updating profile:', error);
      setToast({ message: 'Failed to update profile', type: 'error' });
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword.length < 6) {
      setToast({ message: 'New password must be at least 6 characters', type: 'error' });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setToast({ message: 'Passwords do not match', type: 'error' });
      return;
    }

    try {
      await axiosInstance.patch('/corporate/profile/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setIsChangingPassword(false);
      setToast({ message: 'Password changed successfully', type: 'success' });
    } catch (error) {
      console.error('Error changing password:', error);
      setToast({ message: error.response?.data?.message || 'Failed to change password', type: 'error' });
    }
  };

  return (
      <div className="space-y-6">
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#0F172A] mb-2">Corporate Profile</h1>
          <p className="text-gray-600">Manage your company information</p>
        </div>
        {isEditing && (
          <button
            onClick={handleSaveProfile}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            <SaveIcon fontSize="small" />
            Save Changes
          </button>
        )}
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        {/* Logo Section */}
        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-200">
          <div className="relative">
            {profile.logo ? (
              <img
                src={profile.logo}
                alt="Company Logo"
                className="w-32 h-32 rounded-lg object-cover border-4 border-white shadow-lg"
              />
            ) : (
              <div className="w-32 h-32 rounded-lg bg-[#3B82F6] flex items-center justify-center text-white text-4xl font-bold border-4 border-white shadow-lg">
                <BusinessIcon fontSize="large" />
              </div>
            )}
            <button
              onClick={handleLogoClick}
              disabled={uploading}
              className="absolute bottom-0 right-0 p-2 bg-[#3B82F6] text-white rounded-full shadow-lg hover:bg-[#2563EB] transition-colors disabled:opacity-50"
            >
              {uploading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <CameraAltIcon fontSize="small" />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="hidden"
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#0F172A] mb-1">
              {profile.companyName || 'Company Name'}
            </h2>
            <p className="text-gray-600">Corporate Account</p>
          </div>
        </div>

        {/* Profile Information */}
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <BusinessIcon className="text-[#3B82F6] mt-3" />
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.companyName}
                  onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                />
              ) : (
                <p className="text-lg text-[#0F172A] py-2">{profile.companyName || 'N/A'}</p>
              )}
            </div>
          </div>

          <div className="flex items-start gap-4">
            <EmailIcon className="text-[#3B82F6] mt-3" />
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                />
              ) : (
                <p className="text-lg text-[#0F172A] py-2">{profile.email || 'N/A'}</p>
              )}
            </div>
          </div>

          <div className="flex items-start gap-4">
            <PhoneIcon className="text-[#3B82F6] mt-3" />
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                />
              ) : (
                <p className="text-lg text-[#0F172A] py-2">{profile.phone || 'N/A'}</p>
              )}
            </div>
          </div>

          <div className="flex items-start gap-4">
            <LocationOnIcon className="text-[#3B82F6] mt-3" />
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              {isEditing ? (
                <textarea
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                  rows="3"
                />
              ) : (
                <p className="text-lg text-[#0F172A] py-2">{profile.address || 'N/A'}</p>
              )}
            </div>
          </div>

          <div className="flex items-start gap-4">
            <BusinessIcon className="text-[#3B82F6] mt-3" />
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">GST Number</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.gstNumber}
                  onChange={(e) => setProfile({ ...profile, gstNumber: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                />
              ) : (
                <p className="text-lg text-[#0F172A] py-2">{profile.gstNumber || 'N/A'}</p>
              )}
            </div>
          </div>
        </div>

        {!isEditing && (
          <div className="pt-4 border-t border-gray-200 mt-6">
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-2 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-colors font-medium"
            >
              Edit Profile
            </button>
          </div>
        )}

        {isEditing && (
          <div className="pt-4 border-t border-gray-200 mt-6 flex gap-3">
            <button
              onClick={() => {
                setIsEditing(false);
                if (user) {
                  setProfile({
                    companyName: user.companyName || user.name || '',
                    email: user.email || '',
                    phone: user.phone || '',
                    address: user.address || '',
                    gstNumber: user.gstNumber || '',
                    logo: user.logo || user.avatar || '',
                  });
                }
              }}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Change Password Card */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <LockIcon className="text-[#3B82F6]" />
            <h3 className="text-lg font-semibold text-[#0F172A]">Change Password</h3>
          </div>
          {!isChangingPassword && (
            <button
              onClick={() => setIsChangingPassword(true)}
              className="px-4 py-2 text-[#3B82F6] border border-[#3B82F6] rounded-lg hover:bg-[#3B82F6] hover:text-white transition-colors font-medium"
            >
              Change Password
            </button>
          )}
        </div>

        {isChangingPassword && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, currentPassword: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6] pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showCurrentPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, newPassword: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6] pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6] pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleChangePassword}
                className="px-6 py-2 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-colors font-medium"
              >
                Save New Password
              </button>
              <button
                onClick={() => {
                  setIsChangingPassword(false);
                  setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                  });
                }}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
      </div>
  );
};

export default Profile;











