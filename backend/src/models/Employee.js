const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  phone: String,
  email: String,
  avatar: String,
  joinedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Employee', employeeSchema);
