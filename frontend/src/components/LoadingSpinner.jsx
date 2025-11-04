import React from 'react';
import { Box, CircularProgress } from '@mui/material';

const LoadingSpinner = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
        width: '100%'
      }}
    >
      <CircularProgress 
        size={40}
        thickness={4}
        sx={{
          color: (theme) => theme.palette.primary.main
        }}
      />
    </Box>
  );
};

export default LoadingSpinner;