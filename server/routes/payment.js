// server/routes/payment.js
const express = require("express");
const Razorpay = require("razorpay");
const router = express.Router();

const razorpay = new Razorpay({
  key_id: "rzp_test_BeZSFh7zVBmaAy",     // <-- Your Test Key ID
  key_secret: "Jus77vJ6SdAvTCaFw1pzCKDh",         // <-- Your Test Secret Key
});

// Create Order
router.post("/create-order", async (req, res) => {
  const { amount } = req.body;

  try {
    const options = {
      amount: amount * 100, // Razorpay accepts amount in paise (100 = ₹1)
      currency: "INR",
      receipt: "receipt_order_" + Math.random().toString(36).substring(2),
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (err) {
    console.error("Payment error:", err);
    res.status(500).json({ msg: "Something went wrong!" });
  }
});

module.exports = router;
