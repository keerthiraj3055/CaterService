import React, { useEffect, useMemo, useState } from 'react';
import { 
  Box, 
  Button, 
  IconButton, 
  Tooltip, 
  Card, 
  CardContent, 
  Typography, 
  Chip, 
  Alert,
  Avatar
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CategoryIcon from '@mui/icons-material/Category';
import axiosInstance from '../../api/axiosInstance';
import toast from 'react-hot-toast';
import MenuForm from '../components/MenuForm';

const MenuPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [error, setError] = useState(null);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/admin/menu');
      setItems(response.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to load menu items');
      toast.error('Failed to load menu items');
      console.error('Error loading menu items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      await axiosInstance.delete(`/api/admin/menu/${id}`);
      toast.success('Item deleted successfully');
      fetchItems();
    } catch (err) {
      toast.error('Failed to delete item');
      console.error('Error deleting item:', err);
    }
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setSelectedItem(null);
  };

  const handleFormSubmitted = () => {
    handleFormClose();
    fetchItems();
    toast.success(selectedItem ? 'Item updated successfully' : 'Item added successfully');
  };

  const columns = useMemo(() => [
    {
      field: 'image',
      headerName: '',
      width: 70,
      renderCell: (params) => (
        <Avatar
          src={params.value}
          variant="rounded"
          sx={{ width: 40, height: 40 }}
        >
          <RestaurantMenuIcon />
        </Avatar>
      ),
      sortable: false
    },
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      minWidth: 200
    },
    {
      field: 'category',
      headerName: 'Category',
      width: 150,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          icon={<CategoryIcon />}
        />
      )
    },
    {
      field: 'price',
      headerName: 'Price',
      width: 120,
      renderCell: (params) => (
        <Typography>
          ${Number(params.value).toFixed(2)}
        </Typography>
      )
    },
    {
      field: 'isAvailable',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value ? 'Available' : 'Unavailable'}
          color={params.value ? 'success' : 'default'}
          size="small"
          icon={params.value ? <CheckCircleIcon /> : null}
        />
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <Tooltip title="Edit">
            <IconButton 
              onClick={() => {
                setSelectedItem(params.row);
                setFormOpen(true);
              }}
              size="small"
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              onClick={() => handleDelete(params.row._id)}
              size="small"
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ], []);

  return (
    <Box>
      <Box 
        sx={{ 
          mb: 4, 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Typography variant="h4" sx={{ color: '#1E293B', fontWeight: 600 }}>
          Menu Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setSelectedItem(null);
            setFormOpen(true);
          }}
        >
          Add Item
        </Button>
      </Box>

      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      <Card elevation={0} sx={{ border: '1px solid #E6EEF8' }}>
        <CardContent>
          <Box sx={{ height: 'calc(100vh - 250px)', width: '100%' }}>
            <DataGrid
              rows={items}
              columns={columns}
              getRowId={(row) => row._id}
              loading={loading}
              pageSizeOptions={[10, 25, 50]}
              initialState={{
                pagination: { paginationModel: { pageSize: 10 } },
              }}
              disableRowSelectionOnClick
              sx={{
                border: 'none',
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: '#F8FAFC',
                  color: '#475569',
                  fontWeight: 600
                },
                '& .MuiDataGrid-row:hover': {
                  backgroundColor: '#F1F5F9'
                }
              }}
            />
          </Box>
        </CardContent>
      </Card>

      <MenuForm 
        open={formOpen}
        onClose={handleFormClose}
        onSubmitted={handleFormSubmitted}
        initial={selectedItem}
      />
    </Box>
  );
};

export default MenuPage;