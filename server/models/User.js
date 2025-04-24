const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["customer", "tailor"], required: true },
  phone: { type: String, required: true },
  location: String,      // common for both
  shopName: String,      // tailor only
  city: String,          // tailor only
  address: String        // tailor only
});

module.exports = mongoose.model("User", userSchema);
