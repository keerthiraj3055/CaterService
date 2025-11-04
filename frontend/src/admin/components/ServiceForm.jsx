import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  FormControlLabel,
  Switch
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const ServiceForm = ({ open, onClose, onSubmit, initialValues = null }) => {
  const formik = useFormik({
    initialValues: initialValues || {
      name: '',
      description: '',
      price: '',
      duration: '',
      maxGuests: '',
      isActive: true,
      image: ''
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Service name is required'),
      description: Yup.string().required('Description is required'),
      price: Yup.number().required('Price is required').positive('Price must be positive'),
      duration: Yup.number().required('Duration is required').positive('Duration must be positive'),
      maxGuests: Yup.number().required('Maximum guests is required').positive('Must be positive'),
      isActive: Yup.boolean()
    }),
    onSubmit: async (values) => {
      await onSubmit(values);
      formik.resetForm();
    }
  });

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        {initialValues ? 'Edit Service' : 'Add New Service'}
      </DialogTitle>
      
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="name"
                name="name"
                label="Service Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                id="description"
                name="description"
                label="Description"
                multiline
                rows={4}
                value={formik.values.description}
                onChange={formik.handleChange}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="price"
                name="price"
                label="Base Price"
                type="number"
                InputProps={{
                  startAdornment: '$'
                }}
                value={formik.values.price}
                onChange={formik.handleChange}
                error={formik.touched.price && Boolean(formik.errors.price)}
                helperText={formik.touched.price && formik.errors.price}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="duration"
                name="duration"
                label="Duration (hours)"
                type="number"
                value={formik.values.duration}
                onChange={formik.handleChange}
                error={formik.touched.duration && Boolean(formik.errors.duration)}
                helperText={formik.touched.duration && formik.errors.duration}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="maxGuests"
                name="maxGuests"
                label="Maximum Guests"
                type="number"
                value={formik.values.maxGuests}
                onChange={formik.handleChange}
                error={formik.touched.maxGuests && Boolean(formik.errors.maxGuests)}
                helperText={formik.touched.maxGuests && formik.errors.maxGuests}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    name="isActive"
                    checked={formik.values.isActive}
                    onChange={formik.handleChange}
                    color="primary"
                  />
                }
                label="Service Active"
              />
            </Grid>

            <Grid item xs={12}>
              <Box
                sx={{
                  border: '2px dashed #E2E8F0',
                  borderRadius: 1,
                  p: 3,
                  textAlign: 'center'
                }}
              >
                {formik.values.image ? (
                  <Box sx={{ position: 'relative' }}>
                    <img
                      src={formik.values.image}
                      alt="Service preview"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '200px',
                        objectFit: 'contain'
                      }}
                    />
                    <Button
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        minWidth: 'auto',
                        p: 0.5
                      }}
                      onClick={() => formik.setFieldValue('image', '')}
                    >
                      <CloseIcon />
                    </Button>
                  </Box>
                ) : (
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<CloudUploadIcon />}
                  >
                    Upload Image
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(event) => {
                        const file = event.currentTarget.files[0];
                        // TODO: Implement image upload to cloud storage
                        // For now, create a local URL
                        const imageUrl = URL.createObjectURL(file);
                        formik.setFieldValue('image', imageUrl);
                      }}
                    />
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            variant="contained"
            type="submit"
            disabled={formik.isSubmitting}
          >
            {initialValues ? 'Save Changes' : 'Add Service'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ServiceForm;