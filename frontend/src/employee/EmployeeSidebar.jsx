import React, { useState } from 'react';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Drawer,
  Toolbar,
  Typography,
  Divider,
  IconButton,
  Box,
} from '@mui/material';
import { NavLink, useLocation } from 'react-router-dom';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PaymentIcon from '@mui/icons-material/Payment';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ChatIcon from '@mui/icons-material/Chat';

const navItems = [
  { label: 'Assigned Events', path: '/employee/dashboard/events', icon: <AssignmentIcon /> },
  { label: 'Payroll', path: '/employee/dashboard/payroll', icon: <PaymentIcon /> },
  { label: 'Profile', path: '/employee/dashboard/profile', icon: <AccountCircleIcon /> },
  { label: 'Chat', path: '/employee/dashboard/chat', icon: <ChatIcon /> },
];

const EmployeeSidebar = ({ drawerWidth, mobileOpen, handleDrawerToggle }) => {
  const location = useLocation();

  const drawer = (
    <>
      <Toolbar sx={{ bgcolor: '#1e293b' }}>
        <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
          👨‍🍳 The Event Executor
        </Typography>
      </Toolbar>
      <Divider />
      <List sx={{ bgcolor: '#1e293b', height: '100%', color: 'white' }}>
        {navItems.map((item) => (
          <ListItem
            button
            key={item.label}
            component={NavLink}
            to={item.path}
            selected={location.pathname === item.path}
            sx={{
              '&.active': {
                bgcolor: '#334155',
              },
              '&:hover': {
                bgcolor: '#334155',
              },
            }}
          >
            <ListItemIcon sx={{ color: 'white' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
    </>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
    >
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth,
            bgcolor: '#1e293b'
          },
        }}
      >
        {drawer}
      </Drawer>
      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth,
            bgcolor: '#1e293b'
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default EmployeeSidebar;