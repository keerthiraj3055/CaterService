import React, { useEffect, useState } from 'react';
import TestimonialCard from '../../components/TestimonialCard';
import axiosInstance from '../../api/axiosInstance';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  useEffect(() => {
    axiosInstance.get('/reviews').then(res => setReviews(res.data));
  }, []);
  return (
    <div>
      <h2>Customer Reviews</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {reviews.map(review => <TestimonialCard key={review._id} review={review} />)}
      </div>
    </div>
  );
};

export default Reviews;
