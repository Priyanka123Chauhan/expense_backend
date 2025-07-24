const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authController');
const userRoutes = require('./userRoutes');

router.post('/signup', signup);
router.post('/login', login);

// Mount user routes
router.use('/users', userRoutes);

module.exports = router;
