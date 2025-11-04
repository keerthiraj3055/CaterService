import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Chip,
  Stack,
} from '@mui/material';
import { motion } from 'framer-motion';
import axiosInstance from '../../api/axiosInstance';
import LoadingSpinner from '../../components/LoadingSpinner';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axiosInstance.get('/services');
        setServices(response.data);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* Header Section */}
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography
          component="h1"
          variant="h2"
          color="text.primary"
          gutterBottom
          sx={{
            fontWeight: 600,
            fontSize: { xs: '2.5rem', md: '3.5rem' },
          }}
        >
          Our Services
        </Typography>
        <Typography
          variant="h5"
          color="text.secondary"
          sx={{
            maxWidth: '800px',
            mx: 'auto',
            mb: 4,
          }}
        >
          Discover our comprehensive range of catering services tailored to make your event memorable
        </Typography>
      </Box>

      {/* Services Grid */}
      <Grid container spacing={4}>
        {services.map((service, index) => (
          <Grid item xs={12} sm={6} md={4} key={service._id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                  },
                }}
                elevation={2}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={service.image || '/images/default-service.jpg'}
                  alt={service.name}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Typography gutterBottom variant="h5" component="h2" sx={{ fontWeight: 600 }}>
                    {service.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {service.description}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                    {service.categories?.map((category) => (
                      <Chip
                        key={category}
                        label={category}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Stack>
                  <Box sx={{ mt: 'auto' }}>
                    <Button
                      variant="contained"
                      fullWidth
                      color="primary"
                      onClick={() => window.location.href = '/booking'}
                      sx={{
                        mt: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                      }}
                    >
                      Book Now
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Features Section */}
      <Box sx={{ mt: 8 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Professional Staff
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Our experienced team ensures impeccable service delivery
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Quality Ingredients
              </Typography>
              <Typography variant="body2" color="text.secondary">
                We use only the finest ingredients to create exceptional dishes
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Customizable Menus
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tailored menus to match your preferences and dietary requirements
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Services;