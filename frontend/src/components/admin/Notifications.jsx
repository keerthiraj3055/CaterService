import React from 'react';
import { Snackbar, Alert } from '@mui/material';

export default function Notifications({ open, message, severity, onClose }) {
  return (
    <Snackbar open={open} autoHideDuration={3000} onClose={onClose}>
      <Alert onClose={onClose} severity={severity || 'info'} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
}
