import React, { useEffect, useState } from 'react';
import {
  Box, // ✅ added
  Card,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axiosInstance from '../../api/axiosInstance';

export default function OrdersManager() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState('pending');

  // ✅ Fetch all orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get('/orders', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setOrders(res.data);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // ✅ Open modal
  const handleOpen = (item) => {
    setSelected(item);
    setStatus(item?.status || 'pending');
    setOpenModal(true);
  };

  // ✅ Close modal
  const handleClose = () => {
    setOpenModal(false);
    setSelected(null);
  };

  // ✅ Save updated status
  const handleSave = async () => {
    if (!selected) return;
    try {
      setLoading(true);
      // PATCH endpoint for updating order status (assuming /orders/:id)
      await axiosInstance.patch(
        `/orders/${selected._id}`,
        { status },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      // Refetch orders
      const res = await axiosInstance.get('/orders', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setOrders(res.data);
    } catch (err) {
      console.error('Failed to update order status:', err);
    } finally {
      setLoading(false);
      handleClose();
    }
  };

  return (
    <Box className="p-4">
      <Box className="flex justify-between items-center mb-4">
        <Typography variant="h5" className="font-bold">
          Orders Management
        </Typography>
      </Box>

      <DataGrid
        autoHeight
        rows={orders}
        columns={[
          { field: '_id', headerName: 'ID', flex: 1 },
          { field: 'user', headerName: 'User', flex: 1 },
          { field: 'status', headerName: 'Status', flex: 1 },
          { field: 'total', headerName: 'Total', flex: 1 },
          {
            field: 'actions',
            headerName: 'Actions',
            flex: 1,
            renderCell: (params) => (
              <Button
                size="small"
                variant="outlined"
                onClick={() => handleOpen(params.row)}
              >
                Update Status
              </Button>
            ),
          },
        ]}
        loading={loading}
        getRowId={(row) => row._id || row.id}
        pageSize={10}
      />

      {/* ✅ Update Status Dialog */}
      <Dialog open={openModal} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle>Update Order Status</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              value={status}
              label="Status"
              onChange={(e) => setStatus(e.target.value)}
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
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
    </Box>
  );
}
