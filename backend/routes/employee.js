const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Employee = require('../models/Employee');
const Event = require('../models/Event');

// @route   GET /api/employee/payroll
// @desc    Get employee's payroll information
// @access  Private (Employee only)
router.get('/payroll', auth, async (req, res) => {
    try {
        // Get the employee ID from the authenticated user
        const employeeId = req.user.id;

        // Find all events assigned to this employee
        const events = await Event.find({
            'staff.employeeId': employeeId,
            status: 'completed' // Only include completed events
        }).select('name date staff payment');

        // Format the events with payment information
        const payrollEvents = events.map(event => {
            const staffMember = event.staff.find(s => s.employeeId.toString() === employeeId);
            return {
                _id: event._id,
                name: event.name,
                date: event.date,
                hours: staffMember.hours || 0,
                hourlyRate: staffMember.hourlyRate || 0
            };
        });

        res.json(payrollEvents);
    } catch (err) {
        console.error('Error in payroll route:', err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;