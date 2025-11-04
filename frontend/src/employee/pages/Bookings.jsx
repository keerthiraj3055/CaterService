import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import axiosInstance from '../../api/axiosInstance';
import EventDetailsDrawer from '../components/EventDetailsDrawer';
import Toast from '../components/Toast';
import { DataGridSkeleton } from '../../admin/components/LoadingSkeleton';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/employee/bookings');
      setBookings(response.data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      // Mock data for demo
      setBookings([
        {
          _id: '1',
          bookingId: 'BK001',
          eventType: 'Wedding',
          eventDate: '2024-01-15',
          location: 'Grand Hotel, Downtown',
          clientName: 'John & Jane Doe',
          status: 'in-progress',
        },
        {
          _id: '2',
          bookingId: 'BK002',
          eventType: 'Corporate',
          eventDate: '2024-01-18',
          location: 'Conference Center',
          clientName: 'ABC Corporation',
          status: 'pending',
        },
        {
          _id: '3',
          bookingId: 'BK003',
          eventType: 'Birthday',
          eventDate: '2024-01-20',
          location: 'Community Hall',
          clientName: 'Sarah Johnson',
          status: 'completed',
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

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      await axiosInstance.patch(`/employee/bookings/${bookingId}/status`, {
        status: newStatus,
      });
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status: newStatus } : b))
      );
      setToast({ message: 'Status updated successfully', type: 'success' });
    } catch (error) {
      console.error('Error updating status:', error);
      // Optimistic update for demo
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status: newStatus } : b))
      );
      setToast({ message: 'Status update failed (shown as updated)', type: 'info' });
    }
  };

  const getStatusChip = (status) => {
    const statusMap = {
      pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
      'in-progress': { label: 'In Progress', color: 'bg-blue-100 text-blue-700 border-blue-300' },
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
      flex: 1.5,
      headerClassName: 'font-semibold',
    },
    {
      field: 'clientName',
      headerName: 'Client Name',
      flex: 1.2,
      headerClassName: 'font-semibold',
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
              className="flex items-center gap-1 px-3 py-1.5 bg-[#2563EB] text-white rounded-lg hover:bg-[#1e51d3] transition-colors text-sm font-medium"
            >
              <VisibilityIcon fontSize="small" />
              View Details
            </button>
            {booking.status !== 'completed' && booking.status !== 'cancelled' && (
              <select
                value={booking.status}
                onChange={(e) => handleStatusUpdate(booking._id, e.target.value)}
                className="px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
              </select>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div>
        <h1 className="text-3xl font-bold text-[#1E293B] mb-2">Assigned Bookings</h1>
        <p className="text-gray-600">Manage and update your assigned events</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        {loading ? (
          <div className="p-4"><DataGridSkeleton /></div>
        ) : (
          <DataGrid
            rows={bookings}
            columns={columns}
            getRowId={(row) => row._id || row.id}
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
        )}
      </div>

      {/* Event Details Drawer */}
      <EventDetailsDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        booking={selectedBooking}
        onStatusUpdate={handleStatusUpdate}
        onNotify={(msg, type = 'success') => setToast({ message: msg, type })}
      />
    </div>
  );
};

export default Bookings;


