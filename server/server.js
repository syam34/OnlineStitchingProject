const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); // ✅ This line is critical

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const orderRoutes = require("./routes/order");
app.use("/api/orders", orderRoutes);

const paymentRoutes = require("./routes/payment");
app.use("/api/payment", paymentRoutes);

app.use("/uploads", express.static("uploads"));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err.message));

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
