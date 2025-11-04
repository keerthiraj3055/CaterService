const Order = require('../models/Order');
const User = require('../models/User');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

exports.createOrder = async (req, res) => {
  try {
    const order = new Order({ ...req.body, user: req.user.id });
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate('items.menuItem');
    // Enhance response to always include paymentMethod for UI display
    const enhanced = orders.map((order) => {
      const plain = order.toObject();
      return {
        ...plain,
        paymentMethod: plain.paymentMethod || 'Auto (Simulated)'
      };
    });
    res.json(enhanced);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Mark order as paid and return a simple receipt payload
exports.payOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { method = 'Auto (Simulated)' } = req.body || {};
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    if (order.user?.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    order.paymentStatus = 'paid';
    order.paymentMethod = method;
    // If still in a pre-payment state, move to 'paid'; otherwise keep current
    if (['pending', 'confirmed', 'processing'].includes(order.status)) {
      order.status = 'paid';
    }
    await order.save();

    const receipt = {
      receiptId: `RCT-${order._id.toString().slice(-8).toUpperCase()}`,
      orderId: order._id,
      amount: order.total,
      currency: 'INR',
      paidAt: new Date().toISOString(),
      method: order.paymentMethod || method,
    };

    res.status(200).json({ success: true, order, receipt });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.downloadInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.menuItem')
      .populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user owns this order
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Create PDF
    const doc = new PDFDocument({ margin: 50 });
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${order._id}.pdf`);

    // Pipe PDF to response
    doc.pipe(res);

    // Header
    doc.fontSize(25).text('FoodServe Catering', { align: 'center' });
    doc.moveDown();
    doc.fontSize(18).text('INVOICE', { align: 'center' });
    doc.moveDown(2);

    // Order Details
    doc.fontSize(12);
    doc.text(`Order ID: ${order._id.toString().slice(-8).toUpperCase()}`, { align: 'left' });
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, { align: 'left' });
    doc.text(`Customer: ${order.user.name || 'N/A'}`, { align: 'left' });
    doc.text(`Email: ${order.user.email || 'N/A'}`, { align: 'left' });
    doc.moveDown();

    // Items Table Header
    doc.fontSize(10);
    const tableTop = doc.y;
    doc.text('Item', 50, tableTop);
    doc.text('Quantity', 300, tableTop);
    doc.text('Price', 380, tableTop);
    doc.text('Total', 450, tableTop);
    doc.moveTo(50, doc.y + 5).lineTo(550, doc.y + 5).stroke();

    // Items
    let y = doc.y + 10;
    order.items.forEach((item) => {
      const itemName = item.menuItem?.name || 'Unknown Item';
      const quantity = item.quantity || 1;
      const price = item.menuItem?.price || 0;
      const total = price * quantity;

      doc.text(itemName, 50, y, { width: 240 });
      doc.text(quantity.toString(), 300, y);
      doc.text(`₹${price}`, 380, y);
      doc.text(`₹${total}`, 450, y);
      y += 20;
    });

    doc.moveDown();
    doc.moveTo(50, doc.y + 5).lineTo(550, doc.y + 5).stroke();
    doc.moveDown();

    // Total
    doc.fontSize(14).font('Helvetica-Bold');
    doc.text(`Grand Total: ₹${order.total}`, 450, doc.y, { align: 'right' });

    // Footer
    doc.fontSize(10).font('Helvetica');
    doc.moveDown(2);
    doc.text('Thank you for your order!', { align: 'center' });

    // Finalize PDF
    doc.end();
  } catch (err) {
    console.error('Error generating invoice:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
