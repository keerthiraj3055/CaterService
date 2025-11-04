import React, { useEffect, useState } from 'react';
import { Card, Grid, Typography, Box } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

export default function DashboardOverview() {
  const [stats, setStats] = useState({ users: 0, orders: 0, revenue: 0, bookings: 0 });
  const [trends, setTrends] = useState([]);
  useEffect(() => {
    axios.get('/api/admin/stats', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(res => {
        setStats(res.data.stats);
        setTrends(res.data.trends);
      });
  }, []);
  return (
    <Box className="p-4">
      <Grid container spacing={2} className="mb-4">
        <Grid item xs={12} sm={6} md={3}><Card className="p-4"><Typography variant="h6">Users</Typography><Typography variant="h4">{stats.users}</Typography></Card></Grid>
        <Grid item xs={12} sm={6} md={3}><Card className="p-4"><Typography variant="h6">Orders</Typography><Typography variant="h4">{stats.orders}</Typography></Card></Grid>
        <Grid item xs={12} sm={6} md={3}><Card className="p-4"><Typography variant="h6">Revenue</Typography><Typography variant="h4">${stats.revenue}</Typography></Card></Grid>
        <Grid item xs={12} sm={6} md={3}><Card className="p-4"><Typography variant="h6">Bookings</Typography><Typography variant="h4">{stats.bookings}</Typography></Card></Grid>
      </Grid>
      <Box className="bg-white rounded shadow p-4">
        <Typography variant="subtitle1" className="mb-2">Monthly Trends</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={trends}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="users" fill="#3B82F6" name="Users" />
            <Bar dataKey="orders" fill="#10B981" name="Orders" />
            <Bar dataKey="revenue" fill="#F59E0B" name="Revenue" />
            <Bar dataKey="bookings" fill="#8B5CF6" name="Bookings" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}
