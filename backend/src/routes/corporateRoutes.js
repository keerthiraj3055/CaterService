const express = require('express');
const router = express.Router();
const corporateController = require('../controllers/corporateController');
const upload = require('../middleware/uploadMiddleware');
const auth = require('../middleware/authMiddleware');

// Dashboard
router.get('/dashboard', auth, corporateController.getDashboard);

// Bookings
router.get('/bookings', auth, corporateController.getBookings);
router.post('/bookings', auth, corporateController.createBooking);
router.get('/bookings/:id', auth, corporateController.getBooking);
router.patch('/bookings/:id', auth, corporateController.updateBooking);
router.patch('/bookings/:id/cancel', auth, corporateController.cancelBooking);

// Meal Plans
router.get('/meal-plans', auth, corporateController.getMealPlans);
router.post('/meal-plans', auth, corporateController.createMealPlan);
router.get('/meal-plans/:id', auth, corporateController.getMealPlan);
router.patch('/meal-plans/:id', auth, corporateController.updateMealPlan);
router.patch('/meal-plans/:id/status', auth, corporateController.updateMealPlanStatus);
router.delete('/meal-plans/:id', auth, corporateController.deleteMealPlan);

// Invoices
router.get('/invoices', auth, corporateController.getInvoices);
router.get('/invoices/:id', auth, corporateController.getInvoice);
router.get('/invoices/:id/download', auth, corporateController.downloadInvoice);

// Analytics
router.get('/analytics', auth, corporateController.getAnalytics);

// Chat
router.get('/chat', auth, corporateController.getMessages);
router.post('/chat', auth, corporateController.sendMessage);

// Profile
router.get('/profile', auth, corporateController.getProfile);
router.patch('/profile', auth, corporateController.updateProfile);
router.patch('/profile/logo', auth, upload.single('logo'), corporateController.updateLogo);
router.patch('/profile/password', auth, corporateController.changePassword);

module.exports = router;











