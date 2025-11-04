# FoodServe Backend

This is the backend for the FoodServe catering service MERN application.

## Features
- User authentication (JWT)
- Menu management
- Booking and order management
- Payment integration (Stripe/Razorpay)
- Reviews and reporting
- Admin and employee management
- Cloudinary image uploads
- Email notifications

## Getting Started

1. Copy `.env.example` to `.env` and fill in your credentials.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm run dev
   ```

## Folder Structure
- `src/config/` - Configuration files
- `src/models/` - Mongoose models
- `src/controllers/` - Route controllers
- `src/routes/` - Express routes
- `src/middleware/` - Middleware functions
- `src/validation/` - Request validation
- `src/utils/` - Utility functions
- `src/tests/` - Test files
- `src/uploads/` - Uploaded files
- `src/logs/` - Log files

## License
MIT
