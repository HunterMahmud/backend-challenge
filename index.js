const express = require('express');
const mongoose = require('mongoose');
const processPayments = require('./cron/cron.subscription');
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const app = express();

// Middlewares
app.use(express.json());

// Database connection with mongoose
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('Database connected'))
  .catch((err) => console.error('Database connection error:', err));

// Start cron job at midnight when 12:00 PM
processPayments();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});
