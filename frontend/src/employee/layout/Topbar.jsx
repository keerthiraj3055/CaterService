import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { AuthContext } from '../../context/AuthContext';

const Topbar = ({ onMenuToggle }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 py-4 md:px-6">
        {/* Left: Menu button */}
        <button
          onClick={onMenuToggle}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <MenuIcon className="text-[#1E293B]" />
        </button>

        {/* Center: Title */}
        <div className="flex-1 md:flex-none">
          <h1 className="text-xl font-semibold text-[#1E293B] font-['Inter',sans-serif]">
            Employee Dashboard
          </h1>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <NotificationsNoneIcon className="text-[#1E293B]" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Settings */}
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <SettingsIcon className="text-[#1E293B]" />
          </button>

          {/* User name and logout */}
          <div className="flex items-center gap-3 border-l pl-3">
            <span className="hidden md:block text-sm font-medium text-[#1E293B]">
              {user?.name || 'Employee'}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors text-sm font-medium"
            >
              <LogoutIcon fontSize="small" />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;


