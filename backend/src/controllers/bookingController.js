const Booking = require('../models/Booking');

// Create booking (authenticated user)
exports.createBooking = async (req, res) => {
  try {
    // Log incoming body for debugging
    console.log('CreateBooking body:', req.body);

    // Accept multiple possible field names from frontend (eventDate or date; guests or numGuests)
    const eventDate = req.body.eventDate || req.body.date;
    const guests = req.body.guests || req.body.numGuests || req.body.num_people || req.body.numGuests;

    // Validate required fields
    if (!eventDate || !guests) {
      return res.status(400).json({ message: 'Event date and number of guests are required.' });
    }

    // Build booking document, normalize fields
    const bookingPayload = {
      ...req.body,
      eventDate,
      guests,
      status: 'pending', // use schema values
      assignedEmployee: null,
      user: req.user && req.user.id ? req.user.id : undefined,
    };

    const booking = new Booking(bookingPayload);
    await booking.save();

    // Emit socket event to admins if io is available
    const io = req.app && req.app.get ? req.app.get('io') : null;
    if (io) {
      io.to('admins').emit('BOOKING_REQUESTED', booking);
    }

    res.status(201).json({ message: 'Booking created successfully!', booking });
  } catch (err) {
    console.error('Booking creation error:', err);
    // Mongoose validation error
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: Get bookings (admin sees all, user sees own)
exports.getBookings = async (req, res) => {
  try {
    let bookings;
    if (req.user && req.user.role === 'admin') {
      bookings = await Booking.find().populate('menu user assignedEmployee');
    } else if (req.user && req.user.role === 'employee') {
      // For employees, return bookings assigned to them
      bookings = await Booking.find({ assignedEmployee: req.user.id }).populate('menu user assignedEmployee');
    } else {
      bookings = await Booking.find({ user: req.user ? req.user.id : null }).populate('menu');
    }
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Employee: get events assigned to the logged-in employee
exports.getAssignedEvents = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'employee') return res.status(403).json({ message: 'Forbidden' });
    const bookings = await Booking.find({ assignedEmployee: req.user.id }).populate('menu user');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Employee: update status for assigned event (In Progress / Completed)
exports.employeeUpdateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    // Accept human readable statuses and map to schema values
    const statusMap = {
      'In Progress': 'confirmed',
      in_progress: 'confirmed',
      'Completed': 'completed',
      completed: 'completed',
      pending: 'pending',
    };
    const newStatus = statusMap[status] || statusMap[String(status).toLowerCase()];
    if (!newStatus) return res.status(400).json({ message: 'Invalid status' });
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (!booking.assignedEmployee || String(booking.assignedEmployee) !== String(req.user.id)) {
      return res.status(403).json({ message: 'Not authorized to update this booking' });
    }
  booking.status = newStatus;
    await booking.save();

    const io = req.app && req.app.get ? req.app.get('io') : null;
  if (io) io.to('admins').emit('BOOKING_UPDATED', { id: booking._id, status: booking.status, assignedEmployee: req.user.id });

    res.json({ message: 'Status updated', booking });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: Update booking status (approve/reject)
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    booking.status = status;
    await booking.save();

    const io = req.app && req.app.get ? req.app.get('io') : null;
    if (io) io.to('admins').emit('BOOKING_UPDATED', { id: booking._id, status });

    res.json({ message: `Booking ${status}`, booking });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: Assign employee to booking
exports.assignEmployee = async (req, res) => {
  try {
    const { employeeId } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
  booking.assignedEmployee = employeeId;
  booking.status = 'confirmed';
    await booking.save();

    const io = req.app && req.app.get ? req.app.get('io') : null;
    if (io) io.to('admins').emit('BOOKING_UPDATED', { id: booking._id, status: booking.status, assignedEmployee: employeeId });

    res.json({ message: 'Employee assigned', booking });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
