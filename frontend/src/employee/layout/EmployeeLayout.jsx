import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Event as BookingsIcon,
  Assignment as EventDetailsIcon,
  Chat as ChatIcon,
  AccountBalance as PayrollIcon,
  Person as ProfileIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Work as WorkIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useTheme as useCustomTheme } from '../../context/ThemeContext';
import { useContext } from 'react';

const EmployeeLayout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);
  const { isDarkMode, toggleDarkMode } = useCustomTheme();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/employee' },
    { text: 'Bookings', icon: <BookingsIcon />, path: '/employee/bookings' },
    { text: 'Event Details', icon: <EventDetailsIcon />, path: '/employee/event-details' },
    { text: 'Chat', icon: <ChatIcon />, path: '/employee/chat' },
    { text: 'Payroll', icon: <PayrollIcon />, path: '/employee/payroll' },
    { text: 'Profile', icon: <ProfileIcon />, path: '/employee/profile' },
  ];

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh', 
      backgroundColor: '#FFFFFF',
      overflow: 'hidden'
    }}>
      {/* Top Header */}
      <AppBar
        position="static"
        elevation={0}
        sx={{
          backgroundColor: '#FFFFFF',
          color: '#000000',
          borderBottom: '1px solid #E5E7EB',
          height: '80px',
        }}
      >
        <Toolbar sx={{ height: '80px', justifyContent: 'space-between' }}>
          {/* Left Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ 
                display: { md: 'none' },
                color: '#000000',
                mr: 2
              }}
            >
              <MenuIcon />
            </IconButton>
            
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 'bold', 
                color: '#000000',
                fontSize: '28px',
                letterSpacing: '-0.5px'
              }}
            >
              Employee Portal
            </Typography>
          </Box>

          {/* Right Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton color="inherit" sx={{ color: '#000000' }}>
              <NotificationsIcon />
            </IconButton>
            <IconButton color="inherit" sx={{ color: '#000000' }}>
              <SettingsIcon />
            </IconButton>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
              <Typography variant="body2" sx={{ color: '#000000' }}>
                {user?.name || 'Employee'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#000000' }}>
                →
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#000000', 
                  cursor: 'pointer',
                  '&:hover': { textDecoration: 'underline' }
                }}
                onClick={handleLogout}
              >
                Logout
              </Typography>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Navigation Bar */}
      <Box sx={{ 
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E5E7EB',
        px: 3,
        py: 1
      }}>
        <Box sx={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <motion.div
                key={item.text}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    px: 2,
                    py: 1.5,
                    borderRadius: 2,
                    cursor: 'pointer',
                    backgroundColor: isActive ? '#F3F4F6' : 'transparent',
                    color: isActive ? '#1F2937' : '#6B7280',
                    '&:hover': {
                      backgroundColor: '#F9FAFB',
                      color: '#1F2937',
                    },
                    transition: 'all 0.2s ease-in-out',
                  }}
                  onClick={() => navigate(item.path)}
                >
                  {item.icon}
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {item.text}
                  </Typography>
                </Box>
              </motion.div>
            );
          })}
        </Box>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: '#FFFFFF',
          overflow: 'auto',
          padding: 3,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </Box>
    </Box>
  );
};

export default EmployeeLayout;