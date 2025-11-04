import React, { useState, useContext } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PaymentIcon from "@mui/icons-material/Payment";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import { AuthContext } from "../context/AuthContext";

const drawerWidth = 240;

const navItems = [
  { label: "Assigned Events", to: "/employee/dashboard/events", icon: <AssignmentIcon /> },
  { label: "Payroll Info", to: "/employee/dashboard/payroll", icon: <PaymentIcon /> },
  { label: "Profile", to: "/employee/dashboard/profile", icon: <AccountCircleIcon /> },
];

const EmployeeLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const drawer = (
    <div>
      <Toolbar sx={{ bgcolor: '#0f172a', color: 'white' }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          FoodServe Employee
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem
            key={item.label}
            button
            component={NavLink}
            to={item.to}
            sx={{ color: 'white', '&.active': { backgroundColor: '#111827' } }}
          >
            <ListItemIcon sx={{ color: 'white' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: '#2563eb' }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            FoodServe Employee Dashboard
          </Typography>
          <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', bgcolor: '#0b1320', color: 'white' },
        }}
      >
        {drawer}
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default EmployeeLayout;
