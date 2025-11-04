import React, { useState, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  Grid,
  MenuItem,
  CircularProgress
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const CATEGORIES = [
  'Appetizers',
  'Main Course',
  'Desserts',
  'Beverages',
  'Sides',
  'Special Items'
];

const MenuForm = ({ open, onClose, initial = null }) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: initial?.name || '',
    description: initial?.description || '',
    price: initial?.price || '',
    category: initial?.category || '',
    imageUrl: initial?.imageUrl || ''
  });
  const [uploadProgress, setUploadProgress] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = useCallback(async (file) => {
    try {
      setUploadProgress(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);
      
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );

      setForm(prev => ({
        ...prev,
        imageUrl: response.data.secure_url
      }));
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploadProgress(false);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (initial) {
        await axios.patch(`http://localhost:5001/api/admin/menu/${initial._id}`, form);
      } else {
        await axios.post('http://localhost:5001/api/admin/menu', form);
      }
      onClose();
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        {initial ? 'Edit Menu Item' : 'Add New Menu Item'}
      </DialogTitle>
      
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                name="name"
                label="Item Name"
                value={form.name}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="description"
                label="Description"
                value={form.description}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="price"
                label="Price"
                type="number"
                value={form.price}
                onChange={handleChange}
                fullWidth
                required
                InputProps={{
                  startAdornment: '$'
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="category"
                label="Category"
                select
                value={form.category}
                onChange={handleChange}
                fullWidth
                required
              >
                {CATEGORIES.map(cat => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <Box 
                sx={{ 
                  border: '2px dashed #E2E8F0',
                  borderRadius: 1,
                  p: 3,
                  textAlign: 'center'
                }}
              >
                {form.imageUrl ? (
                  <Box sx={{ position: 'relative' }}>
                    <img 
                      src={form.imageUrl} 
                      alt="Menu item" 
                      style={{ 
                        maxWidth: '100%',
                        maxHeight: '200px',
                        objectFit: 'contain'
                      }} 
                    />
                    <IconButton
                      sx={{ 
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        bgcolor: 'rgba(0,0,0,0.5)',
                        '&:hover': {
                          bgcolor: 'rgba(0,0,0,0.7)'
                        }
                      }}
                      onClick={() => setForm(prev => ({ ...prev, imageUrl: '' }))}
                    >
                      <DeleteIcon sx={{ color: 'white' }} />
                    </IconButton>
                  </Box>
                ) : (
                  <>
                    <input
                      accept="image/*"
                      type="file"
                      id="image-upload"
                      hidden
                      onChange={(e) => handleImageUpload(e.target.files[0])}
                    />
                    <label htmlFor="image-upload">
                      <Button
                        component="span"
                        startIcon={<CloudUploadIcon />}
                        disabled={uploadProgress}
                      >
                        {uploadProgress ? (
                          <CircularProgress size={24} />
                        ) : (
                          'Upload Image'
                        )}
                      </Button>
                    </label>
                    <Typography 
                      variant="caption" 
                      display="block" 
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      Recommended: 800x600px, Max 5MB
                    </Typography>
                  </>
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : initial ? 'Save Changes' : 'Add Item'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MenuForm;