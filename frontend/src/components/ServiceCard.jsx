import React from 'react';

const ServiceCard = ({ service }) => (
  <div style={{ border: '1px solid #eee', borderRadius: 8, padding: '1rem', margin: '1rem', width: 220 }}>
    <h3>{service.name}</h3>
    <p>{service.description}</p>
    <p>${service.price}</p>
  </div>
);

export default ServiceCard;
