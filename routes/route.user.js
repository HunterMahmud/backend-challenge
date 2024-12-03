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

    // Set default values for plan dates
    const planStartDate = new Date();
    let planEndDate = null; // if payment fails then null

    let status = "inactive"; // Default is inactive

    if (paymentResult.success) {
      // Update dates and status for successful payment
      planEndDate = new Date();
      planEndDate.setMonth(planEndDate.getMonth() + 1); // Add 1 month to current date
      status = "active";
    }

    // Save user to database
    const newUser = new User({
      name,
      email,
      status,
      planStartDate,
      planEndDate,
      paymentDetails: {
        cardNumber,
        cvc,
        expiryDate,
      },
    });

    await newUser.save();

    res.status(201).json({
      message: paymentResult.success
        ? "User created successfully with initial payment processed."
        : "User created but initial payment failed.",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        status: newUser.status,
        planStartDate: newUser.planStartDate,
        planEndDate: newUser.planEndDate,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Error creating user", error: err });
  }
});


module.exports = router;