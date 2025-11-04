import React from "react";
import { Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography } from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PaymentIcon from "@mui/icons-material/Payment";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { NavLink } from "react-router-dom";

const menu = [
  { label: "Assigned Events", path: "events", icon: <AssignmentIcon /> },
  { label: "Payroll Info", path: "payroll", icon: <PaymentIcon /> },
  { label: "Profile", path: "profile", icon: <AccountCircleIcon /> },
];

const EmployeeSidebar = ({ drawerWidth = 240 }) => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "#0f1724",
          color: "white",
        },
      }}
      open
    >
      <Toolbar>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          👨‍🍳 Employee
        </Typography>
      </Toolbar>
      <Box sx={{ px: 1 }}>
        <List>
          {menu.map((m) => (
            <ListItemButton
              key={m.path}
              component={NavLink}
              to={m.path}
              sx={{
                color: "white",
                "&.active": { backgroundColor: "#1e293b" },
                borderRadius: 1,
                my: 0.5,
              }}
            >
              <ListItemIcon sx={{ color: "white", minWidth: 36 }}>{m.icon}</ListItemIcon>
              <ListItemText primary={m.label} />
            </ListItemButton>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default EmployeeSidebar;
