import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import CorporateLayout from './layout/CorporateLayout';
import Bookings from './pages/Bookings';
import MealPlans from './pages/MealPlans';
import Invoices from './pages/Invoices';
import Analytics from './pages/Analytics';
import Chat from './pages/Chat';
import Profile from './pages/Profile';

export default function CorporateRoutes(){
  return (
    <Routes>
      <Route path="/" element={<CorporateLayout />}>
        <Route index element={<Navigate to="bookings" replace />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="meal-plans" element={<MealPlans />} />
        <Route path="invoices" element={<Invoices />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="chat" element={<Chat />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}
