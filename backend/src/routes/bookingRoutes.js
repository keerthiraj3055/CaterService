const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const auth = require('../middleware/authMiddleware');

// Create booking (authenticated user)
router.post('/', auth, bookingController.createBooking);

// List bookings (admin sees all, user sees their own)
router.get('/', auth, bookingController.getBookings);

// Employee: get assigned events
router.get('/employee/events', auth, bookingController.getAssignedEvents);

// Update booking status (admin)
router.patch('/:id/status', auth, bookingController.updateBookingStatus);

// Assign employee to booking (admin)
router.patch('/:id/assign', auth, bookingController.assignEmployee);

// Employee: update status for assigned event
router.patch('/employee/events/:id/status', auth, bookingController.employeeUpdateStatus);

module.exports = router;
