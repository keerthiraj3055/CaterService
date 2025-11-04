import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Rating,
  Avatar,
  Stack,
  Chip,
  Alert,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import {
  Reviews as ReviewsIcon,
  Star as StarIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Person as PersonIcon,
  Event as EventIcon,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import toast from 'react-hot-toast';
import axiosInstance from '../../api/axiosInstance';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchReviews();
  }, [filterStatus]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/reviews?status=${filterStatus}`);
      setReviews(response.data);
    } catch (error) {
      toast.error('Failed to fetch reviews');
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (id) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await axiosInstance.delete(`/reviews/${id}`);
        toast.success('Review deleted successfully');
        fetchReviews();
      } catch (error) {
        toast.error('Failed to delete review');
        console.error('Error deleting review:', error);
      }
    }
  };

  const handleToggleFeatured = async (id, currentStatus) => {
    try {
      await axiosInstance.put(`/reviews/${id}/featured`, {
        isFeatured: !currentStatus,
      });
      toast.success(`Review ${!currentStatus ? 'featured' : 'unfeatured'} successfully`);
      fetchReviews();
    } catch (error) {
      toast.error('Failed to update review status');
      console.error('Error updating review:', error);
    }
  };

  const handleViewDetails = (review) => {
    setSelectedReview(review);
    setOpenDetails(true);
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return 'success';
    if (rating >= 3) return 'warning';
    return 'error';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const columns = [
    {
      field: 'user',
      headerName: 'Customer',
      width: 200,
      renderCell: (params) => (
        <Box className="flex items-center space-x-2">
          <Avatar sx={{ width: 32, height: 32, bgcolor: '#3B82F6' }}>
            {params.row.user?.name?.charAt(0) || 'U'}
          </Avatar>
          <Box>
            <Typography variant="body2" className="font-medium">
              {params.row.user?.name || 'Anonymous'}
            </Typography>
            <Typography variant="caption" className="text-slate-500">
              {params.row.user?.email}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: 'rating',
      headerName: 'Rating',
      width: 120,
      renderCell: (params) => (
        <Box className="flex items-center space-x-1">
          <Rating value={params.value} readOnly size="small" />
          <Typography variant="body2" className="text-slate-600">
            ({params.value})
          </Typography>
        </Box>
      ),
    },
    {
      field: 'comment',
      headerName: 'Review',
      width: 300,
      renderCell: (params) => (
        <Typography variant="body2" className="line-clamp-2">
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'eventType',
      headerName: 'Event Type',
      width: 150,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          color="primary"
          variant="outlined"
        />
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value.charAt(0).toUpperCase() + params.value.slice(1)}
          color={getStatusColor(params.value)}
          size="small"
        />
      ),
    },
    {
      field: 'isFeatured',
      headerName: 'Featured',
      width: 100,
      renderCell: (params) => (
        <Chip
          icon={params.value ? <StarIcon /> : <StarIcon />}
          label={params.value ? 'Yes' : 'No'}
          color={params.value ? 'warning' : 'default'}
          size="small"
        />
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Date',
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2">
          {new Date(params.value).toLocaleDateString()}
        </Typography>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Box className="flex space-x-1">
          <IconButton
            size="small"
            onClick={() => handleViewDetails(params.row)}
            className="text-blue-600 hover:bg-blue-50"
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleToggleFeatured(params.row.id, params.row.isFeatured)}
            className={params.row.isFeatured ? "text-yellow-600 hover:bg-yellow-50" : "text-gray-600 hover:bg-gray-50"}
          >
            <StarIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleDeleteReview(params.row.id)}
            className="text-red-600 hover:bg-red-50"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  const stats = [
    {
      title: 'Total Reviews',
      value: reviews.length,
      icon: <ReviewsIcon />,
      color: 'bg-blue-500',
    },
    {
      title: 'Average Rating',
      value: reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : '0.0',
      icon: <StarIcon />,
      color: 'bg-yellow-500',
    },
    {
      title: 'Featured Reviews',
      value: reviews.filter(r => r.isFeatured).length,
      icon: <ThumbUpIcon />,
      color: 'bg-green-500',
    },
    {
      title: 'Pending Reviews',
      value: reviews.filter(r => r.status === 'pending').length,
      icon: <EventIcon />,
      color: 'bg-orange-500',
    },
  ];

  return (
    <Box className="space-y-6">
      {/* Header */}
      <Box className="flex justify-between items-center">
        <Box>
          <Typography variant="h4" className="font-bold text-slate-800 mb-2">
            Reviews & Testimonials
          </Typography>
          <Typography variant="body1" className="text-slate-600">
            Manage customer reviews and testimonials
          </Typography>
        </Box>
        <FormControl size="small" className="min-w-32">
          <InputLabel>Filter Status</InputLabel>
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            label="Filter Status"
          >
            <MenuItem value="all">All Reviews</MenuItem>
            <MenuItem value="approved">Approved</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
            <MenuItem value="featured">Featured</MenuItem>
          </Select>
        </FormControl>
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

      {/* Reviews Table */}
      <Card className="shadow-lg">
        <CardContent className="p-0">
          <Box className="p-6 border-b border-slate-200">
            <Typography variant="h6" className="font-semibold text-slate-800">
              Customer Reviews
            </Typography>
          </Box>
          <Box className="h-96">
            <DataGrid
              rows={reviews}
              columns={columns}
              loading={loading}
              pageSize={10}
              rowsPerPageOptions={[10, 25, 50]}
              disableSelectionOnClick
              className="border-0"
              sx={{
                '& .MuiDataGrid-cell': {
                  borderBottom: '1px solid #f1f5f9',
                },
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: '#f8fafc',
                  borderBottom: '2px solid #e2e8f0',
                },
              }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Review Details Dialog */}
      <Dialog open={openDetails} onClose={() => setOpenDetails(false)} maxWidth="md" fullWidth>
        <DialogTitle className="text-xl font-semibold text-slate-800">
          Review Details
        </DialogTitle>
        <DialogContent>
          {selectedReview && (
            <Box className="space-y-4">
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" className="text-slate-600">Customer</Typography>
                  <Box className="flex items-center space-x-2 mt-1">
                    <Avatar sx={{ width: 40, height: 40, bgcolor: '#3B82F6' }}>
                      {selectedReview.user?.name?.charAt(0) || 'U'}
                    </Avatar>
                    <Box>
                      <Typography variant="body1" className="font-medium">
                        {selectedReview.user?.name || 'Anonymous'}
                      </Typography>
                      <Typography variant="body2" className="text-slate-500">
                        {selectedReview.user?.email}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" className="text-slate-600">Rating</Typography>
                  <Box className="flex items-center space-x-2 mt-1">
                    <Rating value={selectedReview.rating} readOnly />
                    <Typography variant="body1" className="font-medium">
                      {selectedReview.rating}/5
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" className="text-slate-600">Event Type</Typography>
                  <Chip
                    label={selectedReview.eventType}
                    color="primary"
                    variant="outlined"
                    className="mt-1"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" className="text-slate-600">Date</Typography>
                  <Typography variant="body1" className="mt-1">
                    {new Date(selectedReview.createdAt).toLocaleDateString()}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" className="text-slate-600">Review</Typography>
                  <Typography variant="body1" className="mt-1 bg-slate-50 p-4 rounded-lg">
                    {selectedReview.comment}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" className="text-slate-600">Status</Typography>
                  <Chip
                    label={selectedReview.status.charAt(0).toUpperCase() + selectedReview.status.slice(1)}
                    color={getStatusColor(selectedReview.status)}
                    className="mt-1"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" className="text-slate-600">Featured</Typography>
                  <Chip
                    icon={<StarIcon />}
                    label={selectedReview.isFeatured ? 'Yes' : 'No'}
                    color={selectedReview.isFeatured ? 'warning' : 'default'}
                    className="mt-1"
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions className="p-6">
          <Button onClick={() => setOpenDetails(false)}>Close</Button>
          {selectedReview && (
            <>
              <Button
                onClick={() => handleToggleFeatured(selectedReview.id, selectedReview.isFeatured)}
                variant="outlined"
                startIcon={<StarIcon />}
                className={selectedReview.isFeatured ? "border-yellow-600 text-yellow-600" : "border-gray-600 text-gray-600"}
              >
                {selectedReview.isFeatured ? 'Unfeature' : 'Feature'}
              </Button>
              <Button
                onClick={() => handleDeleteReview(selectedReview.id)}
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
              >
                Delete Review
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Reviews;