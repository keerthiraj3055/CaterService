

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ReportIcon from '@mui/icons-material/Report';
import axiosInstance from '../api/axiosInstance';
import { AuthContext } from '../context/AuthContext';


const drawerWidth = 200;
const navItems = [
  { label: 'Bookings', icon: <AssignmentIcon /> },
  { label: 'Meal Plans', icon: <AssignmentIcon /> },
  { label: 'Invoices', icon: <ReceiptIcon /> },
  { label: 'Reports', icon: <ReportIcon /> },
  { label: 'Admin Communication', icon: <DashboardIcon /> },
];

const CorporateDashboard = () => {
  const [tab, setTab] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const handleDrawerToggle = () => setDrawerOpen(!drawerOpen);
  const [bookings, setBookings] = useState([]);
  const [mealPlans, setMealPlans] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [reports, setReports] = useState([]);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        axiosInstance.get('/corporate/bookings').then(res => setBookings(res.data)).catch(() => {});
        axiosInstance.get('/corporate/mealplans').then(res => setMealPlans(res.data)).catch(() => {});
        axiosInstance.get('/corporate/invoices').then(res => setInvoices(res.data)).catch(() => {});
        axiosInstance.get('/corporate/reports').then(res => setReports(res.data)).catch(() => {});
        axiosInstance.get('/corporate/messages').then(res => setMessages(res.data)).catch(() => {});
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleTabChange = (e, newValue) => setTab(newValue);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;
    axiosInstance.post('/corporate/messages', { message }).then(res => {
      setMessages([...messages, res.data]);
      setMessage('');
    });
  };

  // DataGrid columns
  const bookingsColumns = [
    { field: 'eventType', headerName: 'Event', flex: 1 },
    { field: 'date', headerName: 'Date', flex: 1 },
    { field: 'status', headerName: 'Status', flex: 1 },
  ];
  const mealPlansColumns = [
    { field: 'planName', headerName: 'Plan', flex: 1 },
    { field: 'frequency', headerName: 'Frequency', flex: 1 },
    { field: 'startDate', headerName: 'Start Date', flex: 1 },
    { field: 'status', headerName: 'Status', flex: 1 },
  ];
  const invoicesColumns = [
    { field: '_id', headerName: 'Invoice ID', flex: 1 },
    { field: 'date', headerName: 'Date', flex: 1 },
    { field: 'amount', headerName: 'Amount', flex: 1 },
    { field: 'download', headerName: 'Download', flex: 1, renderCell: (params) => <Button size="small" onClick={() => window.open(`/api/invoices/${params.row._id}/download`, '_blank')}>Download</Button> },
  ];
  const reportsColumns = [
    { field: 'title', headerName: 'Title', flex: 2 },
    { field: 'download', headerName: 'Download', flex: 1, renderCell: (params) => <Button size="small" onClick={() => window.open(`/api/reports/${params.row._id}/download`, '_blank')}>Download</Button> },
  ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background' }}>
      {/* Sidebar Drawer */}
      <Drawer
        variant="permanent"
        sx={{ width: drawerWidth, flexShrink: 0, [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', bgcolor: 'accent' } }}
        open
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {navItems.map((item, idx) => (
              <ListItem button key={item.label} selected={tab === idx} onClick={() => setTab(idx)}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 0 }}>
        {/* AppBar */}
        <AppBar position="static" color="primary" elevation={1} sx={{ zIndex: 1201 }}>
          <Toolbar>
            <IconButton color="inherit" edge="start" sx={{ mr: 2 }} onClick={handleDrawerToggle}><MenuIcon /></IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1, fontFamily: 'heading' }}>FoodServe Corporate</Typography>
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          </Toolbar>
        </AppBar>
        <Box sx={{ p: 4 }}>
          {tab === 0 && (
            <DataGrid autoHeight rows={bookings} columns={bookingsColumns} getRowId={row => row._id || row.id} pageSize={10} />
          )}
          {tab === 1 && (
            <DataGrid autoHeight rows={mealPlans} columns={mealPlansColumns} getRowId={row => row._id || row.id} pageSize={10} />
          )}
          {tab === 2 && (
            <DataGrid autoHeight rows={invoices} columns={invoicesColumns} getRowId={row => row._id || row.id} pageSize={10} />
          )}
          {tab === 3 && (
            <DataGrid autoHeight rows={reports} columns={reportsColumns} getRowId={row => row._id || row.id} pageSize={10} />
          )}
          {tab === 4 && (
            <Box>
              <Typography variant="h6">Admin Communication</Typography>
              <Box sx={{ mb: 2, maxHeight: 200, overflowY: 'auto', border: '1px solid #eee', borderRadius: 2, p: 1 }}>
                {messages.map((msg, idx) => (
                  <div key={idx} style={{ marginBottom: 8 }}><b>{msg.sender}:</b> {msg.message}</div>
                ))}
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="Message"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  fullWidth
                  size="small"
                />
                <Button variant="contained" onClick={handleSendMessage}>Send</Button>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default CorporateDashboard;
