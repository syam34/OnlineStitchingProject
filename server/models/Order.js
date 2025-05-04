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
    shoulder: String,
    neck: String,
    chest: String,
    waist: String,
    sleeve: String,
    collar: String,
  },
 // URL or file name
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Completed"],
    default: "Pending",
  },
  paid: {
    type: Boolean,
    default: false
  },
  fabric: {
    type: String,
    required: true,
  },  
}, {
  timestamps: true
});

module.exports = mongoose.model("Order", orderSchema);
