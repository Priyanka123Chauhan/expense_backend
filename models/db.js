// const mongoose = require('mongoose');
// const mongo_url = process.env.MONGO_CONN;
// mongoose.connect(mongo_url)
//     .then(() =>
//     {
//         console.log('MongoDB connected!!');
//     })
//     .catch((err) =>
//     {
//         console.log('MongoDB Error!!',err);
//     })

const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Error!!', err));
