import React, { useState } from "react";
import { Box, AppBar, Toolbar, IconButton, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Routes, Route, Navigate } from "react-router-dom";

import EmployeeSidebar from "../employee/EmployeeSidebar";
import AssignedBookings from "../employee/AssignedBookings";
import EmployeePayroll from "../employee/EmployeePayroll";
import EmployeeProfile from "../employee/EmployeeProfile";
import Chat from "../employee/Chat";

const drawerWidth = 240;

const EmployeeDashboard = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#F8FAFC" }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          backgroundColor: "#3b82f6",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            FoodServe Employee Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      <EmployeeSidebar
        drawerWidth={drawerWidth}
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
        }}
      >
        <Routes>
          <Route index element={<Navigate to="events" replace />} />
          <Route path="events" element={<AssignedBookings />} />
          <Route path="payroll" element={<EmployeePayroll />} />
          <Route path="profile" element={<EmployeeProfile />} />
          <Route path="chat" element={<Chat />} />
          <Route path="*" element={<Navigate to="events" replace />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default EmployeeDashboard;
