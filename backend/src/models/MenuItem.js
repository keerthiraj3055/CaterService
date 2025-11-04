const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: String,
  description: String,
  category: String,
  diet: { type: String, enum: ['veg', 'non-veg'], default: 'veg' },
  programs: [{ type: String }], // e.g., ['Wedding', 'Corporate', 'Birthday']
  available: { type: Boolean, default: true }
});

module.exports = mongoose.model('MenuItem', menuItemSchema);
