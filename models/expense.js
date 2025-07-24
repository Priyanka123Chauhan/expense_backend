const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    date: { type: Date, required: true },
    notes: { 
        type: String,
        validate: {
            validator: function(value) {
                if (!value) return true; // allow empty notes
                const wordCount = value.trim().split(/\s+/).length;
                return wordCount <= 50;
            },
            message: 'Notes cannot exceed 50 words'
        }
    },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Expense', ExpenseSchema);
