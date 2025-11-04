import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axiosInstance from '../../api/axiosInstance';

export default function BookingManager() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState('pending');
  const [openAssign, setOpenAssign] = useState(false);
  const [assignId, setAssignId] = useState('');
  const [employees, setEmployees] = useState([]);

  // ✅ Fetch bookings & employees
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [bookRes, empRes] = await Promise.all([
          axiosInstance.get('/bookings'),
          axiosInstance.get('/users/employees'), // assuming you have this route
        ]);
        setBookings(bookRes.data);
        setEmployees(empRes.data);
      } catch (err) {
        console.error('Error loading bookings or employees:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ✅ Open modal for updating status
  const handleOpen = (item) => {
    setSelected(item);
    setStatus(item?.status || 'pending');
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
    setSelected(null);
  };

  // ✅ Save updated status
  const handleSave = async () => {
    try {
      setLoading(true);
      await axiosInstance.patch(`/bookings/${selected._id}/status`, { status });
      const res = await axiosInstance.get('/bookings');
      setBookings(res.data);
    } catch (err) {
      console.error('Failed to update booking status:', err);
    } finally {
      setLoading(false);
      handleClose();
    }
  };

  // ✅ Assign employee modal
  const handleAssignOpen = (item) => {
    setSelected(item);
    setOpenAssign(true);
  };

  const handleAssignClose = () => {
    setOpenAssign(false);
    setAssignId('');
    setSelected(null);
  };

  const handleAssignSave = async () => {
    try {
      setLoading(true);
      await axiosInstance.patch(`/bookings/${selected._id}/assign`, {
        employeeId: assignId,
      });
      const res = await axiosInstance.get('/bookings');
      setBookings(res.data);
    } catch (err) {
      console.error('Failed to assign employee:', err);
    } finally {
      setLoading(false);
      handleAssignClose();
    }
  };

  return (
    <Box className="p-4">
      <Box className="flex justify-between items-center mb-4">
        <Typography variant="h5" className="font-bold">
          Bookings Management
        </Typography>
      </Box>

      <DataGrid
        autoHeight
        rows={bookings}
        columns={[
          { field: '_id', headerName: 'ID', flex: 1 },
          { field: 'userName', headerName: 'User', flex: 1, valueGetter: (params) => params.row.user?.name || 'N/A' },
          { field: 'eventType', headerName: 'Event', flex: 1 },
          { field: 'date', headerName: 'Date', flex: 1 },
          { field: 'status', headerName: 'Status', flex: 1 },
          { field: 'assignedEmployee', headerName: 'Assigned To', flex: 1, valueGetter: (params) => params.row.employee?.name || 'Unassigned' },
          {
            field: 'actions',
            headerName: 'Actions',
            flex: 1,
            renderCell: (params) => (
              <Box className="flex gap-2">
                <Button
                  size="small"
                  variant="outlined"
                  color="primary"
                  onClick={() => handleOpen(params.row)}
                >
                  Update Status
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  color="success"
                  onClick={() => handleAssignOpen(params.row)}
                >
                  Assign
                </Button>
              </Box>
            ),
          },
        ]}
        loading={loading}
        getRowId={(row) => row._id || row.id}
        pageSize={10}
      />

      {/* Update Booking Dialog */}
      <Dialog open={openModal} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle>Update Booking Status</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select value={status} label="Status" onChange={(e) => setStatus(e.target.value)}>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleSave}
            variant="contained"
            color="primary"
            disabled={loading}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Assign Employee Dialog */}
      <Dialog open={openAssign} onClose={handleAssignClose} maxWidth="xs" fullWidth>
        <DialogTitle>Assign Employee</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Employee</InputLabel>
            <Select value={assignId} label="Employee" onChange={(e) => setAssignId(e.target.value)}>
              {employees.map((emp) => (
                <MenuItem key={emp._id} value={emp._id}>
                  {emp.name} - {emp.specialization}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAssignClose}>Cancel</Button>
          <Button
            onClick={handleAssignSave}
            variant="contained"
            color="success"
            disabled={loading || !assignId}
          >
            Assign
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
