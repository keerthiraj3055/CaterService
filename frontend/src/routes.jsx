import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './admin/layout/AdminLayout';
import AdminDashboard from './admin/pages/AdminDashboard';
import AdminDashboardPage from './admin/pages/Dashboard';
import AdminMenu from './admin/pages/Menu';
import ServicesPage from './admin/pages/Services';
import AdminOrders from './admin/pages/Orders';
import AdminBookings from './admin/pages/Bookings';
import AdminAccounts from './admin/pages/Accounts';
import AdminReports from './admin/pages/Reports';
import AdminReviews from './admin/pages/Reviews';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Booking from './pages/Booking';
import Services from './pages/Services';
import Orders from './pages/Orders';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import Reviews from './pages/Reviews';
import NotFound from './pages/NotFound';
import { Navigate } from 'react-router-dom';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/menu" element={<Menu />} />
    <Route path="/booking" element={<Booking />} />
    <Route path="/services" element={<Services />} />
    <Route path="/orders" element={<Orders />} />
    <Route path="/cart" element={<Cart />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/reviews" element={<Reviews />} />
    {/* Admin Routes - all explicit, wrapped in AdminLayout and ProtectedRoute */}
  <Route path="/admin/dashboard" element={<ProtectedRoute roles={["admin"]}><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>} />
    <Route path="/admin/menu" element={<ProtectedRoute roles={["admin"]}><AdminLayout><AdminMenu /></AdminLayout></ProtectedRoute>} />
    <Route path="/admin/services" element={<ProtectedRoute roles={["admin"]}><AdminLayout><ServicesPage /></AdminLayout></ProtectedRoute>} />
    <Route path="/admin/orders" element={<ProtectedRoute roles={["admin"]}><AdminLayout><AdminOrders /></AdminLayout></ProtectedRoute>} />
    <Route path="/admin/bookings" element={<ProtectedRoute roles={["admin"]}><AdminLayout><AdminBookings /></AdminLayout></ProtectedRoute>} />
    <Route path="/admin/accounts" element={<ProtectedRoute roles={["admin"]}><AdminLayout><AdminAccounts /></AdminLayout></ProtectedRoute>} />
    <Route path="/admin/reports" element={<ProtectedRoute roles={["admin"]}><AdminLayout><AdminReports /></AdminLayout></ProtectedRoute>} />
    <Route path="/admin/reviews" element={<ProtectedRoute roles={["admin"]}><AdminLayout><AdminReviews /></AdminLayout></ProtectedRoute>} />
  <Route path="/admin/*" element={<Navigate to="/admin/dashboard" replace />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
