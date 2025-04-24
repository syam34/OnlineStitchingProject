const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Register Route
router.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      phone,
      location,
      shopName,
      city,
      address,
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      phone,
      location,
      shopName: role === "tailor" ? shopName : "",
      city: role === "tailor" ? city : "",
      address: role === "tailor" ? address : ""
    });

    await user.save();
    res.status(201).json({ msg: "User registered successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid email or password" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        location: user.location,
        shopName: user.shopName,
        city: user.city,
        address: user.address
      }
    });
    
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

router.get("/tailors", async (req, res) => {
  const location = req.query.location;

  try {
    const filter = { role: "tailor" };
    if (location) filter.location = location;

    const tailors = await User.find(filter).select("-password");
    res.json(tailors);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch tailors" });
  }
});

router.put("/update/:id", async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: "Failed to update user" });
  }
});



module.exports = router;
