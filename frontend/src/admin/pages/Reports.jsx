import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip
} from '@mui/material';
import {
  Assessment as ReportsIcon,
  Download as DownloadIcon,
  TrendingUp as TrendingUpIcon,
  ShoppingCart as OrdersIcon,
  Event as BookingsIcon,
  People as UsersIcon,
  AttachMoney as RevenueIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import toast from 'react-hot-toast';
import axiosInstance from '../../api/axiosInstance';

const Reports = () => {
  const [reports, setReports] = useState({
    summary: {},
    revenueTrend: [],
    ordersByCategory: [],
    bookingsByMonth: [],
    userGrowth: [],
  });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30');
  const [reportType, setReportType] = useState('all');

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  useEffect(() => {
    fetchReports();
  }, [dateRange]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const [summaryRes, revenueRes, ordersRes, bookingsRes, usersRes] = await Promise.all([
        axiosInstance.get(`/reports/summary?days=${dateRange}`),
        axiosInstance.get(`/reports/revenue-trend?days=${dateRange}`),
        axiosInstance.get(`/reports/orders-by-category?days=${dateRange}`),
        axiosInstance.get(`/reports/bookings-by-month?days=${dateRange}`),
        axiosInstance.get(`/reports/user-growth?days=${dateRange}`),
      ]);

      setReports({
        summary: summaryRes.data,
        revenueTrend: revenueRes.data,
        ordersByCategory: ordersRes.data,
        bookingsByMonth: bookingsRes.data,
        userGrowth: usersRes.data,
      });
    } catch (error) {
      toast.error('Failed to fetch reports');
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.text('FoodServe Analytics Report', 20, 20);
    
    // Date range
    doc.setFontSize(12);
    doc.text(`Report Period: Last ${dateRange} days`, 20, 30);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 35);
    
    // Summary stats
    doc.setFontSize(16);
    doc.text('Summary Statistics', 20, 50);
    
    const summaryData = [
      ['Metric', 'Value'],
      ['Total Revenue', `$${reports.summary.totalRevenue || 0}`],
      ['Total Orders', reports.summary.totalOrders || 0],
      ['Total Bookings', reports.summary.totalBookings || 0],
      ['Total Users', reports.summary.totalUsers || 0],
      ['Active Users', reports.summary.activeUsers || 0],
    ];
    
    doc.autoTable({
      startY: 60,
      head: [summaryData[0]],
      body: summaryData.slice(1),
      theme: 'grid',
    });
    
    // Revenue trend
    if (reports.revenueTrend.length > 0) {
      doc.setFontSize(16);
      doc.text('Revenue Trend', 20, doc.lastAutoTable.finalY + 20);
      
      const revenueData = reports.revenueTrend.map(item => [
        item.date,
        `$${item.revenue}`,
        item.orders || 0
      ]);
      
      doc.autoTable({
        startY: doc.lastAutoTable.finalY + 30,
        head: [['Date', 'Revenue', 'Orders']],
        body: revenueData,
        theme: 'grid',
      });
    }
    
    doc.save(`foodserve-report-${dateRange}days.pdf`);
    toast.success('Report exported successfully');
  };

  const exportToExcel = () => {
    // Simple CSV export for now
    const csvData = [
      ['Metric', 'Value'],
      ['Total Revenue', `$${reports.summary.totalRevenue || 0}`],
      ['Total Orders', reports.summary.totalOrders || 0],
      ['Total Bookings', reports.summary.totalBookings || 0],
      ['Total Users', reports.summary.totalUsers || 0],
    ];
    
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `foodserve-report-${dateRange}days.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Report exported to CSV');
  };

  const stats = [
    {
      title: 'Total Revenue',
      value: `$${reports.summary.totalRevenue || 0}`,
      icon: <RevenueIcon />,
      color: 'bg-green-500',
      trend: '+12.5%',
    },
    {
      title: 'Total Orders',
      value: reports.summary.totalOrders || 0,
      icon: <OrdersIcon />,
      color: 'bg-blue-500',
      trend: '+8.2%',
    },
    {
      title: 'Total Bookings',
      value: reports.summary.totalBookings || 0,
      icon: <BookingsIcon />,
      color: 'bg-purple-500',
      trend: '+15.3%',
    },
    {
      title: 'Active Users',
      value: reports.summary.activeUsers || 0,
      icon: <UsersIcon />,
      color: 'bg-orange-500',
      trend: '+5.7%',
    },
  ];

  return (
    <Box className="space-y-6">
      {/* Header */}
      <Box className="flex justify-between items-center">
    <Box>
          <Typography variant="h4" className="font-bold text-slate-800 mb-2">
            Reports & Analytics
          </Typography>
          <Typography variant="body1" className="text-slate-600">
            Business insights and performance metrics
          </Typography>
        </Box>
        <Box className="flex space-x-3">
          <FormControl size="small" className="min-w-32">
            <InputLabel>Date Range</InputLabel>
            <Select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              label="Date Range"
            >
              <MenuItem value="7">Last 7 days</MenuItem>
              <MenuItem value="30">Last 30 days</MenuItem>
              <MenuItem value="90">Last 90 days</MenuItem>
              <MenuItem value="365">Last year</MenuItem>
        </Select>
          </FormControl>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={exportToExcel}
            className="border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            Export CSV
          </Button>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={exportToPDF}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Export PDF
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-6">
                  <Box className="flex items-center justify-between">
                    <Box>
                      <Typography variant="h4" className="font-bold text-slate-800">
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" className="text-slate-600">
                        {stat.title}
                      </Typography>
                      <Chip
                        icon={<TrendingUpIcon />}
                        label={stat.trend}
                        size="small"
                        color="success"
                        className="mt-2"
                      />
                    </Box>
                    <Box className={`p-3 rounded-full ${stat.color} text-white`}>
                      {stat.icon}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        {/* Revenue Trend */}
        <Grid item xs={12} lg={8}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <Typography variant="h6" className="font-semibold text-slate-800 mb-4">
                  Revenue Trend
                </Typography>
                <Box className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={reports.revenueTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <RechartsTooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#3B82F6"
                        fill="#3B82F6"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Orders by Category */}
        <Grid item xs={12} lg={4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <Typography variant="h6" className="font-semibold text-slate-800 mb-4">
                  Orders by Category
                </Typography>
                <Box className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={reports.ordersByCategory}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {reports.ordersByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Bookings by Month */}
        <Grid item xs={12} lg={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <Typography variant="h6" className="font-semibold text-slate-800 mb-4">
                  Bookings by Month
                </Typography>
                <Box className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={reports.bookingsByMonth}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <RechartsTooltip />
                      <Bar dataKey="bookings" fill="#8B5CF6" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* User Growth */}
        <Grid item xs={12} lg={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <Typography variant="h6" className="font-semibold text-slate-800 mb-4">
                  User Growth
                </Typography>
                <Box className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={reports.userGrowth}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <RechartsTooltip />
                      <Line
                        type="monotone"
                        dataKey="users"
                        stroke="#10B981"
                        strokeWidth={3}
                        dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
      </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Reports;