const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const userRoutes = require('./routes/route.user');
const processPayments = require('./cron/cron.subscription');
const fileUpload = require('./routes/route.fileUpload');
const courseModify = require('./routes/route.course');

const PORT = process.env.PORT || 3000;
const app = express();

// Middlewares
app.use(express.json());

// 1. api for user and payment
app.use('/api/users', userRoutes);
// 2. api for file upload
app.use('/api/file', fileUpload);
// 3. api for file upload
app.use('/', courseModify);

// Database connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Database connected');
    processPayments(); // Start the cron job
  })
  .catch((err) => console.error('Database connection error:', err));

app.get('/', (req, res)=>{
  res.send("server is running....")
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});