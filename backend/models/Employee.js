const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    hourlyRate: {
        type: Number,
        required: true,
        default: 0
    },
    bankAccount: {
        type: String
    },
    routingNumber: {
        type: String
    },
    availableDays: [{
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    }],
    specialties: [{
        type: String
    }],
    events: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Employee', EmployeeSchema);