const mongoose = require('mongoose');

const mealPlanSchema = new mongoose.Schema({
  corporate: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  planName: { type: String, required: true },
  frequency: { type: String, enum: ['daily', 'weekly', 'monthly'], required: true },
  time: { type: String, required: true }, // e.g., "12:30 PM"
  people: { type: Number, required: true },
  costPerDay: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  menu: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' }],
  status: { type: String, enum: ['active', 'paused', 'completed'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

mealPlanSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('MealPlan', mealPlanSchema);











