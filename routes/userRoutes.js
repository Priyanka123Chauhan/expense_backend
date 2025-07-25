const express = require('express');
const router = express.Router();
const { getUserById } = require('../controllers/userController');
const ensureAuthenticated = require('../middleware/auth');

router.get('/:id', ensureAuthenticated, getUserById);

module.exports = router;
