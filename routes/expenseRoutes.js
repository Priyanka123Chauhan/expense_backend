const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const { authorizeRoles } = require('../middleware/authMiddleware');

// Employee routes
router.post('/', authorizeRoles('employee'), expenseController.addExpense);
router.get('/', authorizeRoles('employee'), expenseController.getOwnExpenses);

// Admin routes
router.get('/all', authorizeRoles('admin'), expenseController.getAllExpenses);
router.get('/all/category-summary', authorizeRoles('admin'), expenseController.getCategorySummary);
router.get('/all/monthly-summary', authorizeRoles('admin'), expenseController.getMonthlySummary);
router.get('/all/overall-summary', authorizeRoles('admin'), expenseController.getOverallSummary);
router.get('/all/expense-overtime-summary', authorizeRoles('admin'), expenseController.getExpenseOvertimeSummary);
router.patch('/:id/status', authorizeRoles('admin'), expenseController.updateExpenseStatus);

module.exports = router;
