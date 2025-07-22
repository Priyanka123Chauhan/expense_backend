const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const expenseRoutes = require('./routes/expenseRoutes'); 
const ensureAuthenticated = require('./middleware/auth');

require('dotenv').config(); 
require('./models/db');     

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json()); // <--- This is required
app.use(cors());
app.use(bodyParser.json());
app.use('/auth', authRoutes);
app.use('/product', productRoutes);
app.use('/api/expenses', expenseRoutes); 

app.get('/', (req, res) => res.send('API Running'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
