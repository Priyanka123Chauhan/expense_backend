const mongoose = require('mongoose');
const Expense = require('../models/expense');
const AuditLog = require('../models/auditLog'); 

// Employee: add expense
const addExpense = async (req, res) => {
    try {
        const { amount, category, date, notes } = req.body;
        const userId = req.user._id;

        // Validate notes max 50 words
        if (notes) {
            const wordCount = notes.trim().split(/\s+/).length;
            if (wordCount > 50) {
                return res.status(400).json({ message: 'Notes cannot exceed 50 words' });
            }
        }

        const expense = new Expense({
            user: userId,
            amount,
            category,
            date,
            notes,
            status: 'pending'
        });

        await expense.save();

        // Log audit
        await AuditLog.create({
            user: userId,
            action: 'create_expense',
            details: `Created expense ${expense._id}`
        });

        res.status(201).json(expense);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Employee: view own expenses
const getOwnExpenses = async (req, res) => {
    try {
        const userId = req.user._id;
        const expenses = await Expense.find({ user: userId });
        res.json(expenses);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Admin: view all expenses with optional filters
const getAllExpenses = async (req, res) => {
    try {
        const { category, status, startDate, endDate, page = 1, limit = 20 } = req.query;
        const filter = {};

        if (category) filter.category = category;
        if (status) filter.status = status;
        if (startDate || endDate) {
            filter.date = {};
            if (startDate) filter.date.$gte = new Date(startDate);
            if (endDate) filter.date.$lte = new Date(endDate);
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const expenses = await Expense.find(filter)
            .sort({ date: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .populate('user', 'name email');

        const totalCount = await Expense.countDocuments(filter);

        res.json({
            expenses,
            totalCount,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalCount / parseInt(limit))
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Admin: update expense status
const updateExpenseStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const userId = req.user._id;

        if (!['pending', 'approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const expense = await Expense.findById(id);
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        expense.status = status;
        await expense.save();

        // Log audit
        await AuditLog.create({
            user: userId,
            action: 'update_expense_status',
            details: `Updated expense ${id} status to ${status}`
        });

        res.json(expense);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Admin: get category summary for expenses
const getCategorySummary = async (req, res) => {
    try {
        console.log('getCategorySummary called by user:', req.user.email, 'role:', req.user.role);
        const { startDate, endDate } = req.query;
        const match = {};
        if (startDate || endDate) {
            match.date = {};
            if (startDate) match.date.$gte = new Date(startDate);
            if (endDate) match.date.$lte = new Date(endDate);
        }
        const summary = await Expense.aggregate([
            { $match: match },
            {
                $group: {
                    _id: '$category',
                    totalAmount: { $sum: '$amount' }
                }
            },
            {
                $project: {
                    _id: 0,
                    category: '$_id',
                    totalAmount: 1
                }
            }
        ]);
        res.json(summary);
    } catch (err) {
        console.error('Error in getCategorySummary:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Admin: get monthly summary for expenses
const getMonthlySummary = async (req, res) => {
    try {
        console.log('getMonthlySummary called by user:', req.user.email, 'role:', req.user.role);
        const { period, month } = req.query; // 'month' or 'quarter'
        const match = {};
        if (month) {
            const start = new Date(`${month}-01T00:00:00.000Z`);
            const end = new Date(start);
            end.setMonth(end.getMonth() + 1);
            match.date = { $gte: start, $lt: end };
        }
        let groupId;

        if (period === 'quarter') {
            groupId = {
                $concat: [
                    { $toString: { $year: '$date' } },
                    '-Q',
                    {
                        $toString: {
                            $ceil: {
                                $divide: [{ $month: '$date' }, 3]
                            }
                        }
                    }
                ]
            };
        } else {
            // default to month
            groupId = { $dateToString: { format: '%Y-%m', date: '$date' } };
        }

        const summary = await Expense.aggregate([
            { $match: match },
            {
                $group: {
                    _id: groupId,
                    totalAmount: { $sum: '$amount' }
                }
            },
            {
                $sort: { _id: 1 }
            },
            {
                $project: {
                    _id: 0,
                    period: '$_id',
                    totalAmount: 1
                }
            }
        ]);
        res.json(summary);
    } catch (err) {
        console.error('Error in getMonthlySummary:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Admin: get overall summary for expenses
const getOverallSummary = async (req, res) => {
    try {
        console.log('getOverallSummary called by user:', req.user.email, 'role:', req.user.role);
        const { period, startDate, endDate } = req.query; // 'month' or 'quarter'
        const match = {};

        if (startDate || endDate) {
            match.date = {};
            if (startDate) match.date.$gte = new Date(startDate);
            if (endDate) match.date.$lte = new Date(endDate);
        }

        let groupId;

        if (period === 'quarter') {
            groupId = {
                $concat: [
                    { $toString: { $year: '$date' } },
                    '-Q',
                    {
                        $toString: {
                            $ceil: {
                                $divide: [{ $month: '$date' }, 3]
                            }
                        }
                    }
                ]
            };
        } else {
            // default to day
            groupId = { $dateToString: { format: '%Y-%m-%d', date: '$date' } };
        }

        const summary = await Expense.aggregate([
            { $match: match },
            {
                $group: {
                    _id: groupId,
                    totalAmount: { $sum: '$amount' }
                }
            },
            {
                $sort: { _id: 1 }
            },
            {
                $project: {
                    _id: 0,
                    period: '$_id',
                    totalAmount: 1
                }
            }
        ]);
        res.json(summary);
    } catch (err) {
        console.error('Error in getOverallSummary:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const getExpenseOvertimeSummary = async (req, res) => {
    try {
        console.log('getExpenseOvertimeSummary called by user:', req.user.email, 'role:', req.user.role);
        const { month } = req.query;
        const match = {};
        if (month) {
            const start = new Date(`${month}-01T00:00:00.000Z`);
            const end = new Date(start);
            end.setMonth(end.getMonth() + 1);
            match.date = { $gte: start, $lt: end };
        }

        // Aggregate expenses by month and calculate cumulative sum
        const monthlyData = await Expense.aggregate([
            { $match: match },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m', date: '$date' } },
                    totalAmount: { $sum: '$amount' }
                }
            },
            { $sort: { _id: 1 } },
            {
                $setWindowFields: {
                    sortBy: { _id: 1 },
                    output: {
                        cumulativeAmount: {
                            $sum: '$totalAmount',
                            window: {
                                documents: ['unbounded', 'current']
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    period: '$_id',
                    totalAmount: 1,
                    cumulativeAmount: 1
                }
            }
        ]);
        res.json(monthlyData);
    } catch (err) {
        console.error('Error in getExpenseOvertimeSummary:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

module.exports = {
    addExpense,
    getOwnExpenses,
    getAllExpenses,
    updateExpenseStatus,
    getCategorySummary,
    getMonthlySummary,
    getOverallSummary,
    getExpenseOvertimeSummary
};
