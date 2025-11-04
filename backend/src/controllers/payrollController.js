const Booking = require('../models/Booking');
const MenuItem = require('../models/MenuItem');

// Payroll: return total earnings and event-wise breakdown for completed bookings assigned to employee
exports.getPayrollForEmployee = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'employee') return res.status(403).json({ message: 'Forbidden' });

    const bookings = await Booking.find({ assignedEmployee: req.user.id, status: 'completed' }).populate('menu');

    let total = 0;
    const breakdown = bookings.map(b => {
      let amt = 0;
      if (Array.isArray(b.menu)) {
        b.menu.forEach(mi => {
          amt += (mi.price || 0);
        });
      }
      total += amt;
      return {
        id: b._id,
        clientName: b.clientName || (b.user && b.user.name) || 'Client',
        eventDate: b.eventDate,
        amount: amt,
      };
    });

    res.json({ salary: total, paid: 0, completedEvents: bookings.length, breakdown });
  } catch (err) {
    console.error('Payroll error', err);
    res.status(500).json({ message: 'Server error' });
  }
};
