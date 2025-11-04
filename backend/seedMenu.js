// seedMenu.js
// Run: node seedMenu.js (from your backend folder)
// This will insert sample Veg and Non-Veg menu items for 'Wedding' event type.

const mongoose = require('mongoose');
// Use the existing MenuItem model in src/models
const Menu = require('./src/models/MenuItem'); // Adjust path if needed

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/caterservice';

const menuItems = [
  // Veg
  { name: 'Paneer Butter Masala', type: 'Veg', eventType: 'Wedding', price: 180, category: 'Main Course' },
  { name: 'Veg Biryani', type: 'Veg', eventType: 'Wedding', price: 150, category: 'Rice' },
  { name: 'Gulab Jamun', type: 'Veg', eventType: 'Wedding', price: 60, category: 'Dessert' },
  // Non-Veg
  { name: 'Chicken Curry', type: 'Non-Veg', eventType: 'Wedding', price: 220, category: 'Main Course' },
  { name: 'Mutton Biryani', type: 'Non-Veg', eventType: 'Wedding', price: 250, category: 'Rice' },
  { name: 'Fish Fry', type: 'Non-Veg', eventType: 'Wedding', price: 200, category: 'Starter' },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    await Menu.deleteMany({ eventType: 'Wedding' });
    await Menu.insertMany(menuItems);
    console.log('Sample menu items inserted for Wedding event type!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
