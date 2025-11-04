const Payment = require('../models/Payment');
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET);

exports.createPayment = async (req, res) => {
  try {
    const { amount, currency = 'usd', orderId } = req.body;
    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects cents
      currency,
      metadata: { orderId }
    });
    // Save payment in DB
    const payment = new Payment({ ...req.body, user: req.user.id, method: 'stripe', status: 'pending' });
    await payment.save();
    res.status(201).json({ clientSecret: paymentIntent.client_secret, payment });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user.id });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
