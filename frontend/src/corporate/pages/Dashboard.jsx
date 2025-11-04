import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  Event as EventIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as AttachMoneyIcon,
  CalendarToday as CalendarIcon,
  People as PeopleIcon,
  RestaurantMenu as MealIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import axiosInstance from '../../api/axiosInstance';


const CorporateDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    summary: {},
    bookings: [],
    spending: [],
    events: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [summaryRes, bookingsRes, spendingRes, eventsRes] = await Promise.all([
        axiosInstance.get('/corporate/summary'),
        axiosInstance.get('/corporate/bookings'),
        axiosInstance.get('/corporate/spending'),
        axiosInstance.get('/corporate/events'),
      ]);

      setDashboardData({
        summary: summaryRes.data,
        bookings: bookingsRes.data,
        spending: spendingRes.data,
        events: eventsRes.data,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Use mock data for now
      setDashboardData({
        summary: {
          activeBookings: 0,
          totalEvents: 0,
          totalSpent: 0,
          monthlySpent: 0,
        },
        bookings: [],
        spending: [],
        events: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      title: 'Active Bookings',
      value: dashboardData.summary.activeBookings || 0,
      subtitle: 'Currently scheduled',
      icon: <CalendarIcon />,
      color: '#3B82F6',
    },
    {
      title: 'Total Events',
      value: dashboardData.summary.totalEvents || 0,
      subtitle: 'All time events',
      icon: <TrendingUpIcon />,
      color: '#10B981',
    },
    {
      title: 'Total Spent',
      value: `₹${dashboardData.summary.totalSpent || 0}`,
      subtitle: 'This month',
      icon: <AttachMoneyIcon />,
      color: '#F59E0B',
    },
  ];

  const recentActivities = [
    { id: 1, type: 'booking', description: 'Corporate Lunch - Team Meeting', amount: '₹2,500', time: '2 hours ago' },
    { id: 2, type: 'invoice', description: 'Invoice #INV-001', amount: '₹5,000', time: '1 day ago' },
    { id: 3, type: 'meal-plan', description: 'Weekly Meal Plan Updated', amount: '₹1,200', time: '3 days ago' },
    { id: 4, type: 'event', description: 'Annual Conference Catering', amount: '₹15,000', time: '1 week ago' },
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'booking':
        return <EventIcon />;
      case 'invoice':
        return <AttachMoneyIcon />;
      case 'meal-plan':
        return <MealIcon />;
      case 'event':
        return <PeopleIcon />;
      default:
        return <EventIcon />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'booking':
        return '#3B82F6';
      case 'invoice':
        return '#10B981';
      case 'meal-plan':
        return '#F59E0B';
      case 'event':
        return '#8B5CF6';
      default:
        return '#6B7280';
    }
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
      <Box sx={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#000000', mb: 1 }}>
            Dashboard Overview
          </Typography>
          <Typography variant="body1" sx={{ color: '#6B7280' }}>
            Welcome back, {dashboardData.summary.companyName || 'Corporate User'}
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  sx={{ 
                    height: '100%',
                    border: '1px solid #E5E7EB',
                    borderRadius: 2,
                    boxShadow: 'none',
                    '&:hover': {
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#000000', mb: 0.5 }}>
                          {stat.value}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#6B7280', mb: 1 }}>
                          {stat.title}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#9CA3AF' }}>
                          {stat.subtitle}
                        </Typography>
                      </Box>
                      <Box 
                        sx={{ 
                          p: 2, 
                          borderRadius: 2, 
                          backgroundColor: `${stat.color}15`,
                          color: stat.color,
                        }}
                      >
                        {stat.icon}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Spending Trend */}
          <Grid item xs={12} lg={8}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card 
                sx={{ 
                  border: '1px solid #E5E7EB',
                  borderRadius: 2,
                  boxShadow: 'none',
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#000000', mb: 3 }}>
                    Spending Trend (Last 7 Days)
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={dashboardData.spending}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                        <XAxis dataKey="date" stroke="#6B7280" />
                        <YAxis stroke="#6B7280" />
                        <Tooltip
                          formatter={(value) => [`₹${value}`, 'Spending']}
                          contentStyle={{
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #E5E7EB',
                            borderRadius: '8px',
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="amount"
                          stroke="#3B82F6"
                          fill="#3B82F6"
                          fillOpacity={0.1}
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Recent Activities */}
          <Grid item xs={12} lg={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card 
                sx={{ 
                  border: '1px solid #E5E7EB',
                  borderRadius: 2,
                  boxShadow: 'none',
                  height: '100%',
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#000000', mb: 3 }}>
                    Recent Activity
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {recentActivities.map((activity) => (
                      <Box
                        key={activity.id}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          p: 2,
                          borderRadius: 2,
                          backgroundColor: '#F9FAFB',
                          '&:hover': {
                            backgroundColor: '#F3F4F6',
                          },
                          transition: 'background-color 0.2s ease-in-out',
                        }}
                      >
                        <Box 
                          sx={{ 
                            p: 1, 
                            borderRadius: 1, 
                            backgroundColor: `${getActivityColor(activity.type)}15`,
                            color: getActivityColor(activity.type),
                          }}
                        >
                          {getActivityIcon(activity.type)}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: '#000000' }}>
                            {activity.description}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#6B7280' }}>
                            {activity.time}
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#000000' }}>
                          {activity.amount}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>

        {/* Upcoming Events Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card 
            sx={{ 
              border: '1px solid #E5E7EB',
              borderRadius: 2,
              boxShadow: 'none',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#000000', mb: 3 }}>
                Upcoming Events
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, color: '#000000' }}>Event</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#000000' }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#000000' }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#000000' }}>Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dashboardData.bookings.length > 0 ? (
                      dashboardData.bookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {booking.eventName}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ color: '#6B7280' }}>
                              {new Date(booking.date).toLocaleDateString()}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={booking.status}
                              size="small"
                              color={booking.status === 'confirmed' ? 'success' : 'warning'}
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              ₹{booking.amount}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} sx={{ textAlign: 'center', py: 4 }}>
                          <Typography variant="body2" sx={{ color: '#6B7280' }}>
                            No upcoming events scheduled
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </motion.div>
      </Box>
  );
};

export default CorporateDashboard;