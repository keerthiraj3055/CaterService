import React from 'react';
import { Skeleton, Card, CardContent, Grid, Box } from '@mui/material';

export const StatCardSkeleton = () => (
  <Card className="hover:shadow-lg transition-shadow duration-200">
    <CardContent className="p-6">
      <Box className="flex items-center justify-between">
        <Box>
          <Skeleton variant="text" width={60} height={40} />
          <Skeleton variant="text" width={100} height={20} />
        </Box>
        <Skeleton variant="circular" width={48} height={48} />
      </Box>
    </CardContent>
  </Card>
);

export const DataGridSkeleton = () => (
  <Card className="shadow-lg">
    <CardContent className="p-0">
      <Box className="p-6 border-b border-slate-200">
        <Skeleton variant="text" width={150} height={30} />
      </Box>
      <Box className="p-6">
        <Skeleton variant="rectangular" width="100%" height={400} />
      </Box>
    </CardContent>
  </Card>
);

export const ChartSkeleton = () => (
  <Card className="shadow-lg">
    <CardContent className="p-6">
      <Skeleton variant="text" width={200} height={30} className="mb-4" />
      <Skeleton variant="rectangular" width="100%" height={300} />
    </CardContent>
  </Card>
);

export const DashboardSkeleton = () => (
  <Box className="space-y-6">
    {/* Stats Cards */}
    <Grid container spacing={3}>
      {[1, 2, 3, 4].map((index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <StatCardSkeleton />
        </Grid>
      ))}
    </Grid>

    {/* Charts */}
    <Grid container spacing={3}>
      <Grid item xs={12} lg={8}>
        <ChartSkeleton />
      </Grid>
      <Grid item xs={12} lg={4}>
        <ChartSkeleton />
      </Grid>
    </Grid>

    {/* Data Table */}
    <DataGridSkeleton />
  </Box>
);

export default DashboardSkeleton;
