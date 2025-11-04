import React, { useState, useContext } from 'react';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, AppBar, Toolbar, Typography, IconButton, Divider, Snackbar, Alert } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EventIcon from '@mui/icons-material/Event';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import ReceiptIcon from '@mui/icons-material/Receipt';
import BarChartIcon from '@mui/icons-material/BarChart';
import ChatIcon from '@mui/icons-material/Chat';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';


const drawerWidth = 220;

const navItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/corporate' },
  { text: 'Bookings', icon: <EventIcon />, path: '/corporate/bookings' },
  { text: 'Meal Plans', icon: <RestaurantMenuIcon />, path: '/corporate/meal-plans' },
  { text: 'Invoices', icon: <ReceiptIcon />, path: '/corporate/invoices' },
  { text: 'Analytics', icon: <BarChartIcon />, path: '/corporate/analytics' },
  { text: 'Chat', icon: <ChatIcon />, path: '/corporate/chat' },
  { text: 'Profile', icon: <AccountCircleIcon />, path: '/corporate/profile' },
];

export default function CorporateLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#f9fafb' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', background: '#1e293b', color: 'white' },
        }}
      >
        <Toolbar>
          <Typography variant="h6" className="font-bold text-white">Business Portal</Typography>
        </Toolbar>
        <Divider />
        <List>
          {navItems.map((item) => (
            <ListItem button key={item.text} selected={location.pathname === item.path} onClick={() => navigate(item.path)}
              className="rounded-lg my-1 transition-all duration-200"
              sx={{
                background: location.pathname === item.path ? '#3b82f6' : 'transparent',
                color: location.pathname === item.path ? 'white' : '#cbd5e1',
                '&:hover': { background: '#334155', color: 'white' }
              }}>
              <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          <ListItem button onClick={handleLogout}>
            <ListItemIcon sx={{ color: 'inherit' }}><LogoutIcon /></ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>
      <Box component="main" className="flex-1 p-6 bg-gray-50 min-h-screen overflow-auto">
        <AppBar position="static" color="inherit" elevation={1} className="mb-6 bg-white">
          <Toolbar>
            <Typography variant="h5" className="font-bold text-slate-800">FoodServe Corporate</Typography>
            <Box sx={{ flex: 1 }} />
            <Typography variant="body1" className="text-slate-600 mr-4">{user?.name || 'User'}</Typography>
            <IconButton color="inherit" onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
  <Box className="max-w-7xl mx-auto"><Outlet /></Box>
        <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
}