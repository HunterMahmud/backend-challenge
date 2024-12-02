const express = require("express");
const router = express.Router();
const User = require("../models/model.user");
const { processPayment } = require("../services/service.payment"); 

router.post("/addUser", async (req, res) => {
  try {
    const { name, email, cardNumber, cvc, expiryDate } = req.body;

    // Validate input
    if (!name || !email || !cardNumber || !cvc || !expiryDate) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Process Payment
    const amount = 97;
    const paymentResult = await processPayment({ cardNumber, cvc, expiryDate, amount });

    if (!paymentResult.success) {
      if (paymentResult.error === "Duplicate transaction detected. Please try again after some time.") {
        return res.status(400).json({
          message: "Duplicate transaction detected. Please wait before retrying.",
        });
      }

      return res.status(400).json({
        message: "Payment failed. User creation aborted.",
        error: paymentResult.error,
      });
    }

    // User creation logic...
  } catch (err) {
    res.status(500).json({ message: "Error creating user", error: err });
  }
});


module.exports = router;
