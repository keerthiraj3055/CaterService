import React, { useEffect, useState } from 'react';
import { Box, Card, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, Typography, Switch, FormControlLabel } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';

export default function MenuManager() {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ name: '', category: '', price: '', image: '', description: '', available: true });
  useEffect(() => {
    setLoading(true);
    axios.get('/api/admin/menu', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(res => setMenu(res.data)).finally(() => setLoading(false));
  }, []);
  const handleOpen = (item) => { setSelected(item); setForm(item || { name: '', category: '', price: '', image: '', description: '', available: true }); setOpenModal(true); };
  const handleClose = () => { setOpenModal(false); setSelected(null); };
  const handleChange = e => { const { name, value, type, checked } = e.target; setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value })); };
  const handleSave = async () => {
    setLoading(true);
    if (selected) {
      await axios.put(`/api/admin/menu/${selected._id}`, form, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    } else {
      await axios.post('/api/admin/menu', form, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    }
    const res = await axios.get('/api/admin/menu', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    setMenu(res.data); handleClose(); setLoading(false);
  };
  const handleDelete = async (id) => {
    setLoading(true);
    await axios.delete(`/api/admin/menu/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    const res = await axios.get('/api/admin/menu', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    setMenu(res.data); setLoading(false);
  };
  return (
    <Box className="p-4">
      <Box className="flex justify-between items-center mb-4">
        <Typography variant="h5" className="font-bold">Menu Management</Typography>
        <Button variant="contained" color="primary" onClick={() => handleOpen(null)}>Add Dish</Button>
      </Box>
      <DataGrid
        autoHeight
        rows={menu}
        columns={[{ field: 'name', headerName: 'Name', flex: 1 },{ field: 'category', headerName: 'Category', flex: 1 },{ field: 'price', headerName: 'Price', flex: 1 },{ field: 'image', headerName: 'Image', flex: 1, renderCell: (params) => params.row.image ? <img src={params.row.image} alt="dish" className="h-12 w-12 rounded" /> : 'No Image' },{ field: 'description', headerName: 'Description', flex: 2 },{ field: 'available', headerName: 'Available', flex: 1, renderCell: (params) => params.row.available ? 'Yes' : 'No' },{ field: 'actions', headerName: 'Actions', flex: 1, renderCell: (params) => (<><Button size="small" onClick={() => handleOpen(params.row)}>Edit</Button><Button size="small" color="error" onClick={() => handleDelete(params.row._id)}>Delete</Button></>) }]} 
        loading={loading}
        getRowId={row => row._id || row.id}
        pageSize={10}
      />
      <Dialog open={openModal} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{selected ? 'Edit Dish' : 'Add Dish'}</DialogTitle>
        <DialogContent>
          <TextField margin="normal" label="Name" name="name" value={form.name} onChange={handleChange} fullWidth required />
          <TextField margin="normal" label="Category" name="category" value={form.category} onChange={handleChange} fullWidth required />
          <TextField margin="normal" label="Price" name="price" value={form.price} onChange={handleChange} fullWidth required type="number" />
          <TextField margin="normal" label="Description" name="description" value={form.description} onChange={handleChange} fullWidth multiline rows={2} />
          <FormControlLabel control={<Switch checked={form.available} onChange={e => setForm(f => ({ ...f, available: e.target.checked }))} />} label="Available" />
          {form.image && <img src={form.image} alt="dish" className="h-12 w-12 rounded mt-2" />}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary" disabled={loading}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
