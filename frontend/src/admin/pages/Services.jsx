import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  IconButton,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  FormControlLabel,
  Switch,
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import CategoryIcon from "@mui/icons-material/Category";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";

import toast from "react-hot-toast";
import axiosInstance from "../../api/axiosInstance";
import { motion } from "framer-motion";

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    basePrice: "",
    category: "",
    image: "",
    isActive: true,
  });

  const categories = [
    "Wedding Catering",
    "Corporate Events",
    "Birthday Parties",
    "Anniversary",
    "Graduation",
    "Holiday Events",
    "Custom Events",
  ];

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/services");
      setServices(response.data);
    } catch (error) {
      toast.error("Failed to fetch services");
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingService) {
        await axiosInstance.put(`/services/${editingService.id}`, formData);
        toast.success("Service updated successfully");
      } else {
        await axiosInstance.post("/services", formData);
        toast.success("Service created successfully");
      }
      setOpen(false);
      setEditingService(null);
      setFormData({
        name: "",
        description: "",
        basePrice: "",
        category: "",
        image: "",
        isActive: true,
      });
      fetchServices();
    } catch (error) {
      toast.error("Failed to save service");
      console.error("Error saving service:", error);
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      basePrice: service.basePrice,
      category: service.category,
      image: service.image,
      isActive: service.isActive,
    });
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        await axiosInstance.delete(`/services/${id}`);
        toast.success("Service deleted successfully");
        fetchServices();
      } catch (error) {
        toast.error("Failed to delete service");
        console.error("Error deleting service:", error);
      }
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await axiosInstance.post("/upload/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setFormData((prev) => ({ ...prev, image: response.data.url }));
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload image");
      console.error("Error uploading image:", error);
    }
  };

  const columns = [
    {
      field: "image",
      headerName: "Image",
      width: 100,
      renderCell: (params) => (
        <Avatar src={params.value} alt={params.row.name} sx={{ width: 40, height: 40 }} />
      ),
    },
    { field: "name", headerName: "Service Name", width: 200 },
    {
      field: "category",
      headerName: "Category",
      width: 150,
      renderCell: (params) => (
        <Chip label={params.value} size="small" color="primary" variant="outlined" />
      ),
    },
    {
      field: "basePrice",
      headerName: "Base Price",
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2" className="font-semibold text-green-600">
          ₹{params.value}
        </Typography>
      ),
    },
    {
      field: "isActive",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <Chip
          icon={params.value ? <CheckCircleIcon /> : <CancelIcon />}
          label={params.value ? "Active" : "Inactive"}
          color={params.value ? "success" : "error"}
          size="small"
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      renderCell: (params) => (
        <Box className="flex space-x-1">
          <IconButton size="small" onClick={() => handleEdit(params.row)}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon fontSize="small" color="error" />
          </IconButton>
        </Box>
      ),
    },
  ];

  const stats = [
    {
      title: "Total Services",
      value: services.length,
      icon: <RestaurantMenuIcon />,
      color: "bg-blue-500",
    },
    {
      title: "Active Services",
      value: services.filter((s) => s.isActive).length,
      icon: <CheckCircleIcon />,
      color: "bg-green-500",
    },
    {
      title: "Categories",
      value: [...new Set(services.map((s) => s.category))].length,
      icon: <CategoryIcon />,
      color: "bg-purple-500",
    },
    {
      title: "Avg. Price",
      value:
        services.length > 0
          ? `₹${Math.round(
              services.reduce((sum, s) => sum + s.basePrice, 0) / services.length
            )}`
          : "₹0",
      icon: <AttachMoneyIcon />,
      color: "bg-orange-500",
    },
  ];

  return (
    <Box className="space-y-6">
      {/* Header */}
      <Box className="flex justify-between items-center">
        <Box>
          <Typography variant="h4" className="font-bold text-slate-800 mb-2">
            Services Management
          </Typography>
          <Typography variant="body1" className="text-slate-600">
            Manage catering services and event packages
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
          Add Service
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <CardContent className="p-6 flex justify-between items-center">
                  <Box>
                    <Typography variant="h5" className="font-bold">
                      {stat.value}
                    </Typography>
                    <Typography variant="body2">{stat.title}</Typography>
                  </Box>
                  <Box className={`p-3 rounded-full text-white ${stat.color}`}>{stat.icon}</Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Data Table */}
      <Card>
        <CardContent className="p-0">
          <Box className="h-96">
            <DataGrid
              rows={services}
              columns={columns}
              loading={loading}
              pageSize={10}
              getRowId={(row) => row.id}
              sx={{
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#f8fafc",
                  borderBottom: "2px solid #e2e8f0",
                },
              }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editingService ? "Edit Service" : "Add New Service"}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Service Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    {categories.map((cat) => (
                      <MenuItem key={cat} value={cat}>
                        {cat}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Base Price"
                  type="number"
                  value={formData.basePrice}
                  onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <input type="file" accept="image/*" onChange={handleImageUpload} />
                {formData.image && (
                  <img
                    src={formData.image}
                    alt="Preview"
                    style={{ width: 80, height: 80, marginTop: 8, borderRadius: 8 }}
                  />
                )}
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isActive}
                      onChange={(e) =>
                        setFormData({ ...formData, isActive: e.target.checked })
                      }
                    />
                  }
                  label="Active"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="contained" type="submit">
              {editingService ? "Update" : "Create"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default ServicesPage;
