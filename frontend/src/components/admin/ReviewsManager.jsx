import React, { useEffect, useState } from 'react';
import { Card, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';

export default function ReviewsManager() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [reply, setReply] = useState('');
  useEffect(() => {
    setLoading(true);
    axios.get('/api/admin/reviews', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(res => setReviews(res.data)).finally(() => setLoading(false));
  }, []);
  const handleOpen = (item) => { setSelected(item); setReply(''); setOpenModal(true); };
  const handleClose = () => { setOpenModal(false); setSelected(null); setReply(''); };
  const handleReply = async () => {
    setLoading(true);
    await axios.post(`/api/admin/reviews/${selected._id}/reply`, { reply }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    const res = await axios.get('/api/admin/reviews', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    setReviews(res.data); handleClose(); setLoading(false);
  };
  return (
    <Box className="p-4">
      <Box className="flex justify-between items-center mb-4">
        <Typography variant="h5" className="font-bold">Reviews Management</Typography>
      </Box>
      <DataGrid
        autoHeight
        rows={reviews}
        columns={[{ field: 'user', headerName: 'User', flex: 1 },{ field: 'rating', headerName: 'Rating', flex: 1 },{ field: 'comment', headerName: 'Comment', flex: 2 },{ field: 'reply', headerName: 'Reply', flex: 2 },{ field: 'actions', headerName: 'Actions', flex: 1, renderCell: (params) => (<Button size="small" onClick={() => handleOpen(params.row)}>Reply</Button>) }]} 
        loading={loading}
        getRowId={row => row._id || row.id}
        pageSize={10}
      />
      <Dialog open={openModal} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Reply to Review</DialogTitle>
        <DialogContent>
          <TextField margin="normal" label="Reply" name="reply" value={reply} onChange={e => setReply(e.target.value)} fullWidth multiline rows={2} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleReply} variant="contained" color="primary" disabled={loading || !reply}>Send Reply</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
