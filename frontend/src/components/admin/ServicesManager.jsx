import React, { useEffect, useState } from 'react';
import { Card, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';

export default function ServicesManager() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ name: '', description: '' });
  useEffect(() => {
    setLoading(true);
    axios.get('/api/admin/services', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(res => setServices(res.data)).finally(() => setLoading(false));
  }, []);
  const handleOpen = (item) => { setSelected(item); setForm(item || { name: '', description: '' }); setOpenModal(true); };
  const handleClose = () => { setOpenModal(false); setSelected(null); };
  const handleChange = e => { const { name, value } = e.target; setForm(f => ({ ...f, [name]: value })); };
  const handleSave = async () => {
    setLoading(true);
    if (selected) {
      await axios.put(`/api/admin/services/${selected._id}`, form, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    } else {
      await axios.post('/api/admin/services', form, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    }
    const res = await axios.get('/api/admin/services', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    setServices(res.data); handleClose(); setLoading(false);
  };
  const handleDelete = async (id) => {
    setLoading(true);
    await axios.delete(`/api/admin/services/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    const res = await axios.get('/api/admin/services', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    setServices(res.data); setLoading(false);
  };
  return (
    <Box className="p-4">
      <Box className="flex justify-between items-center mb-4">
        <Typography variant="h5" className="font-bold">Services Management</Typography>
        <Button variant="contained" color="primary" onClick={() => handleOpen(null)}>Add Service</Button>
      </Box>
      <DataGrid
        autoHeight
        rows={services}
        columns={[{ field: 'name', headerName: 'Name', flex: 1 },{ field: 'description', headerName: 'Description', flex: 2 },{ field: 'actions', headerName: 'Actions', flex: 1, renderCell: (params) => (<><Button size="small" onClick={() => handleOpen(params.row)}>Edit</Button><Button size="small" color="error" onClick={() => handleDelete(params.row._id)}>Delete</Button></>) }]} 
        loading={loading}
        getRowId={row => row._id || row.id}
        pageSize={10}
      />
      <Dialog open={openModal} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{selected ? 'Edit Service' : 'Add Service'}</DialogTitle>
        <DialogContent>
          <TextField margin="normal" label="Name" name="name" value={form.name} onChange={handleChange} fullWidth required />
          <TextField margin="normal" label="Description" name="description" value={form.description} onChange={handleChange} fullWidth multiline rows={2} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary" disabled={loading}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
