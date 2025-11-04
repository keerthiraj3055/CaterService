import React from 'react';
import { AppBar, Toolbar, IconButton, InputBase, Avatar, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';

const Topbar = ({ onMenuToggle }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  return (
    <AppBar position="sticky" elevation={0} sx={{ backgroundColor: '#FFFFFF', color: '#0f172a' }}>
      <Toolbar sx={{ minHeight: 64, display: 'flex', gap: 2 }}>
        <IconButton edge="start" sx={{ display: { md: 'none' } }} onClick={onMenuToggle}>
          <MenuIcon />
        </IconButton>
        <div className="font-semibold text-[#1E293B]">Cater Admin</div>
        <div className="flex-1" />
        <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-1">
          <InputBase placeholder="Search…" sx={{ fontSize: 14 }} />
        </div>
        <IconButton>
          <NotificationsNoneIcon />
        </IconButton>
        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
          <Avatar sx={{ width: 32, height: 32 }} />
        </IconButton>
        <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
          <MenuItem>Profile</MenuItem>
          <MenuItem>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;




