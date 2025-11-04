const Booking = require('../models/Booking');
const Employee = require('../models/Employee');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const upload = require('../middleware/uploadMiddleware');
const path = require('path');

// Get bookings assigned to the logged-in employee
exports.getAssignedBookings = async (req, res) => {
  try {
    // Find employee by user ID or email
    const employee = await Employee.findOne({ email: req.user.email });
    
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Find bookings assigned to this employee
    const bookings = await Booking.find({ 
      assignedEmployees: employee._id 
    })
    .populate('user', 'name email')
    .populate('menu')
    .sort({ eventDate: 1 });

    res.json(bookings);
  } catch (err) {
    console.error('Error fetching assigned bookings:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get specific booking details
exports.getBookingDetails = async (req, res) => {
  try {
    const employee = await Employee.findOne({ email: req.user.email });
    
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const booking = await Booking.findOne({
      _id: req.params.id,
      assignedEmployees: employee._id
    })
    .populate('user', 'name email phone')
    .populate('menu')
    .populate('assignedEmployees', 'name role');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found or not assigned to you' });
    }

    res.json(booking);
  } catch (err) {
    console.error('Error fetching booking details:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update booking status
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const employee = await Employee.findOne({ email: req.user.email });
    
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const booking = await Booking.findOne({
      _id: req.params.id,
      assignedEmployees: employee._id
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found or not assigned to you' });
    }

    booking.status = status;
    booking.updatedAt = Date.now();
    await booking.save();

    res.json(booking);
  } catch (err) {
    console.error('Error updating booking status:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get payroll information for employee
exports.getPayroll = async (req, res) => {
  try {
    const employee = await Employee.findOne({ email: req.user.email });
    
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Mock payroll data - In production, this would come from a Payroll model
    const payroll = {
      salary: 3500, // Monthly salary
      paid: 3000,   // Total paid
      pending: 500, // Pending amount
      history: [
        {
          id: 1,
          date: new Date('2024-01-01'),
          amount: 3500,
          status: 'paid',
          type: 'Salary'
        },
        {
          id: 2,
          date: new Date('2023-12-01'),
          amount: 3500,
          status: 'paid',
          type: 'Salary'
        }
      ]
    };

    res.json(payroll);
  } catch (err) {
    console.error('Error fetching payroll:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update employee profile
exports.updateProfile = async (req, res) => {
  try {
    const employee = await Employee.findOne({ email: req.user.email });
    
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const { name, phone, email } = req.body;

    // Update employee fields
    if (name) employee.name = name;
    if (phone) employee.phone = phone;
    if (email) employee.email = email;

    await employee.save();

    // Also update user if exists
    const user = await User.findOne({ email: req.user.email });
    if (user) {
      if (name) user.name = name;
      if (phone) user.phone = phone;
      if (email) user.email = email;
      await user.save();
    }

    const updatedEmployee = await Employee.findById(employee._id);
    res.json({
      _id: updatedEmployee._id,
      name: updatedEmployee.name,
      email: updatedEmployee.email,
      phone: updatedEmployee.phone,
      role: updatedEmployee.role,
      avatar: updatedEmployee.avatar,
      joinedAt: updatedEmployee.joinedAt,
    });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update employee avatar
exports.updateAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const employee = await Employee.findOne({ email: req.user.email });
    
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Save avatar path (relative to uploads folder)
    employee.avatar = `/uploads/${req.file.filename}`;
    await employee.save();

    // Also update user if exists
    const user = await User.findOne({ email: req.user.email });
    if (user) {
      user.avatar = `/uploads/${req.file.filename}`;
      await user.save();
    }

    res.json({
      avatar: `${req.protocol}://${req.get('host')}${employee.avatar}`,
    });
  } catch (err) {
    console.error('Error updating avatar:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Change employee password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    // Find user (password is stored in User model)
    const user = await User.findOne({ email: req.user.email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash and update password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error('Error changing password:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

