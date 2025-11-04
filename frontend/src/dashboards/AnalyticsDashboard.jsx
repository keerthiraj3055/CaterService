import React from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';
import ChartComponent from '../components/ChartComponent';

const AnalyticsDashboard = () => (
  <Container maxWidth="md" sx={{ mt: 4 }}>
    <Paper elevation={3} sx={{ p: 4 }}>
      <Typography variant="h4" color="primary" gutterBottom>Analytics Dashboard</Typography>
      <Box sx={{ my: 4 }}>
        <ChartComponent data={[{ name: 'Revenue', value: 5000 }, { name: 'Users', value: 200 }]} />
      </Box>
      <Typography variant="body1">Analytics charts and insights go here.</Typography>
    </Paper>
  </Container>
);

export default AnalyticsDashboard;
