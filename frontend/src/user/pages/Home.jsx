import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Grid, Typography, Button, Box } from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import EventIcon from '@mui/icons-material/Event';
import ReviewsIcon from '@mui/icons-material/Reviews';

const Home = () => {
  return (
    <Container maxWidth="lg">
      <Box py={8}>
        {/* Hero Section */}
        <Grid container spacing={4} alignItems="center" mb={8}>
          <Grid item xs={12} md={6}>
            <Typography variant="h2" component="h1" gutterBottom>
              Welcome to CaterService
            </Typography>
            <Typography variant="h5" color="textSecondary" paragraph>
              Your premier choice for professional catering services. We bring delicious food and exceptional service to your events.
            </Typography>
            <Button
              component={Link}
              to="/menu"
              variant="contained"
              color="primary"
              size="large"
              startIcon={<RestaurantIcon />}
            >
              View Our Menu
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            {/* You can add an image here */}
            <Box
              sx={{
                height: 400,
                backgroundColor: 'grey.100',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" color="textSecondary">
                Featured Image
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Features Section */}
        <Grid container spacing={4} mb={8}>
          <Grid item xs={12} md={4}>
            <Box textAlign="center">
              <RestaurantIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Quality Cuisine
              </Typography>
              <Typography color="textSecondary">
                Discover our extensive menu featuring fresh, high-quality ingredients and diverse culinary options.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box textAlign="center">
              <EventIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Event Planning
              </Typography>
              <Typography color="textSecondary">
                Let us handle your event catering needs, from corporate functions to special celebrations.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box textAlign="center">
              <ReviewsIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Customer Reviews
              </Typography>
              <Typography color="textSecondary">
                See what our satisfied customers have to say about our services and cuisine.
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* CTA Section */}
        <Box textAlign="center" py={4}>
          <Typography variant="h4" gutterBottom>
            Ready to Plan Your Event?
          </Typography>
          <Typography variant="subtitle1" color="textSecondary" paragraph>
            Contact us today to discuss your catering needs
          </Typography>
          <Button
            component={Link}
            to="/booking"
            variant="contained"
            color="primary"
            size="large"
            sx={{ mr: 2 }}
          >
            Book Now
          </Button>
          <Button
            component={Link}
            to="/contact"
            variant="outlined"
            color="primary"
            size="large"
          >
            Contact Us
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Home;