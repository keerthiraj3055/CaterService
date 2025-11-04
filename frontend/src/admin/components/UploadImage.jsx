import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  CircularProgress, 
  Typography, 
  IconButton 
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const UploadImage = ({ value, onChange, maxSize = 5 }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleUpload = async (file) => {
    // Validate file size (MB)
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size should not exceed ${maxSize}MB`);
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);
      
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );

      onChange(response.data.secure_url);
    } catch (err) {
      setError('Failed to upload image. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box 
      sx={{ 
        border: '2px dashed #E2E8F0',
        borderRadius: 1,
        p: 3,
        textAlign: 'center'
      }}
    >
      {value ? (
        <Box sx={{ position: 'relative' }}>
          <img 
            src={value} 
            alt="Uploaded" 
            style={{ 
              maxWidth: '100%',
              maxHeight: '200px',
              objectFit: 'contain'
            }} 
          />
          <IconButton
            sx={{ 
              position: 'absolute',
              top: 8,
              right: 8,
              bgcolor: 'rgba(0,0,0,0.5)',
              '&:hover': {
                bgcolor: 'rgba(0,0,0,0.7)'
              }
            }}
            onClick={() => onChange('')}
          >
            <DeleteIcon sx={{ color: 'white' }} />
          </IconButton>
        </Box>
      ) : (
        <>
          <input
            accept="image/*"
            type="file"
            id="image-upload"
            hidden
            onChange={(e) => handleUpload(e.target.files[0])}
          />
          <label htmlFor="image-upload">
            <Button
              component="span"
              startIcon={<CloudUploadIcon />}
              disabled={uploading}
            >
              {uploading ? (
                <CircularProgress size={24} />
              ) : (
                'Upload Image'
              )}
            </Button>
          </label>
          <Typography 
            variant="caption" 
            display="block" 
            color="text.secondary"
            sx={{ mt: 1 }}
          >
            Recommended: 800x600px, Max {maxSize}MB
          </Typography>
          {error && (
            <Typography 
              color="error" 
              variant="caption" 
              display="block" 
              sx={{ mt: 1 }}
            >
              {error}
            </Typography>
          )}
        </>
      )}
    </Box>
  );
};

export default UploadImage;