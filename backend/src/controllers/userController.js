const User = require('../models/User');
const Employee = require('../models/Employee');
const bcrypt = require('bcryptjs');

// Get all users (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    // Only admin can access all users
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create user (Admin only - for creating employee/corporate accounts)
exports.createUser = async (req, res) => {
  try {
    // Only admin can create users
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only admin can create accounts.' });
    }

    const { name, email, password, role, phone, companyName, address, gstNumber } = req.body;

    // Validate required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Name, email, password, and role are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user object
    const userData = {
      name,
      email,
      password: hashedPassword,
      role,
      phone: phone || '',
    };

    // Add corporate-specific fields if creating corporate account
    if (role === 'corporate') {
      userData.companyName = companyName || '';
      userData.address = address || '';
      userData.gstNumber = gstNumber || '';
    }

    // Create user
    const user = new User(userData);
    await user.save();

    // If creating employee, also create Employee record
    if (role === 'employee') {
      const employee = new Employee({
        name,
        email,
        role: 'Server', // Default role, can be updated later
        phone: phone || '',
      });
      await employee.save();
    }

    // Return user without password
    const userResponse = await User.findById(user._id).select('-password');
    res.status(201).json(userResponse);
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    delete updates.password;
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Save avatar path (relative to uploads folder)
    user.avatar = `/uploads/${req.file.filename}`;
    await user.save();

    res.json({
      avatar: `${req.protocol}://${req.get('host')}${user.avatar}`,
      user: user
    });
  } catch (err) {
    console.error('Error updating avatar:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const Booking = require('../models/Booking');

    if (req.user.role === 'admin') {
      const pending = await Booking.find({ status: 'pending' })
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('user', 'name email');
      const notifications = pending.map(b => ({
        _id: b._id,
        type: 'booking',
        message: `Booking ${b.bookingId || b._id.toString().slice(-6)} pending approval` + (b.user?.name ? ` from ${b.user.name}` : ''),
        createdAt: b.createdAt
      }));
      return res.json(notifications);
    }

    // User notifications: show own pending and recent status updates
    const myBookings = await Booking.find({ user: req.user.id }).sort({ createdAt: -1 }).limit(10);
    const notifications = myBookings.map(b => ({
      _id: b._id,
      type: 'booking',
      message: b.status === 'pending'
        ? `Your booking ${b.bookingId || b._id.toString().slice(-6)} is pending approval`
        : `Your booking ${b.bookingId || b._id.toString().slice(-6)} status: ${b.status}`,
      createdAt: b.createdAt
    }));
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
