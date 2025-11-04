import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Alert,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Avatar,
  useTheme
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';

const Payroll = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [events, setEvents] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [userData, setUserData] = useState({
    name: 'John Doe',
    role: 'Employee'
  });

  const handleProfileMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleProfile = () => {
    navigate('/employee/profile');
    handleCloseMenu();
  };

  useEffect(() => {
    const fetchPayrollData = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/employee/payroll', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const formattedEvents = response.data.map(event => ({
          id: event._id,
          date: new Date(event.date).toLocaleDateString(),
          eventName: event.name,
          hours: event.hours,
          rate: event.hourlyRate,
          total: event.hours * event.hourlyRate
        }));
        setEvents(formattedEvents);
        setError(null);
      } catch (err) {
        setError('Failed to load payroll data. Please try again later.');
        console.error('Error fetching payroll data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayrollData();
  }, []);

  const columns = [
    { 
      field: 'date', 
      headerName: 'Date', 
      width: 130,
      renderCell: (params) => (
        <Typography variant="body2">
          {new Date(params.value).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </Typography>
      )
    },
    { 
      field: 'eventName', 
      headerName: 'Event Name', 
      width: 250,
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {params.value}
        </Typography>
      )
    },
    { 
      field: 'hours', 
      headerName: 'Hours', 
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.value} hrs
        </Typography>
      )
    },
    { 
      field: 'rate', 
      headerName: 'Rate', 
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2">
          ${params.value}/hr
        </Typography>
      )
    },
    { 
      field: 'total', 
      headerName: 'Total Earnings', 
      width: 150,
      renderCell: (params) => (
        <Typography 
          variant="body2" 
          sx={{ 
            fontWeight: 600,
            color: theme.palette.success.main
          }}
        >
          ${params.value}
        </Typography>
      )
    },
  ];

  // Calculate summary statistics
  const totalEarnings = events.reduce((sum, event) => sum + event.total, 0);
  const totalHours = events.reduce((sum, event) => sum + event.hours, 0);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Employee Portal
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="subtitle1" sx={{ mr: 2 }}>
              {userData.name}
            </Typography>
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              onClick={handleProfileMenu}
            >
              <Avatar sx={{ bgcolor: theme.palette.secondary.main }}>
                <AccountCircleIcon />
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleCloseMenu}
              PaperProps={{
                sx: { minWidth: '200px', mt: 1 }
              }}
            >
              <Box sx={{ px: 2, py: 1 }}>
                <Typography variant="subtitle1">{userData.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {userData.role}
                </Typography>
              </Box>
              <Divider />
              <MenuItem onClick={handleProfile}>
                <AccountCircleIcon sx={{ mr: 2 }} /> Profile
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <LogoutIcon sx={{ mr: 2 }} /> Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 3, flexGrow: 1 }}>
        <Typography 
          variant="h4" 
          gutterBottom 
          sx={{ 
            color: theme.palette.primary.main,
            fontWeight: 'medium',
            mb: 4 
          }}
        >
          Payroll & Earnings
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                background: theme.palette.primary.main,
                color: 'white',
                borderRadius: 2
              }}
            >
              <Typography variant="h6" gutterBottom>Total Earnings</Typography>
              <Typography variant="h3">${totalEarnings}</Typography>
              <Typography variant="subtitle2" sx={{ mt: 1, opacity: 0.8 }}>
                Current Period
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                background: theme.palette.secondary.main,
                color: 'white',
                borderRadius: 2
              }}
            >
              <Typography variant="h6" gutterBottom>Total Hours</Typography>
              <Typography variant="h3">{totalHours}</Typography>
              <Typography variant="subtitle2" sx={{ mt: 1, opacity: 0.8 }}>
                Hours Worked
              </Typography>
            </Paper>
          </Grid>
        </Grid>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress size={60} thickness={4} />
        </Box>
      ) : error ? (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 2,
            borderRadius: 2,
            '& .MuiAlert-icon': {
              fontSize: '2rem'
            }
          }}
        >
          {error}
        </Alert>
      ) : (
        <Paper 
          elevation={3} 
          sx={{ 
            height: 500, 
            width: '100%',
            borderRadius: 2,
            overflow: 'hidden'
          }}
        >
          <DataGrid
            rows={events}
            columns={columns}
            pageSize={7}
            rowsPerPageOptions={[7, 14, 25]}
            disableSelectionOnClick
            loading={loading}
            sx={{
              border: 'none',
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: theme.palette.grey[100],
                color: theme.palette.text.primary,
                fontWeight: 'bold'
              },
              '& .MuiDataGrid-cell': {
                borderBottom: `1px solid ${theme.palette.grey[200]}`
              },
              '& .MuiDataGrid-row:hover': {
                backgroundColor: theme.palette.action.hover
              }
            }}
          />
        </Paper>
      )}
    </Box>
    </Box>
  );
};

export default Payroll;