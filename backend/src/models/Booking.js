const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedEmployee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  // Optional descriptive fields provided by frontend
  clientName: { type: String },
  location: { type: String },
  address: { type: String },
  eventType: { type: String },
  eventDate: { type: Date, required: true },
  guests: { type: Number, required: true },
  menu: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' }],
  status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);
