const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const upload = require("../middleware/upload");


// Place Order
router.post("/place", upload.single("designFile"), async (req, res) => {
    console.log("🔥 Received POST /place request");
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
  
    const { customerId, tailorId, fabric } = req.body;
    const design = req.file ? `/uploads/${req.file.filename}` : "";
  
    if (!customerId || !tailorId || !fabric) {
      return res.status(400).json({ msg: "Missing required fields", data: req.body });
    }

    const measurements = {
      shoulder: req.body.shoulder,
      neck: req.body.neck,
      collar: req.body.collar,
      chest: req.body.chest,
      waist: req.body.waist,
      sleeve: req.body.sleeve,
    };
    
    try {
      const order = new Order({ customerId, tailorId, fabric, design });
      await order.save();
      console.log("✅ Order saved!");
      res.status(201).json({ msg: "Order placed successfully!" });
    } catch (err) {
      console.log("❌ Order save failed:", err.message);
      res.status(500).json({ msg: "Failed to place order", error: err.message });
    }
  });
  
// Get Orders for a Tailor
router.get("/tailor/:tailorId", async (req, res) => {
    try {
      const orders = await Order.find({ tailorId: req.params.tailorId }).populate("customerId", "name email");
      res.json(orders);
    } catch (err) {
      res.status(500).json({ msg: "Failed to fetch orders" });
    }
  });
  
  // Update Order Status
  router.put("/status/:orderId", async (req, res) => {
    try {
      await Order.findByIdAndUpdate(req.params.orderId, { status: req.body.status });
      res.json({ msg: "Order status updated" });
    } catch (err) {
      res.status(500).json({ msg: "Failed to update status" });
    }
  });
  
  // Get all orders for a customer
router.get("/customer/:customerId", async (req, res) => {
    try {
      const orders = await Order.find({ customerId: req.params.customerId })
        .populate("tailorId", "name email");
      res.json(orders);
    } catch (err) {
      res.status(500).json({ msg: "Failed to fetch orders" });
    }
  });
  
  // Edit Order
router.put("/edit/:orderId", upload.single("designFile"), async (req, res) => {
  const { fabric } = req.body;
  let updateData = { fabric };

  if (req.file) {
    updateData.design = `/uploads/${req.file.filename}`;
  }

  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ msg: "Order not found" });
    if (order.status !== "Pending") return res.status(400).json({ msg: "Only pending orders can be edited" });

    await Order.findByIdAndUpdate(req.params.orderId, updateData);
    res.json({ msg: "Order updated successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Failed to update order" });
  }
});

// Delete Order
router.delete("/delete/:orderId", async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ msg: "Order not found" });
    if (order.status !== "Pending") return res.status(400).json({ msg: "Only pending orders can be cancelled" });

    await Order.findByIdAndDelete(req.params.orderId);
    res.json({ msg: "Order cancelled successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Failed to cancel order" });
  }
});


// (Optional: Add order status update route for tailors later)

module.exports = router;
