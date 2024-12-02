const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const userRoutes = require('./routes/routes.user');
const processPayments = require('./cron/cron.subscription');

const PORT = process.env.PORT || 3000;
const app = express();

// Middlewares
app.use(express.json());
app.use('/api/users', userRoutes);

// Database connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Database connected');
    processPayments(); // Start the cron job
  })
  .catch((err) => console.error('Database connection error:', err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});