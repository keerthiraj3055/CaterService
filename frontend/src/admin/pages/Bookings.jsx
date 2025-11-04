import React, { useState, useEffect } from "react";
import { motion } from 'framer-motion';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Chip,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  useTheme,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Snackbar,
  Alert,
  Tooltip,
} from '@mui/material';
import { 
  Check as CheckIcon,
  Close as CloseIcon,
  Visibility as ViewIcon,
  Assignment as AssignIcon 
} from '@mui/icons-material';
import {
  Event as BookingsIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as AttachMoneyIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import toast from 'react-hot-toast';
import axiosInstance from '../../api/axiosInstance';

const Bookings = () => {
  const theme = useTheme();
  const [bookings, setBookings] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDetails, setOpenDetails] = useState(false);
  const [openAssign, setOpenAssign] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchBookings();
    fetchEmployees();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/bookings');
      setBookings(response.data);
    } catch (error) {
      toast.error('Failed to fetch bookings');
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axiosInstance.get('/employees');
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleStatusUpdate = async (bookingId, status) => {
    try {
      await axiosInstance.put(`/bookings/${bookingId}/status`, { status });
      setSnackbar({ open: true, message: `Booking ${status} successfully`, severity: 'success' });
      fetchBookings();
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to update booking status', severity: 'error' });
      console.error('Error updating booking:', error);
    }
  };

  const handleAssignEmployee = async () => {
    if (!selectedEmployee || !selectedBooking) return;
    
    try {
      await axiosInstance.put(`/bookings/${selectedBooking._id}/assign`, {
        employeeId: selectedEmployee,
      });
      toast.success('Employee assigned successfully');
      setOpenAssign(false);
      setSelectedEmployee('');
      fetchBookings();
    } catch (error) {
      toast.error('Failed to assign employee');
      console.error('Error assigning employee:', error);
    }
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setOpenDetails(true);
  };

  const handleAssignClick = (booking) => {
    setSelectedBooking(booking);
    setOpenAssign(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const stats = [
    {
      title: 'Total Bookings',
      value: bookings.length,
      icon: <BookingsIcon />,
      color: 'bg-blue-500',
    },
    {
      title: 'Pending',
      value: bookings.filter(b => b.status === 'pending').length,
      icon: <PendingIcon />,
      color: 'bg-yellow-500',
    },
    {
      title: 'Approved',
      value: bookings.filter(b => b.status === 'approved').length,
      icon: <CheckCircleIcon />,
      color: 'bg-green-500',
    },
    {
      title: 'Total Revenue',
      value: `₹${bookings.reduce((sum, b) => sum + b.totalAmount, 0)}`,
      icon: <AttachMoneyIcon />,
      color: 'bg-purple-500',
    },
  ];

  const columns = [
    {
      field: 'user',
      headerName: 'Customer',
      flex: 2,
      minWidth: 250,
      renderCell: (params) => (
        <Box className="flex items-center gap-3">
          <Avatar sx={{ 
            width: 40, 
            height: 40, 
            bgcolor: '#3B82F6',
            fontSize: '1rem',
            fontWeight: 500 
          }}>
            {params.row.user?.name?.charAt(0) || 'U'}
          </Avatar>
          <Box>
            <Typography variant="body2" className="font-semibold text-slate-800">
              {params.row.user?.name || 'Unknown'}
            </Typography>
            <Typography variant="caption" className="text-slate-500">
              {params.row.user?.email}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: 'eventType',
      headerName: 'Event Type',
      flex: 1,
      minWidth: 130,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          color="primary"
          variant="outlined"
          sx={{ 
            borderRadius: '6px',
            '& .MuiChip-label': { 
              px: 2,
              py: 0.5
            }
          }}
        />
      ),
    },
    {
      field: 'eventDate',
      headerName: 'Event Date',
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <Typography variant="body2" className="font-medium">
          {new Date(params.value).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </Typography>
      ),
    },
    {
      field: 'totalAmount',
      headerName: 'Total Amount',
      flex: 1,
      minWidth: 120,
      renderCell: (params) => {
        const amount = params.value || 0;
        return (
          <Typography variant="body2" className="font-semibold text-green-600">
            ₹{amount.toLocaleString('en-IN')}
          </Typography>
        );
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      minWidth: 120,
      renderCell: (params) => {
        const statusConfig = {
          approved: { color: 'success', label: 'Approved', icon: <CheckCircleIcon /> },
          pending: { color: 'warning', label: 'Pending', icon: <PendingIcon /> },
          rejected: { color: 'error', label: 'Rejected', icon: <CancelIcon /> }
        };
        const status = statusConfig[params.value] || statusConfig.pending;
        
        return (
          <Chip
            icon={status.icon}
            label={status.label}
            color={status.color}
            size="small"
            sx={{
              minWidth: '90px',
              borderRadius: '6px',
              '& .MuiChip-label': { 
                px: 1,
                fontWeight: 500
              }
            }}
          />
        );
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1.5,
      minWidth: 220,
      renderCell: (params) => (
        <Box className="flex items-center gap-2">
          <Tooltip title="View Details">
            <Button
              size="small"
              variant="outlined"
              onClick={() => handleViewDetails(params.row)}
              startIcon={<ViewIcon />}
              sx={{
                borderRadius: '6px',
                minWidth: 'auto',
                px: 1.5,
                borderColor: 'primary.main',
                color: 'primary.main',
                '&:hover': {
                  borderColor: 'primary.dark',
                  bgcolor: 'primary.50',
                }
              }}
            >
              View
            </Button>
          </Tooltip>
          {params.row.status === 'pending' && (
            <Box className="flex items-center gap-2">
              <Tooltip title="Approve Booking">
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<CheckIcon />}
                  onClick={() => handleStatusUpdate(params.row._id, 'approved')}
                  sx={{
                    borderRadius: '6px',
                    minWidth: 'auto',
                    px: 1.5,
                    bgcolor: 'success.main',
                    '&:hover': {
                      bgcolor: 'success.dark',
                    }
                  }}
                >
                  Approve
                </Button>
              </Tooltip>
              <Tooltip title="Reject Booking">
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<CloseIcon />}
                  onClick={() => handleStatusUpdate(params.row._id, 'rejected')}
                  sx={{
                    borderRadius: '6px',
                    minWidth: 'auto',
                    px: 1.5,
                    bgcolor: 'error.main',
                    '&:hover': {
                      bgcolor: 'error.dark',
                    }
                  }}
                >
                  Reject
                </Button>
              </Tooltip>
            </Box>
          )}
          {params.row.status === 'approved' && !params.row.assignedEmployee && (
            <Tooltip title="Assign Employee">
              <Button
                size="small"
                variant="outlined"
                startIcon={<AssignIcon />}
                onClick={() => handleAssignClick(params.row)}
                sx={{
                  borderRadius: '6px',
                  minWidth: 'auto',
                  px: 1.5,
                  borderColor: 'info.main',
                  color: 'info.main',
                  '&:hover': {
                    borderColor: 'info.dark',
                    bgcolor: 'info.50',
                  }
                }}
              >
                Assign
              </Button>
            </Tooltip>
          )}
        </Box>
      ),
    },
  ];

  return (
    <Box className="space-y-6 p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <Box className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-0">
        <Box>
          <Typography variant="h4" className="font-bold text-slate-800 mb-2">
            Bookings Management
          </Typography>
          <Typography variant="body1" className="text-slate-600">
            Manage event bookings and employee assignments
          </Typography>
        </Box>
      </Box>

      {/* Stats */}
      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                elevation={0}
                className="hover:shadow-lg transition-shadow duration-200"
                sx={{ borderRadius: 2 }}
              >
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

      {/* Data Grid */}
      <Card 
        elevation={0} 
        className="shadow-lg"
        sx={{
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        <CardContent className="p-0">
          <Box className="p-6 border-b border-slate-200 bg-white">
            <Typography variant="h5" className="font-bold text-slate-800">
              All Bookings
            </Typography>
          </Box>
          <DataGrid
            rows={bookings}
            columns={columns}
            loading={loading}
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50]}
            disableSelectionOnClick
            autoHeight
            sx={{
              border: 'none',
              backgroundColor: 'white',
              '& .MuiDataGrid-main': { 
                borderRadius: 2,
                overflow: 'hidden'
              },
              '& .MuiDataGrid-cell': {
                borderBottom: '1px solid #f1f5f9',
                py: 2,
                '&:focus': {
                  outline: 'none',
                },
              },
              '& .MuiDataGrid-columnHeaders': {
                bgcolor: '#f8fafc',
                borderBottom: '2px solid #e2e8f0',
                color: '#1e293b',
                fontWeight: 600,
                '& .MuiDataGrid-columnHeader:focus': {
                  outline: 'none'
                }
              },
              '& .MuiDataGrid-row': {
                '&:hover': {
                  bgcolor: '#f8fafc',
                },
                '&:last-child': {
                  '& .MuiDataGrid-cell': {
                    borderBottom: 'none'
                  }
                }
              },
              '& .MuiDataGrid-cellContent': {
                whiteSpace: 'normal',
                lineHeight: 1.5
              },
              '& .MuiDataGrid-footerContainer': {
                borderTop: '2px solid #e2e8f0',
                bgcolor: '#fff'
              },
              '& .MuiTablePagination-root': {
                color: '#475569'
              }
            }}
            getRowId={row => row._id}
          />
        </CardContent>
      </Card>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ 
            width: '100%',
            borderRadius: 2
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Booking Details Dialog */}
      <Dialog 
        open={openDetails} 
        onClose={() => setOpenDetails(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          elevation: 0,
          sx: {
            borderRadius: 2
          }
        }}
      >
        <DialogTitle>
          <Typography variant="h6" className="font-bold text-slate-800">
            Booking Details
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <Box className="space-y-4 py-4">
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" className="text-slate-600">
                    Customer
                  </Typography>
                  <Typography variant="body1" className="font-medium">
                    {selectedBooking.user?.name}
                  </Typography>
                  <Typography variant="body2" className="text-slate-500">
                    {selectedBooking.user?.email}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" className="text-slate-600">
                    Event Type
                  </Typography>
                  <Typography variant="body1" className="font-medium">
                    {selectedBooking.eventType}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetails(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Assign Employee Dialog */}
      <Dialog 
        open={openAssign} 
        onClose={() => setOpenAssign(false)}
        PaperProps={{
          elevation: 0,
          sx: {
            borderRadius: 2
          }
        }}
      >
        <DialogTitle>
          <Typography variant="h6" className="font-bold text-slate-800">
            Assign Employee
          </Typography>
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Select Employee</InputLabel>
            <Select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              label="Select Employee"
            >
              {employees.map((employee) => (
                <MenuItem key={employee.id} value={employee.id}>
                  {employee.name} - {employee.specialization}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAssign(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleAssignEmployee}
            variant="contained"
            disabled={!selectedEmployee}
            sx={{
              bgcolor: 'primary.main',
              '&:hover': {
                bgcolor: 'primary.dark',
              },
            }}
          >
            Assign
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Bookings;