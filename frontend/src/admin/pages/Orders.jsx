import React, { useEffect, useMemo, useState } from 'react';
import { 
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, 
  Typography, IconButton, Tooltip, Card, CardContent, Chip, Alert, Grid,
  FormControl, InputLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { motion } from 'framer-motion';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import CancelIcon from '@mui/icons-material/Cancel';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import axiosInstance from '../../api/axiosInstance';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const OrdersPage = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState(null);
  const [statusEdit, setStatusEdit] = useState({ id: null, status: '' });
  const [error, setError] = useState(null);

  const fetchRows = () => {
    setLoading(true);
    axiosInstance.get('/orders')
      .then(r => setRows(r.data || []))
      .catch(err => {
        setError('Failed to load orders');
        toast.error('Failed to load orders');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { 
    fetchRows(); 
  }, []);

  const updateStatus = async () => {
    if (!statusEdit.id) return;
    
    try {
      await axiosInstance.put(`/orders/${statusEdit.id}/status`, { status: statusEdit.status });
      toast.success('Order status updated successfully');
      setStatusEdit({ id: null, status: '' });
      fetchRows();
    } catch (err) {
      toast.error('Failed to update order status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'confirmed': 
      case 'paid': return 'primary';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircleIcon />;
      case 'confirmed': 
      case 'paid': return <CheckCircleIcon />;
      case 'pending': return <PendingIcon />;
      case 'cancelled': return <CancelIcon />;
      default: return <PendingIcon />;
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Orders Report', 20, 20);
    
    const tableData = rows.map(row => [
      row._id?.substring(0, 8) || '',
      row.user?.name || row.userName || '—',
      `$${Number(row.total || 0).toFixed(2)}`,
      row.status || 'pending',
      new Date(row.createdAt).toLocaleDateString()
    ]);

    doc.autoTable({
      head: [['Order ID', 'User', 'Total', 'Status', 'Date']],
      body: tableData,
      startY: 30
    });

    doc.save('orders-report.pdf');
    toast.success('Orders report exported successfully');
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Order ID', 'User', 'Total', 'Status', 'Date'],
      ...rows.map(row => [
        row._id?.substring(0, 8) || '',
        row.user?.name || row.userName || '—',
        `$${Number(row.total || 0).toFixed(2)}`,
        row.status || 'pending',
        new Date(row.createdAt).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'orders-report.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Orders report exported successfully');
  };

  const columns = useMemo(() => ([
    { 
      field: '_id', 
      headerName: 'Order ID', 
      flex: 1, 
      minWidth: 160,
      renderCell: (p) => (
        <Typography variant="body2" className="font-mono text-blue-600">
          #{p.value?.substring(0, 8)}
        </Typography>
      )
    },
    { 
      field: 'user', 
      headerName: 'User', 
      flex: 1, 
      minWidth: 150,
      valueGetter: (p) => p.row.user?.name || p.row.userName || '—',
      renderCell: (p) => (
        <Typography variant="body2" className="font-medium">
          {p.value}
        </Typography>
      )
    },
    { 
      field: 'total', 
      headerName: 'Total', 
      width: 120,
      renderCell: (p) => (
        <Typography variant="body2" className="font-semibold text-green-600">
          ${Number(p.value || 0).toFixed(2)}
        </Typography>
      )
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 150,
      renderCell: (p) => (
        <Chip 
          icon={getStatusIcon(p.value)}
          label={p.value?.charAt(0).toUpperCase() + p.value?.slice(1)}
          color={getStatusColor(p.value)}
          size="small"
          variant="filled"
        />
      )
    },
    { 
      field: 'createdAt', 
      headerName: 'Date', 
      width: 180,
      renderCell: (p) => (
        <Typography variant="body2" className="text-gray-600">
          {new Date(p.value).toLocaleDateString()}
        </Typography>
      )
    },
    { 
      field: 'actions', 
      headerName: 'Actions', 
      sortable: false, 
      width: 200, 
      renderCell: (p) => (
        <Box className="flex gap-2 items-center">
          <Tooltip title="View Details">
            <IconButton 
              size="small" 
              onClick={() => setDetails(p.row)}
              className="text-blue-600 hover:bg-blue-50"
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              value={p.row.status || 'pending'}
              onChange={(e) => {
                setStatusEdit({ id: p.row._id, status: e.target.value });
                setTimeout(updateStatus, 100);
              }}
              displayEmpty
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="confirmed">Confirmed</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
        </Box>
      )
    }
  ]), [statusEdit]);

  return (
    <Box className="p-6 bg-[#F8FAFC] min-h-screen">
      {/* Header */}
      <Box className="mb-6">
        <Typography variant="h4" className="text-[#1E293B] font-semibold mb-2">
          Orders Management
        </Typography>
        <Typography variant="body1" className="text-gray-600">
          View and manage all customer orders with status updates.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} className="mb-6">
        <Grid item xs={12} sm={6} md={3}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-white shadow-lg rounded-xl border-0">
              <CardContent className="p-6">
                <Box className="flex items-center justify-between">
                  <Box>
                    <Typography variant="subtitle2" className="text-gray-600 mb-1">
                      Total Orders
                    </Typography>
                    <Typography variant="h4" className="text-[#1E293B] font-bold">
                      {rows.length}
                    </Typography>
                  </Box>
                  <Box className="bg-blue-100 p-3 rounded-full">
                    <ShoppingCartIcon className="text-blue-600" />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-white shadow-lg rounded-xl border-0">
              <CardContent className="p-6">
                <Box className="flex items-center justify-between">
                  <Box>
                    <Typography variant="subtitle2" className="text-gray-600 mb-1">
                      Completed Orders
                    </Typography>
                    <Typography variant="h4" className="text-[#1E293B] font-bold">
                      {rows.filter(order => order.status === 'completed').length}
                    </Typography>
                  </Box>
                  <Box className="bg-green-100 p-3 rounded-full">
                    <CheckCircleIcon className="text-green-600" />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-white shadow-lg rounded-xl border-0">
              <CardContent className="p-6">
                <Box className="flex items-center justify-between">
                  <Box>
                    <Typography variant="subtitle2" className="text-gray-600 mb-1">
                      Pending Orders
                    </Typography>
                    <Typography variant="h4" className="text-[#1E293B] font-bold">
                      {rows.filter(order => order.status === 'pending').length}
                    </Typography>
                  </Box>
                  <Box className="bg-yellow-100 p-3 rounded-full">
                    <PendingIcon className="text-yellow-600" />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-white shadow-lg rounded-xl border-0">
              <CardContent className="p-6">
                <Box className="flex items-center justify-between">
                  <Box>
                    <Typography variant="subtitle2" className="text-gray-600 mb-1">
                      Total Revenue
                    </Typography>
                    <Typography variant="h4" className="text-[#1E293B] font-bold">
                      ${rows.reduce((sum, order) => sum + (order.total || 0), 0).toFixed(2)}
                    </Typography>
                  </Box>
                  <Box className="bg-purple-100 p-3 rounded-full">
                    <AttachMoneyIcon className="text-purple-600" />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Data Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="bg-white shadow-lg rounded-xl border-0">
          <CardContent className="p-6">
            <Box className="flex justify-between items-center mb-4">
              <Typography variant="h6" className="text-[#1E293B] font-semibold">
                All Orders
              </Typography>
              <Box className="flex gap-2">
                <Button 
                  variant="outlined" 
                  startIcon={<DownloadIcon />} 
                  onClick={exportToCSV}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg px-4 py-2"
                >
                  Export CSV
                </Button>
                <Button 
                  variant="contained" 
                  startIcon={<DownloadIcon />} 
                  onClick={exportToPDF}
                  className="bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-lg px-4 py-2"
                >
                  Export PDF
                </Button>
              </Box>
            </Box>
            
            {error && (
              <Alert severity="error" className="mb-4">
                {error}
              </Alert>
            )}
            
            <DataGrid 
              autoHeight 
              loading={loading} 
              rows={rows} 
              columns={columns} 
              pageSize={10} 
              getRowId={(r) => r._id || r.id}
              className="border-0"
              sx={{
                '& .MuiDataGrid-root': {
                  border: 'none',
                },
                '& .MuiDataGrid-cell': {
                  borderBottom: '1px solid #f1f5f9',
                },
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: '#f8fafc',
                  borderBottom: '2px solid #e2e8f0',
                },
              }}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Order Details Dialog */}
      <Dialog 
        open={!!details} 
        onClose={() => setDetails(null)} 
        fullWidth 
        maxWidth="md"
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle className="text-[#1E293B] font-semibold text-xl">
          Order Details
        </DialogTitle>
        <DialogContent className="pt-4">
          {details && (
            <Box>
              <Grid container spacing={3} className="mb-4">
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" className="text-gray-600 mb-1">Order ID</Typography>
                  <Typography variant="body1" className="font-mono text-blue-600">
                    #{details._id?.substring(0, 8)}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" className="text-gray-600 mb-1">Customer</Typography>
                  <Typography variant="body1" className="font-medium">
                    {details.user?.name || details.userName || '—'}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" className="text-gray-600 mb-1">Total Amount</Typography>
                  <Typography variant="h6" className="font-semibold text-green-600">
                    ${Number(details.total || 0).toFixed(2)}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" className="text-gray-600 mb-1">Status</Typography>
                  <Chip 
                    icon={getStatusIcon(details.status)}
                    label={details.status?.charAt(0).toUpperCase() + details.status?.slice(1)}
                    color={getStatusColor(details.status)}
                    size="small"
                    variant="filled"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" className="text-gray-600 mb-1">Order Date</Typography>
                  <Typography variant="body1">
                    {new Date(details.createdAt).toLocaleDateString()}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" className="text-gray-600 mb-1">Payment Method</Typography>
                  <Typography variant="body1">
                    {details.paymentMethod || 'Not specified'}
                  </Typography>
                </Grid>
              </Grid>
              
              <Typography variant="h6" className="text-[#1E293B] font-semibold mb-3">
                Order Items
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell className="font-semibold">Item</TableCell>
                      <TableCell className="font-semibold">Quantity</TableCell>
                      <TableCell className="font-semibold">Price</TableCell>
                      <TableCell className="font-semibold">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(details.items || []).map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">
                          {item.menuItem?.name || item.menuItem || 'Unknown Item'}
                        </TableCell>
                        <TableCell>{item.quantity || 1}</TableCell>
                        <TableCell>${Number(item.price || 0).toFixed(2)}</TableCell>
                        <TableCell className="font-semibold text-green-600">
                          ${Number((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </DialogContent>
        <DialogActions className="p-6 pt-0">
          <Button 
            onClick={() => setDetails(null)}
            className="text-gray-600 hover:bg-gray-50 rounded-lg px-6 py-2"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrdersPage;




