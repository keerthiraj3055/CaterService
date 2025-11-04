const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  corporate: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  invoiceId: { type: String, unique: true, required: true },
  date: { type: Date, default: Date.now },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'paid', 'overdue'], default: 'pending' },
  items: [{
    description: String,
    quantity: Number,
    price: Number,
  }],
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  mealPlan: { type: mongoose.Schema.Types.ObjectId, ref: 'MealPlan' },
  createdAt: { type: Date, default: Date.now }
});

// Generate invoice ID before saving
invoiceSchema.pre('save', async function(next) {
  if (!this.invoiceId) {
    const count = await mongoose.model('Invoice').countDocuments();
    this.invoiceId = `INV-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Invoice', invoiceSchema);











