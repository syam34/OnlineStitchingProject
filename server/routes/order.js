const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const upload = require("../middleware/upload");
const axios = require("axios");
const fs = require("fs");

// Place Order
router.post("/place", upload.single("designFile"), async (req, res) => {
  const { customerId, tailorId, fabric } = req.body;
  let measurements = null;

  if (req.body.measurements) {
    try {
      measurements = JSON.parse(req.body.measurements);
    } catch (err) {
      console.error("Failed to parse measurements JSON:", err);
    }
  }

  const designPath = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const order = new Order({
      customerId,
      tailorId,
      fabric,
      design: designPath,
      measurements,
      status: "Pending", // Always start with Pending
    });

    await order.save();
    res.status(201).json({ msg: "Order placed successfully!" });
  } catch (err) {
    console.error("Error saving order:", err);
    res.status(500).json({ msg: "Failed to place order" });
  }
});

// Analyze Media (send file to Flask)
router.post("/analyze-media", upload.single("media"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }

    const fileStream = fs.createReadStream(file.path);
    const formData = new FormData();
    formData.append("media", fileStream);

    const flaskResponse = await axios.post("http://localhost:5001/analyze", formData, {
      headers: formData.getHeaders(),
    });

    res.json({ measurements: flaskResponse.data.measurements });
  } catch (err) {
    console.error("Error analyzing media:", err.message);
    res.status(500).json({ msg: "Failed to analyze media" });
  }
});

// Edit an Order (Customer can update fabric/image if Pending)
router.put("/edit/:orderId", upload.single("designFile"), async (req, res) => {
  const updates = { fabric: req.body.fabric };
  if (req.file) {
    updates.design = `/uploads/${req.file.filename}`;
  }
  try {
    await Order.findByIdAndUpdate(req.params.orderId, updates);
    res.json({ msg: "Order updated successfully" });
  } catch (err) {
    console.error("Error updating order:", err);
    res.status(500).json({ msg: "Failed to update order" });
  }
});

// Delete an Order (Cancel)
router.delete("/delete/:id", async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get Orders for a Customer
router.get("/customer/:customerId", async (req, res) => {
  try {
    const customerOrders = await Order.find({ customerId: req.params.customerId }).populate('tailorId');
    res.json(customerOrders);
  } catch (err) {
    console.error("Error fetching customer orders:", err);
    res.status(500).json({ message: "Failed to fetch customer orders" });
  }
});

// Get Orders for a Tailor
router.get("/tailor/:tailorId", async (req, res) => {
  try {
    const tailorOrders = await Order.find({ tailorId: req.params.tailorId }).populate('customerId');
    res.json(tailorOrders);
  } catch (err) {
    console.error("Error fetching tailor orders:", err);
    res.status(500).json({ message: "Failed to fetch tailor orders" });
  }
});


// Update Order Status
router.put("/status/:orderId", async (req, res) => {
  try {
    await Order.findByIdAndUpdate(req.params.orderId, { status: req.body.status });
    res.json({ msg: "Order status updated" });
  } catch (err) {
    console.error("Error updating status:", err);
    res.status(500).json({ msg: "Failed to update status" });
  }
});


// Mark Order as Paid (NEW ROUTE)
router.put("/mark-paid/:orderId", async (req, res) => {
  try {
    await Order.findByIdAndUpdate(req.params.orderId, { status: "Paid" });
    res.json({ msg: "Order marked as paid" });
  } catch (err) {
    console.error("Error marking paid:", err);
    res.status(500).json({ msg: "Failed to mark paid" });
  }
});

// Update Order Paid Status
router.put("/pay/:orderId", async (req, res) => {
  try {
    await Order.findByIdAndUpdate(req.params.orderId, { paid: true });
    res.json({ msg: "Payment successful, order updated" });
  } catch (err) {
    console.error("Payment update error:", err.message);
    res.status(500).json({ msg: "Failed to update payment" });
  }
});


// Existing routes (get tailor orders, customer orders, update status)...

module.exports = router;
