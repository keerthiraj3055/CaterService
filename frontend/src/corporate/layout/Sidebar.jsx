import React from 'react';
import { NavLink } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EventIcon from '@mui/icons-material/Event';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import ChatIcon from '@mui/icons-material/Chat';
import PersonIcon from '@mui/icons-material/Person';

const navItems = [
  { to: '/corporate', label: 'Dashboard', icon: <DashboardIcon fontSize="small" /> },
  { to: '/corporate/bookings', label: 'Bookings', icon: <EventIcon fontSize="small" /> },
  { to: '/corporate/meal-plans', label: 'Meal Plans', icon: <RestaurantMenuIcon fontSize="small" /> },
  { to: '/corporate/invoices', label: 'Invoices', icon: <ReceiptIcon fontSize="small" /> },
  { to: '/corporate/analytics', label: 'Analytics', icon: <AnalyticsIcon fontSize="small" /> },
  { to: '/corporate/chat', label: 'Chat', icon: <ChatIcon fontSize="small" /> },
  { to: '/corporate/profile', label: 'Profile', icon: <PersonIcon fontSize="small" /> },
];

const Sidebar = ({ open, onClose }) => {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={`
          fixed md:static
          bg-[#0F172A]
          w-64
          h-[calc(100vh-64px)]
          top-16
          z-50
          transition-transform duration-300
          ${open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          shadow-lg md:shadow-none
        `}
      >
        <nav className="p-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => onClose()}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg mb-2 text-sm font-medium transition-all duration-200 hover:bg-[#3B82F6]/20 hover:text-[#3B82F6] ${
                  isActive
                    ? 'bg-[#3B82F6] text-white shadow-md'
                    : 'text-gray-300'
                }`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;











