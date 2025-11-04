import React from 'react';
import { Paper, Typography, Box } from '@mui/material';

const QuickStatsCard = ({ title, value }) => (
  <Paper 
    elevation={0}
    sx={{ 
      p: 3, 
      borderRadius: 2,
      background: 'white',
      border: '1px solid #E6EEF8'
    }}
  >
    <Typography 
      variant="subtitle2" 
      color="text.secondary"
      sx={{ fontSize: '0.875rem', fontWeight: 500 }}
    >
      {title}
    </Typography>
    <Box sx={{ mt: 1 }}>
      <Typography 
        variant="h4" 
        sx={{ 
          fontWeight: 700,
          color: '#1E293B'
        }}
      >
        {value}
      </Typography>
    </Box>
  </Paper>
);

export default QuickStatsCard;