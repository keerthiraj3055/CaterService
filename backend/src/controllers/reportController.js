const Booking = require('../models/Booking');
const Order = require('../models/Order');
const Payment = require('../models/Payment');
const User = require('../models/User');
const MenuItem = require('../models/MenuItem');

exports.getSummary = async (req, res) => {
  try {
    const [bookingsCount, ordersCount, usersCount, revenueAgg] = await Promise.all([
      Booking.countDocuments(),
      Order.countDocuments(),
      User.countDocuments(),
      Payment.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ])
    ]);

    const revenueTotal = revenueAgg?.[0]?.total || 0;
    res.json({ bookingsCount, ordersCount, usersCount, revenueTotal });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getRevenueTrend = async (req, res) => {
  try {
    const { range = '30d' } = req.query;
    const days = parseInt(String(range).replace(/[^0-9]/g, ''), 10) || 30;
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days + 1);

    const agg = await Payment.aggregate([
      { $match: { status: 'completed', createdAt: { $gte: fromDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          value: { $sum: '$amount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Normalize to include missing days
    const map = new Map(agg.map(r => [r._id, r.value]));
    const result = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const label = d.toISOString().slice(0, 10);
      result.push({ label, value: map.get(label) || 0 });
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getOrdersByCategory = async (req, res) => {
  try {
    const { range = '30d' } = req.query;
    const days = parseInt(String(range).replace(/[^0-9]/g, ''), 10) || 30;
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days + 1);

    const agg = await Order.aggregate([
      { $match: { createdAt: { $gte: fromDate } } },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'menuitems',
          localField: 'items.menuItem',
          foreignField: '_id',
          as: 'menuItem'
        }
      },
      { $unwind: '$menuItem' },
      {
        $group: {
          _id: { $ifNull: ['$menuItem.category', 'Uncategorized'] },
          value: { $sum: { $ifNull: ['$items.quantity', 1] } }
        }
      },
      { $sort: { value: -1 } }
    ]);

    const result = agg.map(a => ({ label: a._id, value: a.value }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
