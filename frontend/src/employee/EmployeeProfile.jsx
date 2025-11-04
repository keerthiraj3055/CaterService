import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  CircularProgress,
  Divider,
  Alert,
} from '@mui/material';
import axiosInstance from '../api/axiosInstance';

const EmployeeProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axiosInstance.get('/api/employee/profile');
      setProfile(res.data);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const formData = new FormData(e.target);
    const updates = {
      name: formData.get('name'),
      email: formData.get('email'),
      contactNumber: formData.get('contactNumber'),
    };

    try {
      await axiosInstance.patch('/api/employee/profile', updates);
      setSuccess('Profile updated successfully');
      fetchProfile();
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      await axiosInstance.patch('/api/employee/profile/password', {
        currentPassword,
        newPassword,
      });
      setSuccess('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error('Error changing password:', err);
      setError('Failed to update password');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Profile Settings
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Basic Info */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Basic Information
            </Typography>
            <form onSubmit={handleProfileUpdate}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                defaultValue={profile?.name}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                defaultValue={profile?.email}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Contact Number"
                name="contactNumber"
                defaultValue={profile?.contactNumber}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Role"
                defaultValue={profile?.role}
                margin="normal"
                disabled
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
              >
                Save Changes
              </Button>
            </form>
          </Paper>
        </Grid>

        {/* Password Change */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Change Password
            </Typography>
            <form onSubmit={handlePasswordChange}>
              <TextField
                fullWidth
                label="Current Password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                margin="normal"
                required
                error={newPassword !== confirmPassword}
                helperText={
                  newPassword !== confirmPassword ? 'Passwords do not match' : ''
                }
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
              >
                Update Password
              </Button>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EmployeeProfile;