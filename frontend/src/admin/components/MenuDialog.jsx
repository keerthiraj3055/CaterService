import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, MenuItem, InputLabel, FormControl, CircularProgress } from '@mui/material';
import CloudinaryUploadWidget from './CloudinaryUploadWidget';

const categories = ['Wedding', 'Corporate', 'Birthday', 'Other'];

export default function MenuDialog({ open, onClose, onSave, initialData, loading }) {
  const [form, setForm] = useState(initialData || {
    name: '',
    category: '',
    price: '',
    isAvailable: true,
    image: '',
  });
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (url) => {
    setForm((prev) => ({ ...prev, image: url }));
    setUploading(false);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{form._id ? 'Edit Menu Item' : 'Add Menu Item'}</DialogTitle>
      <DialogContent dividers>
        <TextField
          label="Dish Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Category</InputLabel>
          <Select
            name="category"
            value={form.category}
            onChange={handleChange}
            label="Category"
          >
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>{cat}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Price"
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Available</InputLabel>
          <Select
            name="isAvailable"
            value={form.isAvailable}
            onChange={handleChange}
            label="Available"
          >
            <MenuItem value={true}>Yes</MenuItem>
            <MenuItem value={false}>No</MenuItem>
          </Select>
        </FormControl>
        <CloudinaryUploadWidget
          imageUrl={form.image}
          onUploadStart={() => setUploading(true)}
          onUploadComplete={handleImageUpload}
        />
        {uploading && <CircularProgress size={24} className="ml-2" />}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Cancel</Button>
        <Button onClick={() => onSave(form)} color="primary" variant="contained" disabled={loading || uploading}>
          {form._id ? 'Update' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
