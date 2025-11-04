import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import PaidIcon from '@mui/icons-material/Paid';
import ReceiptIcon from '@mui/icons-material/Receipt';
import axiosInstance from '../api/axiosInstance';

const EmployeePayroll = () => {
  const [payroll, setPayroll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayroll = async () => {
      try {
        const res = await axiosInstance.get('/api/employee/payroll');
        setPayroll(res.data);
      } catch (err) {
        console.error('Error fetching payroll:', err);
        setError('Failed to load payroll information');
      } finally {
        setLoading(false);
      }
    };
    fetchPayroll();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" mt={4}>
        {error}
      </Typography>
    );
  }

  const remainingAmount = (payroll?.salary || 0) - (payroll?.paid || 0);

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Payroll Information
      </Typography>

      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ bgcolor: '#60a5fa', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1}>
                <PaidIcon />
                <Typography variant="h6">Total Salary</Typography>
              </Box>
              <Typography variant="h4" sx={{ mt: 2 }}>
                ${payroll?.salary || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ bgcolor: '#34d399', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1}>
                <ReceiptIcon />
                <Typography variant="h6">Paid Amount</Typography>
              </Box>
              <Typography variant="h4" sx={{ mt: 2 }}>
                ${payroll?.paid || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ bgcolor: '#818cf8', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1}>
                <ReceiptIcon />
                <Typography variant="h6">Remaining</Typography>
              </Box>
              <Typography variant="h4" sx={{ mt: 2 }}>
                ${remainingAmount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Event Breakdown */}
        <Grid item xs={12}>
          <Paper sx={{ mt: 3, p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Completed Events Breakdown
            </Typography>
            <List>
              {(payroll?.completedEvents || []).map((event, index) => (
                <React.Fragment key={event._id}>
                  {index > 0 && <Divider />}
                  <ListItem>
                    <ListItemText
                      primary={event.eventType}
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="text.secondary">
                            {new Date(event.eventDate).toLocaleDateString()}
                          </Typography>
                          <br />
                          <Typography component="span" variant="body2">
                            Client: {event.clientName}
                          </Typography>
                        </>
                      }
                    />
                    <Typography variant="subtitle1" color="primary">
                      ${event.amount}
                    </Typography>
                  </ListItem>
                </React.Fragment>
              ))}
              {!payroll?.completedEvents?.length && (
                <ListItem>
                  <ListItemText
                    primary="No completed events yet"
                    secondary="Your earnings will appear here after completing events"
                  />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EmployeePayroll;