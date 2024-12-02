const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  planStartDate: Date,
  planEndDate: Date,
  paymentDetails: {
    cardNumber: String,
    cvc: String,
    expiryDate: String,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
