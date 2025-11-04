import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Dashboard,
  Restaurant,
  EventNote,
  People,
  Assessment,
  RateReview,
  LocalOffer,
  Settings,
  ExitToApp,
  ListAlt,
  HomeRepairService,
  AccountCircle
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/admin/dashboard' },
    { text: 'Menu', icon: <Restaurant />, path: '/admin/menu' },
    { text: 'Services', icon: <HomeRepairService />, path: '/admin/services' },
    { text: 'Orders', icon: <ListAlt />, path: '/admin/orders' },
    { text: 'Bookings', icon: <EventNote />, path: '/admin/bookings' },
    { text: 'Users', icon: <People />, path: '/admin/accounts' },
    { text: 'Reports', icon: <Assessment />, path: '/admin/reports' },
    { text: 'Reviews', icon: <RateReview />, path: '/admin/reviews' },
  ];
  { to: '/admin/reports', label: 'Reports', icon: <AssessmentIcon fontSize="small" /> },
  { to: '/admin/reviews', label: 'Reviews', icon: <ReviewsIcon fontSize="small" /> },
];

const Sidebar = ({ open, onClose }) => {
  return (
    <aside className={`bg-[#1E293B] text-white w-64 h-[calc(100vh-64px)] sticky top-16 hidden md:block`}>
      <nav className="p-3">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg mb-1 text-sm hover:bg-white/10 ${isActive ? 'bg-white/10' : ''}`
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;




