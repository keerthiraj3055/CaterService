import React from 'react';

const TestimonialCard = ({ review }) => (
  <div style={{ border: '1px solid #eee', borderRadius: 8, padding: '1rem', margin: '1rem', width: 220 }}>
    <h4>{review.user}</h4>
    <p>Rating: {review.rating}/5</p>
    <p>{review.comment}</p>
  </div>
);

export default TestimonialCard;
