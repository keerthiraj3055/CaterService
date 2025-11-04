require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const seedData = require('../utils/seedData');

// Connect to database
connectDB();

// Run seed when connection is established
mongoose.connection.once('open', async () => {
  try {
    await seedData();
    console.log('✅ Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
});

mongoose.connection.on('error', (err) => {
  console.error('Database connection error:', err);
  process.exit(1);
});











