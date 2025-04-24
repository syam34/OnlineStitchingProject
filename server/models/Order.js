const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  tailorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  measurements: {
    fabric: String,
    design: String,
    shoulder: String,
    neck: String,
    collar: String,
    chest: String,
    waist: String,
    sleeve: String,
  },
 // URL or file name
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Completed"],
    default: "Pending",
  },
}, {
  timestamps: true
});

module.exports = mongoose.model("Order", orderSchema);
