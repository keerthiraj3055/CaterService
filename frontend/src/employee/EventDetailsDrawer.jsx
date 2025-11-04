import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Chip,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import RestaurantIcon from '@mui/icons-material/Restaurant';

const EventDetailsDrawer = ({ open, event, onClose }) => {
  if (!event) return null;

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'in_progress':
        return 'info';
      case 'completed':
        return 'success';
      default:
        return 'default';
    }
  };

  const groupMenuByType = (menuItems) => {
    return menuItems?.reduce((acc, item) => {
      const type = item.isVeg ? 'Vegetarian' : 'Non-Vegetarian';
      if (!acc[type]) acc[type] = [];
      acc[type].push(item);
      return acc;
    }, {}) || {};
  };

  const menuByType = groupMenuByType(event.menu);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{event.eventType}</Typography>
          <Chip
            label={event.status}
            color={getStatusColor(event.status)}
            size="small"
          />
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Client Info */}
          <Grid item xs={12}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <PersonIcon color="action" />
              <Typography variant="subtitle1">
                <strong>Client:</strong> {event.clientName}
              </Typography>
            </Box>
          </Grid>

          {/* Date & Time */}
          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center" gap={1}>
              <AccessTimeIcon color="action" />
              <Typography variant="body1">
                {formatDate(event.eventDate)}
              </Typography>
            </Box>
          </Grid>

          {/* Location */}
          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center" gap={1}>
              <LocationOnIcon color="action" />
              <Typography variant="body1">
                {event.location}
              </Typography>
            </Box>
          </Grid>

          {/* Menu Items */}
          <Grid item xs={12}>
            <Box mt={2}>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <RestaurantIcon color="action" />
                <Typography variant="h6">Menu Items</Typography>
              </Box>

              {Object.entries(menuByType).map(([type, items]) => (
                <Box key={type} mb={2}>
                  <Typography variant="subtitle1" color="primary" gutterBottom>
                    {type}
                  </Typography>
                  <Grid container spacing={1}>
                    {items.map((item) => (
                      <Grid item xs={12} sm={6} key={item._id}>
                        <Box
                          p={1}
                          bgcolor="#f8fafc"
                          borderRadius={1}
                          display="flex"
                          justifyContent="space-between"
                        >
                          <Typography variant="body2">{item.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            ${item.price}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Map */}
          <Grid item xs={12}>
            <Box height={200} bgcolor="#f8fafc" borderRadius={1}>
              {/* Google Maps iframe can be added here */}
              <Typography variant="body2" color="text.secondary" p={2}>
                Map view will be implemented later
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventDetailsDrawer;