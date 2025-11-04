const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const auth = require('../middleware/authMiddleware');

// Employee: fetch assigned events
router.get('/events', auth, bookingController.getAssignedEvents);

// Employee: update status for assigned event
router.patch('/events/:id/status', auth, bookingController.employeeUpdateStatus);

// Employee: payroll (simple aggregation of completed bookings earnings)
const payrollController = require('../controllers/payrollController');
router.get('/payroll', auth, payrollController.getPayrollForEmployee);

module.exports = router;


