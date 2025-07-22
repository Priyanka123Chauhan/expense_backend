const express = require('express');
const router = express.Router();
const { addExpenses, fetchExpenses, deleteExpenses } = require('../controllers/expenseController');
const ensureAuthenticated = require('../middleware/auth'); // optional

// ✅ Correct usage: handlers must be functions (no parentheses)
router.get('/', ensureAuthenticated, fetchExpenses);
router.post('/', ensureAuthenticated, addExpenses);
router.delete('/delete', ensureAuthenticated, deleteExpenses);


module.exports = router;


// const { addExpenses,fetchExpenses,deleteExpenses } = require('../controllers/expenseController');
// const { ensureAuthenticated } = require('../middleware/authMiddleware');


// const express = require("express");
// const router = express.Router();

// router.post('/',ensureAuthenticated,addExpenses);
// router.get('/expenses', ensureAuthenticated,fetchExpenses); 
// router.get('/',ensureAuthenticated,fetchExpenses);

// router.delete('/:expenseId', deleteExpenses);

// module.exports = router;


