const { login, signup } = require('../controllers/authController');
const { signupValidation, loginValidation } = require('../middleware/authMiddleware');

const router = require('express').Router();


router.post('/login', loginValidation,login);

router.post('/signup', signupValidation,signup);


module.exports = router;
