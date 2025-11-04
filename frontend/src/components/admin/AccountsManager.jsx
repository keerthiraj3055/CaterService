import React, { useEffect, useState } from 'react';
import { Card, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';

export default function AccountsManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', role: 'employee', companyName: '', gstNumber: '', specialization: '', password: '' });
  useEffect(() => {
    setLoading(true);
    axios.get('/api/admin/users', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(res => setUsers(res.data)).finally(() => setLoading(false));
  }, []);
  const handleOpen = (role) => { setSelected(null); setForm({ name: '', email: '', role, companyName: '', gstNumber: '', specialization: '', password: '' }); setOpenModal(true); };
  const handleClose = () => { setOpenModal(false); setSelected(null); };
  const handleChange = e => { const { name, value } = e.target; setForm(f => ({ ...f, [name]: value })); };
  const handleSave = async () => {
    setLoading(true);
    if (form.role === 'employee') {
      await axios.post('/api/admin/create-employee', form, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    } else {
      await axios.post('/api/admin/create-corporate', form, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    }
    const res = await axios.get('/api/admin/users', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    setUsers(res.data); handleClose(); setLoading(false);
  };
  return (
    <Box className="p-4">
      <Box className="flex justify-between items-center mb-4">
        <Typography variant="h5" className="font-bold">Accounts Management</Typography>
        <Box className="flex gap-2">
          <Button variant="contained" color="primary" onClick={() => handleOpen('employee')}>Add Employee</Button>
          <Button variant="contained" color="secondary" onClick={() => handleOpen('corporate')}>Add Corporate</Button>
        </Box>
      </Box>
      <DataGrid
        autoHeight
        rows={users}
        columns={[{ field: 'name', headerName: 'Name', flex: 1 },{ field: 'email', headerName: 'Email', flex: 1 },{ field: 'role', headerName: 'Role', flex: 1 },{ field: 'companyName', headerName: 'Company', flex: 1 },{ field: 'specialization', headerName: 'Specialization', flex: 1 }]} 
        loading={loading}
        getRowId={row => row._id || row.id}
        pageSize={10}
      />
      <Dialog open={openModal} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{form.role === 'employee' ? 'Add Employee' : 'Add Corporate'}</DialogTitle>
        <DialogContent>
          <TextField margin="normal" label="Name" name="name" value={form.name} onChange={handleChange} fullWidth required />
          <TextField margin="normal" label="Email" name="email" value={form.email} onChange={handleChange} fullWidth required />
          {form.role === 'corporate' && (
            <>
              <TextField margin="normal" label="Company Name" name="companyName" value={form.companyName} onChange={handleChange} fullWidth />
              <TextField margin="normal" label="GST Number" name="gstNumber" value={form.gstNumber} onChange={handleChange} fullWidth />
            </>
          )}
          {form.role === 'employee' && (
            <TextField margin="normal" label="Specialization" name="specialization" value={form.specialization} onChange={handleChange} fullWidth />
          )}
          <TextField margin="normal" label="Password" name="password" value={form.password} onChange={handleChange} fullWidth type="password" required />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary" disabled={loading}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
