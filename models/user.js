const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
    title: String,
    amount: Number,
    date: { type: Date, required: true },
    // category: String
}, { _id: true });

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true }, // ✅ Add this if missing
    email: { type: String, required: true, unique: true },
    pass: { type: String, required: true },
    expenses: [ExpenseSchema]
}, { timestamps: true }); 
module.exports = mongoose.model('User', UserSchema);
