import React, { useState, useEffect } from 'react';
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
  TextField,
  Grid,
  Chip,
  IconButton,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  People as PeopleIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Work as WorkIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import toast from 'react-hot-toast';
import axiosInstance from '../../api/axiosInstance';

const Accounts = () => {
  const [users, setUsers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [corporates, setCorporates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    phone: '',
    address: '',
    companyName: '',
    gstNumber: '',
    specialization: '',
    isActive: true,
    permissions: [],
  });
  const allPermissions = [
    'manage_menu',
    'manage_orders',
    'manage_bookings',
    'manage_users',
    'view_reports',
    'assign_employees',
    'edit_event_types',
  ];

  const roles = [
    { value: 'user', label: 'User' },
    { value: 'employee', label: 'Employee' },
    { value: 'corporate', label: 'Corporate' },
    { value: 'admin', label: 'Admin' },
  ];

  const specializations = [
    'Chef',
    'Server',
    'Event Coordinator',
    'Manager',
    'Bartender',
    'Cleanup Staff',
  ];

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [usersRes, employeesRes, corporatesRes] = await Promise.all([
        axiosInstance.get('/users'),
        axiosInstance.get('/employees'),
        axiosInstance.get('/corporates'),
      ]);
      setUsers(usersRes.data);
      setEmployees(employeesRes.data);
      setCorporates(corporatesRes.data);
    } catch (error) {
      toast.error('Failed to fetch data');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await axiosInstance.put(`/users/${editingUser.id}`, formData);
        toast.success('User updated successfully');
      } else {
        await axiosInstance.post('/users', formData);
        toast.success('User created successfully');
      }
      setOpen(false);
      resetForm();
      fetchAllData();
    } catch (error) {
      toast.error('Failed to save user');
      console.error('Error saving user:', error);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      phone: user.phone || '',
      address: user.address || '',
      companyName: user.companyName || '',
      gstNumber: user.gstNumber || '',
      specialization: user.specialization || '',
      isActive: user.isActive,
      permissions: user.permissions || [],
    });
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axiosInstance.delete(`/users/${id}`);
        toast.success('User deleted successfully');
        fetchAllData();
      } catch (error) {
        toast.error('Failed to delete user');
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await axiosInstance.put(`/users/${id}/toggle-status`, {
        isActive: !currentStatus,
      });
      toast.success(`User ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      fetchAllData();
    } catch (error) {
      toast.error('Failed to update user status');
      console.error('Error updating user status:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'user',
      phone: '',
      address: '',
      companyName: '',
      gstNumber: '',
      specialization: '',
      isActive: true,
      permissions: [],
    });
    setEditingUser(null);
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'error';
      case 'employee':
        return 'warning';
      case 'corporate':
        return 'info';
      default:
        return 'success';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <PersonIcon />;
      case 'employee':
        return <WorkIcon />;
      case 'corporate':
        return <BusinessIcon />;
      default:
        return <PersonIcon />;
    }
  };

  const userColumns = [
    {
      field: 'avatar',
      headerName: 'Avatar',
      width: 80,
      renderCell: (params) => (
        <Avatar sx={{ width: 40, height: 40, bgcolor: '#3B82F6' }}>
          {params.row.name?.charAt(0) || 'U'}
        </Avatar>
      ),
    },
    {
      field: 'name',
      headerName: 'Name',
      width: 200,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2" className="font-medium">
            {params.value}
          </Typography>
          <Typography variant="caption" className="text-slate-500">
            {params.row.email}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'role',
      headerName: 'Role',
      width: 120,
      renderCell: (params) => (
        <Chip
          icon={getRoleIcon(params.value)}
          label={params.value.charAt(0).toUpperCase() + params.value.slice(1)}
          color={getRoleColor(params.value)}
          size="small"
        />
      ),
    },
    {
      field: 'phone',
      headerName: 'Phone',
      width: 150,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.value || 'N/A'}
        </Typography>
      ),
    },
    {
      field: 'isActive',
      headerName: 'Status',
      width: 100,
      renderCell: (params) => (
        <Chip
          icon={params.value ? <CheckCircleIcon /> : <CancelIcon />}
          label={params.value ? 'Active' : 'Inactive'}
          color={params.value ? 'success' : 'error'}
          size="small"
        />
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
            onClick={() => handleEdit(params.row)}
            className="text-blue-600 hover:bg-blue-50"
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleToggleStatus(params.row.id, params.row.isActive)}
            className={params.row.isActive ? "text-red-600 hover:bg-red-50" : "text-green-600 hover:bg-green-50"}
          >
            {params.row.isActive ? <CancelIcon fontSize="small" /> : <CheckCircleIcon fontSize="small" />}
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleDelete(params.row.id)}
            className="text-red-600 hover:bg-red-50"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  const employeeColumns = [
    ...userColumns.slice(0, 3),
    {
      field: 'specialization',
      headerName: 'Specialization',
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
    ...userColumns.slice(3),
  ];

  const corporateColumns = [
    ...userColumns.slice(0, 3),
    {
      field: 'companyName',
      headerName: 'Company',
      width: 200,
      renderCell: (params) => (
        <Typography variant="body2" className="font-medium">
          {params.value || 'N/A'}
        </Typography>
      ),
    },
    {
      field: 'gstNumber',
      headerName: 'GST Number',
      width: 150,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.value || 'N/A'}
        </Typography>
      ),
    },
    ...userColumns.slice(3),
  ];

  const stats = [
    {
      title: 'Total Users',
      value: users.length,
      icon: <PeopleIcon />,
      color: 'bg-blue-500',
    },
    {
      title: 'Employees',
      value: employees.length,
      icon: <WorkIcon />,
      color: 'bg-green-500',
    },
    {
      title: 'Corporate Clients',
      value: corporates.length,
      icon: <BusinessIcon />,
      color: 'bg-purple-500',
    },
    {
      title: 'Active Users',
      value: users.filter(u => u.isActive).length,
      icon: <CheckCircleIcon />,
      color: 'bg-orange-500',
    },
  ];

  const getCurrentData = () => {
    switch (activeTab) {
      case 0:
        return users;
      case 1:
        return employees;
      case 2:
        return corporates;
      default:
        return users;
    }
  };

  const getCurrentColumns = () => {
    switch (activeTab) {
      case 0:
        return userColumns;
      case 1:
        return employeeColumns;
      case 2:
        return corporateColumns;
      default:
        return userColumns;
    }
  };

  return (
    <Box className="space-y-6">
      {/* Header */}
      <Box className="flex justify-between items-center">
    <Box>
          <Typography variant="h4" className="font-bold text-slate-800 mb-2">
            User Management
          </Typography>
          <Typography variant="body1" className="text-slate-600">
            Manage users, employees, and corporate accounts
          </Typography>
        </Box>
          <Button 
            variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Add User
          </Button>
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

      {/* Tabs */}
      <Card className="shadow-lg">
        <Box className="border-b border-slate-200">
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            className="px-6"
          >
            <Tab label="All Users" />
            <Tab label="Employees" />
            <Tab label="Corporate Clients" />
          </Tabs>
        </Box>
        <CardContent className="p-0">
          <Box className="h-96">
            <DataGrid
              rows={getCurrentData()}
              columns={getCurrentColumns()}
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

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle className="text-xl font-semibold text-slate-800">
          {editingUser ? 'Edit User' : 'Add New User'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent className="space-y-4">
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
          <TextField 
            fullWidth 
                  label="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
              </Grid>
              <Grid item xs={12} md={6}>
            <TextField 
              fullWidth 
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
              </Grid>
              <Grid item xs={12} md={6}>
          <TextField 
            fullWidth 
                  label="Password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={!editingUser}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value, permissions: [] })}
                    label="Role"
                  >
                    {roles.map((role) => (
                      <MenuItem key={role.value} value={role.value}>
                        {role.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              {(formData.role === 'admin' || formData.role === 'employee') && (
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Permissions</InputLabel>
                    <Select
                      multiple
                      value={formData.permissions}
                      onChange={e => setFormData({ ...formData, permissions: e.target.value })}
                      label="Permissions"
                      renderValue={selected => selected.join(', ')}
                    >
                      {allPermissions.map((perm) => (
                        <MenuItem key={perm} value={perm}>
                          {perm.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}
              <Grid item xs={12} md={6}>
          <TextField 
                  fullWidth
            label="Phone" 
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
            fullWidth 
                  label="Address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />
              </Grid>
              {formData.role === 'corporate' && (
            <>
                  <Grid item xs={12} md={6}>
              <TextField 
                fullWidth 
                      label="Company Name"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              />
                  </Grid>
                  <Grid item xs={12} md={6}>
              <TextField 
                      fullWidth
                label="GST Number" 
                      value={formData.gstNumber}
                      onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
              />
                  </Grid>
            </>
          )}
              {formData.role === 'employee' && (
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Specialization</InputLabel>
          <Select 
                      value={formData.specialization}
                      onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                      label="Specialization"
                    >
                      {specializations.map((spec) => (
                        <MenuItem key={spec} value={spec}>
                          {spec}
                        </MenuItem>
                      ))}
          </Select>
                  </FormControl>
                </Grid>
              )}
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    />
                  }
                  label="Active User"
                />
              </Grid>
            </Grid>
        </DialogContent>
          <DialogActions className="p-6">
          <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" className="bg-blue-600 hover:bg-blue-700">
              {editingUser ? 'Update' : 'Create'} User
            </Button>
        </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Accounts;