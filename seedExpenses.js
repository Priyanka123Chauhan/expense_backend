const mongoose = require('mongoose');
const Expense = require('./models/expense');
require('dotenv').config();

async function seedExpenses() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Clear existing expenses
    await Expense.deleteMany({});

    // Sample expense data with multiple categories and months
    const expenses = [
      { user: mongoose.Types.ObjectId(), amount: 100, category: 'Travel', date: new Date('2023-01-15'), notes: 'Flight ticket', status: 'approved' },
      { user: mongoose.Types.ObjectId(), amount: 50, category: 'Food', date: new Date('2023-01-20'), notes: 'Lunch', status: 'approved' },
      { user: mongoose.Types.ObjectId(), amount: 200, category: 'Office Supplies', date: new Date('2023-02-05'), notes: 'Printer ink', status: 'approved' },
      { user: mongoose.Types.ObjectId(), amount: 150, category: 'Entertainment', date: new Date('2023-02-10'), notes: 'Team outing', status: 'approved' },
      { user: mongoose.Types.ObjectId(), amount: 80, category: 'Utilities', date: new Date('2023-03-01'), notes: 'Electricity bill', status: 'approved' },
      { user: mongoose.Types.ObjectId(), amount: 120, category: 'Travel', date: new Date('2023-03-15'), notes: 'Taxi fare', status: 'approved' },
      { user: mongoose.Types.ObjectId(), amount: 60, category: 'Food', date: new Date('2023-04-10'), notes: 'Dinner', status: 'approved' },
      { user: mongoose.Types.ObjectId(), amount: 90, category: 'Other', date: new Date('2023-04-20'), notes: 'Miscellaneous', status: 'approved' }
    ];

    await Expense.insertMany(expenses);
    console.log('Sample expenses seeded successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding expenses:', err);
    process.exit(1);
  }
}

seedExpenses();
