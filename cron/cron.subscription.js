const cron = require('node-cron');
const User = require('../models/model.user');

const processPayments = async () => {
  const now = new Date();

  try {
    const users = await User.find({
      planEndDate: { $lt: now },
      status: 'active',
    });

    for (const user of users) {
      // i have to add Authorize.net API later
      const paymentSuccess = true; // testing purpose payment status to just for testing
      console.log(`Processing payment for: ${user?.email}`);

      if (paymentSuccess) {
        user.planEndDate = new Date(now.setMonth(now.getMonth() + 1)); // + 1 month extend
        await user.save();
        console.log(`Payment successful for ${user?.email}`);
      } else {
        user.status = 'inactive';
        await user.save();
        console.log(`Payment failed ${user?.email}`);
      }
    }
  } catch (error) {
    console.error('Error processing payments:', error);
  }
};

// Schedule the job to run at midnight every day
cron.schedule('0 0 * * *', processPayments);

module.exports = processPayments;
