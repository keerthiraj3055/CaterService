import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography, Box, Card, CardContent, IconButton } from '@mui/material';
import { 
  PeopleAlt, MenuBook, EventNote, Assessment, TrendingUp,
  AttachMoney, ShoppingCart, Timeline
} from '@mui/icons-material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import axiosInstance from '../../api/axiosInstance';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    usersCount: 0,
    ordersCount: 0,
    bookingsCount: 0,
    revenue: 0,
  });

  const [revenueData, setRevenueData] = useState([]);
  const [orderStats, setOrderStats] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, revenueRes, ordersRes] = await Promise.all([
          axiosInstance.get('/api/reports/stats'),
          axiosInstance.get('/api/reports/revenue'),
          axiosInstance.get('/api/reports/orders')
        ]);

        setStats(statsRes.data);
        setRevenueData(revenueRes.data);
        setOrderStats(ordersRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    { title: 'Total Users', value: stats.usersCount, icon: <PeopleAlt />, color: '#3f51b5' },
    { title: 'Total Orders', value: stats.ordersCount, icon: <MenuBook />, color: '#f50057' },
    { title: 'Total Bookings', value: stats.bookingsCount, icon: <EventNote />, color: '#00bcd4' },
    { title: 'Revenue', value: `$${stats.revenue?.toLocaleString()}`, icon: <TrendingUp />, color: '#4caf50' },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <Box className="p-6">
      <Typography variant="h4" className="mb-6 text-gray-800 font-semibold">
        Admin Dashboard
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} className="mb-6">
        {statCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="flex items-center justify-between">
                <div>
                  <Typography color="textSecondary" gutterBottom>
                    {stat.title}
                  </Typography>
                  <Typography variant="h5" component="div">
                    {stat.value}
                  </Typography>
                </div>
                <IconButton style={{ backgroundColor: stat.color + '20', color: stat.color }}>
                  {stat.icon}
                </IconButton>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        {/* Revenue Chart */}
        <Grid item xs={12} md={8}>
          <Paper className="p-4">
            <Typography variant="h6" className="mb-4">Revenue Overview</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Order Status Chart */}
        <Grid item xs={12} md={4}>
          <Paper className="p-4">
            <Typography variant="h6" className="mb-4">Order Status</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={orderStats}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {orderStats.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;