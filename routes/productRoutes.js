const { login, signup } = require('../controllers/authController');
const { signupValidation, loginValidation } = require('../middleware/authMiddleware');

const router = require('express').Router();


router.get('/',(req,res) =>
{    console.log('logged in user detail',req.user)

    res.send(200).json([
        {
            name: "Mobile",
            Price:2000000
        },
        {
            name: "TV",
            Price:300000

        }
    ])
});


module.exports = router;
