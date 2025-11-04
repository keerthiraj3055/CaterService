const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin', 'corporate', 'employee'], default: 'user' },
  phone: String,
  address: String,
  avatar: String,
  // Corporate specific fields
  companyName: String,
  gstNumber: String,
  logo: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
