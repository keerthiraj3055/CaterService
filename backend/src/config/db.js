const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load .env file from the backend directory
dotenv.config({ path: path.join(__dirname, '../.env') });

// Fallback environment variables if .env loading fails
if (!process.env.MONGODB_URI) {
  process.env.MONGODB_URI = 'mongodb://localhost:27017/caterservice';
}
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'your_secret_key_here_change_in_production';
}
if (!process.env.PORT) {
  process.env.PORT = '5000';
}

console.log('MONGODB_URI from env:', process.env.MONGODB_URI);
console.log('JWT_SECRET from env:', process.env.JWT_SECRET);
console.log('PORT from env:', process.env.PORT);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
