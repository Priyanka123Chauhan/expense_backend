const UserModel = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const signup = async (req, res) => {
  try {
    const { name, email, pass } = req.body;
    const userExists = await UserModel.findOne({ email });

    if (userExists) {
      return res.status(409).json({ message: 'User already exists! Please login.' });
    }

    const hashedPassword = await bcrypt.hash(pass, 10);
    const newUser = new UserModel({ name, email, pass: hashedPassword });
    await newUser.save();

    return res.status(201).json({ message: 'Signup successful!', success: true });

  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ message: 'Internal Server Error', success: false });
  }
};

const login = async (req, res) => {
  try {
    const { email, pass } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(403).json({ message: 'Email or password is incorrect.', success: false });
    }

    const isPasswordValid = await bcrypt.compare(pass, user.pass);
    if (!isPasswordValid) {
      return res.status(403).json({ message: 'Email or password is incorrect.', success: false });
    }

    
    const jwtToken = jwt.sign(
      { email: user.email, id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    
    return res.status(200).json({
      message: 'Login successful!',
      success: true,
      jwtToken,
      email,
      name: user.name
    });

  } catch (err) {
    console.error('Login error:', err.stack || err);
    return res.status(500).json({ message: 'Internal Server Error', success: false, error: err.message });
  }
};

module.exports = {
  signup,
  login
};
