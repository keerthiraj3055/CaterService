import React, { useState, useContext, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles'; // ✅ only useTheme, no ThemeProvider
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  RestaurantMenu as MenuIcon2,
  LocalDining as ServicesIcon,
  ShoppingCart as OrdersIcon,
  Event as BookingsIcon,
  People as UsersIcon,
  Assessment as ReportsIcon,
  Reviews as ReviewsIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useThemeContext } from '../../context/ThemeContext';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

const drawerWidth = 280;

const AdminLayout = () => {
  const theme = useTheme(); // ✅ works now (since ThemeProvider wraps app in index.js)
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifCount, setNotifCount] = useState(0);
  const socketRef = useRef(null);

  // Socket.IO connection for admin notifications
  useEffect(() => {
    try {
      const url = process.env.REACT_APP_API_BASE || 'http://localhost:5000';
      const socket = io(url, { transports: ['websocket', 'polling'] });
      socketRef.current = socket;
      // join admins room after connection
      socket.on('connect', () => {
        socket.emit('join-room', 'admins');
      });

      socket.on('BOOKING_REQUESTED', (booking) => {
        toast.success('New booking requested');
        setNotifCount((c) => c + 1);
      });

      socket.on('BOOKING_UPDATED', (payload) => {
        toast((t) => (
          <span>Booking {payload?.status || 'updated'} — ID: {String(payload?.id || payload?._id).slice(-6)}</span>
        ));
        setNotifCount((c) => c + 1);
      });

      socket.on('NEW_ORDER_CREATED', (order) => {
        toast.success('New order placed');
        setNotifCount((c) => c + 1);
      });

      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
        }
      };
    } catch (err) {
      // fail silently if socket can't be established in dev environment
      console.warn('Socket init failed', err);
    }
  }, []);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);
  const themeCtx = useThemeContext();
  const isDarkMode = themeCtx?.isDarkMode;
  const toggleDarkMode = themeCtx?.toggleDarkMode;

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleProfileMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleProfileMenuClose = () => setAnchorEl(null);
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
    { text: 'Menu Management', icon: <MenuIcon2 />, path: '/admin/menu' },
    { text: 'Services', icon: <ServicesIcon />, path: '/admin/services' },
    { text: 'Orders', icon: <OrdersIcon />, path: '/admin/orders' },
    { text: 'Bookings', icon: <BookingsIcon />, path: '/admin/bookings' },
    { text: 'Users & Accounts', icon: <UsersIcon />, path: '/admin/accounts' },
    { text: 'Reports', icon: <ReportsIcon />, path: '/admin/reports' },
    { text: 'Reviews', icon: <ReviewsIcon />, path: '/admin/reviews' },
  ];

  const drawer = (
    <Box sx={{ height: '100%', backgroundColor: '#1E293B', color: 'white' }}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'white' }}>
          🍽️ FoodServe
        </Typography>
        <Typography variant="body2" sx={{ color: '#94A3B8', mt: 1 }}>
          Admin Dashboard
        </Typography>
      </Box>
      <Divider sx={{ backgroundColor: '#334155' }} />
      <List sx={{ px: 2, py: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <motion.div key={item.text} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  px: 2,
                  py: 1.5,
                  borderRadius: 2,
                  mb: 1,
                  cursor: 'pointer',
                  backgroundColor: isActive ? '#3B82F6' : 'transparent',
                  color: isActive ? 'white' : '#94A3B8',
                  '&:hover': {
                    backgroundColor: isActive ? '#3B82F6' : '#334155',
                    color: 'white',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) setMobileOpen(false);
                }}
              >
                <Box sx={{ mr: 2 }}>{item.icon}</Box>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {item.text}
                </Typography>
              </Box>
            </motion.div>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box className="min-h-screen bg-slate-50 flex" sx={{ backgroundColor: '#F8FAFC' }}>
      {/* Top App Bar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          backgroundColor: 'white',
          color: '#1E293B',
          zIndex: theme.zIndex.drawer + 1,
          borderBottom: '1px solid #E2E8F0',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {menuItems.find((item) => item.path === location.pathname)?.text || 'Dashboard'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton color="inherit">
              <Badge badgeContent={notifCount} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton onClick={handleProfileMenuOpen}>
              <Avatar sx={{ bgcolor: '#3B82F6', fontWeight: 700 }}>
                {user?.name?.charAt(0).toUpperCase() || 'A'}
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Profile Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleProfileMenuClose}>
        <MenuItem onClick={handleProfileMenuClose}>
          <AccountIcon sx={{ mr: 1 }} /> Profile
        </MenuItem>
        <MenuItem onClick={handleProfileMenuClose}>
          <SettingsIcon sx={{ mr: 1 }} /> Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <LogoutIcon sx={{ mr: 1 }} /> Logout
        </MenuItem>
      </Menu>

      {/* Sidebar Drawer */}
      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              height: '100vh',
              position: 'relative',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: '64px',
          p: { xs: 2, md: 4 },
          minHeight: 'calc(100vh - 64px)',
          backgroundColor: '#F8FAFC',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-7xl mx-auto"
        >
          <Outlet />
        </motion.div>
      </Box>
    </Box>
  );
};

export default AdminLayout;
