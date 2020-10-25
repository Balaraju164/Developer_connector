const express = require('express');
const { mongo, Mongoose } = require('mongoose');
const connectDB = require('./config/db');
const app = express();

//@connect DB
connectDB();

//Init middleware

app.use(express.json({ extended: false }));

app.get('/', (req, res) => {
  res.send('API is running....');
});

//@Define routes
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/users', require('./routes/api/users'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server connected to ${PORT}`);
});
