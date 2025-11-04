const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const logger = require('./config/logger');
const http = require('http');
const { Server } = require('socket.io');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
}));
app.use(express.json());
app.use(morgan('dev'));

// Serve uploads folder
app.use('/uploads', express.static('src/uploads'));

// ============================
//         ROUTES
// ============================

// 🔹 Authentication & Users
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// 🔹 Menu & Services
app.use('/api/menu', require('./routes/menuRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));

// 🔹 Bookings (newly added)
const bookingRoutes = require('./routes/bookingRoutes');
app.use('/api/bookings', bookingRoutes);

// Employee routes (events & payroll)
app.use('/api/employee', require('./routes/employeeRoutes'));

// 🔹 Orders, Payments, Reviews, Reports
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));

// ============================
//     ERROR HANDLER
// ============================
app.use(require('./middleware/errorMiddleware'));

// Export app
module.exports = app;
