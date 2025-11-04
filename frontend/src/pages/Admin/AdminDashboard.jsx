import React, { useState, useEffect } from 'react';
import {
  Box, Button, Drawer, Typography, AppBar, Toolbar, IconButton, Badge, Menu, MenuItem as MuiMenuItem, Snackbar, Alert
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {
  Dashboard as DashboardIcon,
  RestaurantMenu as RestaurantMenuIcon,
  Assignment as AssignmentIcon,
  Group as GroupIcon,
  People as PeopleIcon,
  Reviews as ReviewsIcon,
  Report as ReportIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon
} from '@mui/icons-material';
import axiosInstance from '../../api/axiosInstance';
import toast from 'react-hot-toast';

import DashboardOverview from '../../components/admin/DashboardOverview';
import MenuManager from '../../components/admin/MenuManager';
import ServicesManager from '../../components/admin/ServicesManager';
import AccountsManager from '../../components/admin/AccountsManager';
import OrdersManager from '../../components/admin/OrdersManager';
import BookingManager from '../../components/admin/BookingManager';
import ReportsManager from '../../components/admin/ReportsManager';
import ReviewsManager from '../../components/admin/ReviewsManager';

const drawerWidth = 220;

const navItems = [
  { label: 'Overview', icon: <DashboardIcon /> },
  { label: 'Menu', icon: <RestaurantMenuIcon /> },
  { label: 'Services', icon: <AssignmentIcon /> },
  { label: 'Orders', icon: <AssignmentIcon /> },
  { label: 'Bookings', icon: <AssignmentIcon /> },
  { label: 'Users', icon: <GroupIcon /> },
  { label: 'Employees', icon: <PeopleIcon /> },
  { label: 'Reviews', icon: <ReviewsIcon /> },
  { label: 'Reports', icon: <ReportIcon /> },
];

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('Overview');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifCount, setNotifCount] = useState(3); // Example notification count
  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  // Load initial stats
  const [stats, setStats] = useState({ users: 0, orders: 0, revenue: 0, bookings: 0 });
  useEffect(() => {
    axiosInstance.get('/reports/summary').then(res => {
      const d = res.data || {};
      setStats({
        users: d.usersCount || d.users || 0,
        orders: d.ordersCount || d.orders || 0,
        revenue: d.revenueTotal || d.revenue || 0,
        bookings: d.bookingsCount || d.bookings || 0,
      });
    }).catch(() => {});
  }, []);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#fafafa' }}>
      {/* Sidebar Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: '#f5f5f5',
            borderRight: '1px solid #ddd',
          },
        }}
        open
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Admin Dashboard
          </Typography>
          {navItems.map((item) => (
            <Button
              key={item.label}
              startIcon={item.icon}
              fullWidth
              onClick={() => setActiveSection(item.label)}
              variant={activeSection === item.label ? 'contained' : 'text'}
              sx={{ justifyContent: 'flex-start', mb: 1, borderRadius: 2, fontWeight: 600, textTransform: 'none' }}
              className="transition-all duration-150 hover:bg-green-100"
            >
              {item.label}
            </Button>
          ))}
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 0, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* AppBar */}
        <AppBar position="sticky" color="inherit" elevation={1} sx={{ zIndex: 1201, bgcolor: '#fff', borderBottom: '1px solid #eee' }}>
          <Toolbar className="flex justify-between">
            <Typography variant="h6" className="font-bold text-green-700 tracking-wide">FoodServe Admin</Typography>
            <Box className="flex items-center gap-2">
              <IconButton color="inherit" onClick={() => setSnackbar({ open: true, message: 'No new notifications', severity: 'info' })}>
                <Badge badgeContent={notifCount} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <IconButton color="inherit" onClick={handleMenu} size="large">
                <AccountCircleIcon />
              </IconButton>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
                <MuiMenuItem onClick={handleCloseMenu}>Profile</MuiMenuItem>
                <MuiMenuItem onClick={handleCloseMenu}>Logout</MuiMenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>
        <Box sx={{ flexGrow: 1, p: { xs: 1, md: 3 } }} className="bg-white min-h-[calc(100vh-64px)]">
          {activeSection === 'Overview' && <DashboardOverview />}
          {activeSection === 'Menu' && <MenuManager />}
          {activeSection === 'Services' && <ServicesManager />}
          {activeSection === 'Accounts' && <AccountsManager />}
          {activeSection === 'Orders' && <OrdersManager />}
          {activeSection === 'Bookings' && <BookingManager />}
          {activeSection === 'Reports' && <ReportsManager />}
          {activeSection === 'Reviews' && <ReviewsManager />}
        </Box>
        <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
}
