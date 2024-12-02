const cron = require('node-cron');
const User = require('../models/model.user');
const { processPayment } = require('../services/service.payment');

const processPayments = async () => {
  const now = new Date();

  try {
    const users = await User.find({
      planEndDate: { $lt: now },
      status: 'active',
    });

    for (const user of users) {
      console.log(`Processing payment for: ${user.email}`);
      try {
        const paymentResult = await processPayment({
          cardNumber: user.paymentDetails.cardNumber,
          expiryDate: user.paymentDetails.expiryDate,
          cvc: user.paymentDetails.cvc,
          amount: 97, // Charging $97 as per requirements
        });

        if (paymentResult.success) {
          user.planEndDate = new Date(now.setMonth(now.getMonth() + 1)); // Extend by 1 month
          await user.save();
          console.log(`Payment successful for ${user.email}`);
        }
      } catch (err) {
        user.status = 'inactive';
        await user.save();
        console.error(`Payment failed for ${user.email}:`, err);
      }
    }
  } catch (error) {
    console.error('Error processing payments:', error);
  }
};

// Schedule the job to run at midnight every day
cron.schedule('0 0 * * *', processPayments);

module.exports = processPayments;
