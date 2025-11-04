import React from 'react';

const ErrorPage = ({ message }) => (
  <div>
    <h2>Error</h2>
    <p>{message || 'An unexpected error occurred.'}</p>
  </div>
);

export default ErrorPage;
