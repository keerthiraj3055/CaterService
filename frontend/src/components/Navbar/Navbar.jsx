import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => (
  <nav style={{ background: '#fff', padding: '1rem', borderBottom: '1px solid #eee' }}>
    <Link to="/">Home</Link> | <Link to="/menu">Menu</Link> | <Link to="/booking">Booking</Link> | <Link to="/services">Services</Link> | <Link to="/orders">Orders</Link> | <Link to="/cart">Cart</Link> | <Link to="/profile">Profile</Link> | <Link to="/login">Login</Link> | <Link to="/register">Register</Link> | <Link to="/reviews">Reviews</Link>
  </nav>
);

export default Navbar;
