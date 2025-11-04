import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Avatar,
  Divider
} from '@mui/material';

const EmployeeProfile = () => {
  const [profile, setProfile] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    address: '123 Main St',
    city: 'Anytown',
    state: 'ST',
    zip: '12345',
    bankAccount: '****1234',
    routingNumber: '****5678'
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    // TODO: Implement save functionality with backend
    setIsEditing(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Employee Profile
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} display="flex" justifyContent="center">
            <Avatar
              sx={{ width: 100, height: 100, mb: 2 }}
              alt={`${profile.firstName} ${profile.lastName}`}
              src="/path-to-profile-image.jpg"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="First Name"
              value={profile.firstName}
              disabled={!isEditing}
              margin="normal"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Last Name"
              value={profile.lastName}
              disabled={!isEditing}
              margin="normal"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              value={profile.email}
              disabled={!isEditing}
              margin="normal"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone"
              value={profile.phone}
              disabled={!isEditing}
              margin="normal"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              value={profile.address}
              disabled={!isEditing}
              margin="normal"
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="City"
              value={profile.city}
              disabled={!isEditing}
              margin="normal"
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="State"
              value={profile.state}
              disabled={!isEditing}
              margin="normal"
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="ZIP Code"
              value={profile.zip}
              disabled={!isEditing}
              margin="normal"
            />
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Payment Information
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Bank Account"
              value={profile.bankAccount}
              disabled={!isEditing}
              margin="normal"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Routing Number"
              value={profile.routingNumber}
              disabled={!isEditing}
              margin="normal"
            />
          </Grid>

          <Grid item xs={12} display="flex" justifyContent="flex-end">
            {isEditing ? (
              <>
                <Button 
                  onClick={() => setIsEditing(false)} 
                  sx={{ mr: 1 }}
                >
                  Cancel
                </Button>
                <Button 
                  variant="contained" 
                  onClick={handleSave}
                >
                  Save Changes
                </Button>
              </>
            ) : (
              <Button 
                variant="contained" 
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </Button>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default EmployeeProfile;