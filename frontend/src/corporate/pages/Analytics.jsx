import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import DownloadIcon from '@mui/icons-material/Download';
import axiosInstance from '../../api/axiosInstance';


const Analytics = () => {
  const [dateRange, setDateRange] = useState('last-6-months');
  const [analytics, setAnalytics] = useState({
    spendingOverTime: [],
    topServices: [],
    eventTypeDistribution: [],
    kpis: {},
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/corporate/analytics', {
        params: { dateRange },
      });
      setAnalytics(response.data || {
        spendingOverTime: [
          { month: 'Aug', amount: 45000 },
          { month: 'Sep', amount: 52000 },
          { month: 'Oct', amount: 48000 },
          { month: 'Nov', amount: 61000 },
          { month: 'Dec', amount: 55000 },
          { month: 'Jan', amount: 68000 },
        ],
        topServices: [
          { name: 'Corporate Lunch', value: 450000 },
          { name: 'Team Meeting', value: 320000 },
          { name: 'Conference', value: 280000 },
        ],
        eventTypeDistribution: [
          { name: 'Meal Plans', value: 65 },
          { name: 'One-time', value: 35 },
        ],
        kpis: {
          avgCostPerEvent: 55000,
          totalMealsServed: 12500,
          monthOverMonthGrowth: 12.5,
        },
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const handleExport = () => {
    // Export functionality would go here
    alert('Export feature coming soon!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading analytics...</div>
      </div>
    );
  }

  return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
          <h1 className="text-3xl font-bold text-[#0F172A] mb-2">Analytics & Reports</h1>
          <p className="text-gray-600">Data-driven insights for your corporate catering</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          >
            <option value="last-3-months">Last 3 Months</option>
            <option value="last-6-months">Last 6 Months</option>
            <option value="last-year">Last Year</option>
            <option value="custom">Custom Range</option>
          </select>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <DownloadIcon />
            Export
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-sm text-gray-600 mb-1">Avg. Cost per Event</p>
          <p className="text-3xl font-bold text-[#0F172A]">
            {formatCurrency(analytics.kpis.avgCostPerEvent)}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-sm text-gray-600 mb-1">Total Meals Served</p>
          <p className="text-3xl font-bold text-[#0F172A]">
            {analytics.kpis.totalMealsServed?.toLocaleString() || 0}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-sm text-gray-600 mb-1">MoM Growth</p>
          <p className="text-3xl font-bold text-green-600">
            +{analytics.kpis.monthOverMonthGrowth || 0}%
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spending Over Time */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-[#0F172A] mb-4">Spending Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.spendingOverTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#3B82F6"
                strokeWidth={2}
                name="Amount"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Services */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-[#0F172A] mb-4">Top Services Used</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.topServices}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
              <Bar dataKey="value" fill="#3B82F6" name="Amount" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Event Type Distribution */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-[#0F172A] mb-4">Event Type Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics.eventTypeDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {analytics.eventTypeDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      </div>
  );
};

export default Analytics;












