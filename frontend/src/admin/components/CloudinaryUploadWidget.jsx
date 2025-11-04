import React from 'react';
import { Button } from '@mui/material';

export default function CloudinaryUploadWidget({ imageUrl, onUploadStart, onUploadComplete }) {
  const handleUpload = async () => {
    onUploadStart && onUploadStart();
    // Simulate Cloudinary upload
    setTimeout(() => {
      // Replace with actual Cloudinary widget logic
      const demoUrl = 'https://res.cloudinary.com/demo/image/upload/sample.jpg';
      onUploadComplete && onUploadComplete(demoUrl);
    }, 1500);
  };

  return (
    <div className="my-4">
      {imageUrl ? (
        <img src={imageUrl} alt="Dish" className="w-32 h-32 object-cover rounded-lg mb-2" />
      ) : null}
      <Button variant="outlined" color="primary" onClick={handleUpload}>
        {imageUrl ? 'Change Image' : 'Upload Image'}
      </Button>
    </div>
  );
}
