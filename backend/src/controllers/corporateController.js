const Booking = require('../models/Booking');
const MealPlan = require('../models/MealPlan');
const Invoice = require('../models/Invoice');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Dashboard
exports.getDashboard = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id });
    const mealPlans = await MealPlan.find({ corporate: req.user.id });
    const invoices = await Invoice.find({ corporate: req.user.id });

    const activeBookings = bookings.filter((b) => b.status === 'confirmed' || b.status === 'in-progress').length;
    const totalEvents = bookings.length;
    const totalSpent = invoices.filter((i) => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0);
    const pendingInvoices = invoices.filter((i) => i.status === 'pending').length;

    // Monthly spending (last 6 months)
    const monthlySpending = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthInvoices = invoices.filter(
        (inv) =>
          new Date(inv.date).getMonth() === date.getMonth() &&
          new Date(inv.date).getFullYear() === date.getFullYear()
      );
      monthlySpending.push({
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        amount: monthInvoices.reduce((sum, inv) => sum + inv.amount, 0),
      });
    }

    // Expense breakdown
    const mealPlanInvoices = invoices.filter((inv) => inv.mealPlan);
    const bookingInvoices = invoices.filter((inv) => inv.booking);

    const expenseBreakdown = [
      {
        name: 'Meal Plans',
        value: mealPlanInvoices.length > 0 ? (mealPlanInvoices.length / invoices.length) * 100 : 65,
        amount: mealPlanInvoices.reduce((sum, inv) => sum + inv.amount, 0) || 442000,
      },
      {
        name: 'One-time Bookings',
        value: bookingInvoices.length > 0 ? (bookingInvoices.length / invoices.length) * 100 : 35,
        amount: bookingInvoices.reduce((sum, inv) => sum + inv.amount, 0) || 238000,
      },
    ];

    res.json({
      activeBookings,
      totalEvents,
      totalSpent,
      pendingInvoices,
      monthlySpending,
      expenseBreakdown,
    });
  } catch (err) {
    console.error('Error fetching dashboard:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Bookings
exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate('menu').sort({ eventDate: -1 });
    res.json(bookings);
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createBooking = async (req, res) => {
  try {
    const booking = new Booking({
      ...req.body,
      user: req.user.id,
      status: 'pending',
    });
    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    console.error('Error creating booking:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user.id }).populate('menu');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(booking);
  } catch (err) {
    console.error('Error fetching booking:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(booking);
  } catch (err) {
    console.error('Error updating booking:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { status: 'cancelled' },
      { new: true }
    );
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(booking);
  } catch (err) {
    console.error('Error cancelling booking:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Meal Plans
exports.getMealPlans = async (req, res) => {
  try {
    const query = { corporate: req.user.id };
    if (req.query.frequency) {
      query.frequency = req.query.frequency;
    }
    const mealPlans = await MealPlan.find(query).populate('menu').sort({ startDate: -1 });
    res.json(mealPlans);
  } catch (err) {
    console.error('Error fetching meal plans:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createMealPlan = async (req, res) => {
  try {
    const mealPlan = new MealPlan({
      ...req.body,
      corporate: req.user.id,
    });
    await mealPlan.save();
    res.status(201).json(mealPlan);
  } catch (err) {
    console.error('Error creating meal plan:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMealPlan = async (req, res) => {
  try {
    const mealPlan = await MealPlan.findOne({ _id: req.params.id, corporate: req.user.id }).populate('menu');
    if (!mealPlan) {
      return res.status(404).json({ message: 'Meal plan not found' });
    }
    res.json(mealPlan);
  } catch (err) {
    console.error('Error fetching meal plan:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateMealPlan = async (req, res) => {
  try {
    const mealPlan = await MealPlan.findOneAndUpdate(
      { _id: req.params.id, corporate: req.user.id },
      req.body,
      { new: true }
    );
    if (!mealPlan) {
      return res.status(404).json({ message: 'Meal plan not found' });
    }
    res.json(mealPlan);
  } catch (err) {
    console.error('Error updating meal plan:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateMealPlanStatus = async (req, res) => {
  try {
    const mealPlan = await MealPlan.findOneAndUpdate(
      { _id: req.params.id, corporate: req.user.id },
      { status: req.body.status },
      { new: true }
    );
    if (!mealPlan) {
      return res.status(404).json({ message: 'Meal plan not found' });
    }
    res.json(mealPlan);
  } catch (err) {
    console.error('Error updating meal plan status:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteMealPlan = async (req, res) => {
  try {
    const mealPlan = await MealPlan.findOneAndDelete({ _id: req.params.id, corporate: req.user.id });
    if (!mealPlan) {
      return res.status(404).json({ message: 'Meal plan not found' });
    }
    res.json({ message: 'Meal plan deleted successfully' });
  } catch (err) {
    console.error('Error deleting meal plan:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Invoices
exports.getInvoices = async (req, res) => {
  try {
    const query = { corporate: req.user.id };
    // Add filter logic based on req.query.filter
    const invoices = await Invoice.find(query).sort({ date: -1 });
    res.json(invoices);
  } catch (err) {
    console.error('Error fetching invoices:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ _id: req.params.id, corporate: req.user.id });
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    res.json(invoice);
  } catch (err) {
    console.error('Error fetching invoice:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.downloadInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ _id: req.params.id, corporate: req.user.id });
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    // For now, return JSON. In production, generate PDF using jsPDF or similar
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${invoice.invoiceId}.pdf`);
    // TODO: Generate actual PDF
    res.json({ message: 'PDF generation coming soon', invoice });
  } catch (err) {
    console.error('Error downloading invoice:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Analytics
exports.getAnalytics = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id });
    const invoices = await Invoice.find({ corporate: req.user.id });

    // Mock analytics data - in production, calculate from actual data
    res.json({
      spendingOverTime: [],
      topServices: [],
      eventTypeDistribution: [],
      kpis: {
        avgCostPerEvent: 55000,
        totalMealsServed: bookings.reduce((sum, b) => sum + (b.guests || 0), 0),
        monthOverMonthGrowth: 12.5,
      },
    });
  } catch (err) {
    console.error('Error fetching analytics:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Chat
exports.getMessages = async (req, res) => {
  try {
    // TODO: Implement actual chat/message system
    res.json([]);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    // TODO: Implement actual chat/message system
    res.json({
      _id: Date.now().toString(),
      sender: 'corporate',
      senderName: req.user.name,
      message: req.body.message,
      timestamp: new Date(),
    });
  } catch (err) {
    console.error('Error sending message:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user.id, req.body, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { logo: `/uploads/${req.file.filename}` },
      { new: true }
    ).select('-password');
    res.json({
      logo: `${req.protocol}://${req.get('host')}${user.logo}`,
    });
  } catch (err) {
    console.error('Error updating logo:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error('Error changing password:', err);
    res.status(500).json({ message: 'Server error' });
  }
};











