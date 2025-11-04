import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add';
import axiosInstance from '../../api/axiosInstance';
import BookingDetailsDrawer from '../components/BookingDetailsDrawer';
import BookingFormModal from '../components/BookingFormModal';


import { Snackbar, Alert } from '@mui/material';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/corporate/bookings');
      setBookings(response.data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setSnackbar({ open: true, message: 'Failed to fetch bookings', severity: 'error' });
      // Mock data for demo
      setBookings([
        {
          _id: '1',
          bookingId: 'CORP001',
          eventType: 'Corporate Lunch',
          eventDate: '2024-01-20',
          status: 'confirmed',
          employees: 150,
          totalCost: 75000,
          location: 'Conference Hall A',
        },
        {
          _id: '2',
          bookingId: 'CORP002',
          eventType: 'Team Meeting',
          eventDate: '2024-01-25',
          status: 'pending',
          employees: 50,
          totalCost: 25000,
          location: 'Meeting Room B',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setDrawerOpen(true);
  };

  const handleReschedule = (booking) => {
    setSelectedBooking(booking);
    setFormModalOpen(true);
  };

  const handleCancel = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await axiosInstance.patch(`/corporate/bookings/${bookingId}/cancel`);
        setBookings((prev) => prev.filter((b) => b._id !== bookingId));
        setSnackbar({ open: true, message: 'Booking cancelled successfully', severity: 'success' });
      } catch (error) {
        console.error('Error cancelling booking:', error);
        setSnackbar({ open: true, message: 'Failed to cancel booking', severity: 'error' });
      }
    }
  };

  const handleRequestCustomization = (booking) => {
    // Navigate to chat with booking context
    window.location.href = `/corporate/chat?booking=${booking._id}`;
  };

  const getStatusChip = (status) => {
    const statusMap = {
      pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
      confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-700 border-blue-300' },
      completed: { label: 'Completed', color: 'bg-green-100 text-green-700 border-green-300' },
      cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700 border-red-300' },
    };

    const statusInfo = statusMap[status] || statusMap.pending;

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium border ${statusInfo.color}`}
      >
        {statusInfo.label}
      </span>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const columns = [
    {
      field: 'bookingId',
      headerName: 'Booking ID',
      flex: 0.8,
      headerClassName: 'font-semibold',
    },
    {
      field: 'eventType',
      headerName: 'Event Type',
      flex: 1,
      headerClassName: 'font-semibold',
    },
    {
      field: 'eventDate',
      headerName: 'Date',
      flex: 1,
      headerClassName: 'font-semibold',
      valueFormatter: (params) => {
        if (!params.value) return '';
        return new Date(params.value).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
      },
    },
    {
      field: 'location',
      headerName: 'Location',
      flex: 1.2,
      headerClassName: 'font-semibold',
    },
    {
      field: 'employees',
      headerName: 'Employees',
      flex: 0.8,
      headerClassName: 'font-semibold',
      valueFormatter: (params) => params.value || 'N/A',
    },
    {
      field: 'totalCost',
      headerName: 'Total Cost',
      flex: 1,
      headerClassName: 'font-semibold',
      valueFormatter: (params) => formatCurrency(params.value || 0),
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      headerClassName: 'font-semibold',
      renderCell: (params) => getStatusChip(params.value),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1.5,
      headerClassName: 'font-semibold',
      sortable: false,
      renderCell: (params) => {
        const booking = params.row;
        return (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleViewDetails(booking)}
              className="flex items-center gap-1 px-3 py-1.5 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-colors text-sm font-medium"
            >
              <VisibilityIcon fontSize="small" />
              View
            </button>
            {booking.status !== 'completed' && booking.status !== 'cancelled' && (
              <>
                <button
                  onClick={() => handleReschedule(booking)}
                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Reschedule"
                >
                  <EditIcon fontSize="small" />
                </button>
                <button
                  onClick={() => handleCancel(booking._id)}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Cancel"
                >
                  <CancelIcon fontSize="small" />
                </button>
              </>
            )}
          </div>
        );
      },
    },
  ];

  return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
          <h1 className="text-3xl font-bold text-[#0F172A] mb-2">Manage Bookings</h1>
          <p className="text-gray-600">Track and manage your corporate events</p>
        </div>
        <button
          onClick={() => setFormModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-colors font-medium shadow-sm"
        >
          <AddIcon />
          New Booking
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <DataGrid
          rows={bookings}
          columns={columns}
          getRowId={(row) => row._id || row.id}
          loading={loading}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          sx={{
            border: 'none',
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid #f1f5f9',
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f8fafc',
              borderBottom: '2px solid #e2e8f0',
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: '#f8fafc',
            },
          }}
        />
      </div>

      {/* Booking Details Drawer */}
      <BookingDetailsDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        booking={selectedBooking}
        onRequestCustomization={handleRequestCustomization}
      />

      {/* Booking Form Modal */}
      <BookingFormModal
        open={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        onSuccess={() => {
          setFormModalOpen(false);
          fetchBookings();
        }}
        booking={null}
      />
        <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </div>
  );
};

export default Bookings;












