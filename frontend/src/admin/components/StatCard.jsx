import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const StatCard = ({ title, value, subtitle }) => {
  return (
    <Card sx={{ borderRadius: 2, boxShadow: '0 1px 2px rgba(0,0,0,0.06)' }}>
      <CardContent>
        <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>{title}</Typography>
        <Typography variant="h5" sx={{ mt: 0.5, fontWeight: 600 }}>{value}</Typography>
        {subtitle && <Typography variant="caption" sx={{ color: 'text.secondary' }}>{subtitle}</Typography>}
      </CardContent>
    </Card>
  );
};

export default StatCard;




