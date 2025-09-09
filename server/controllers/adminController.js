// controllers/adminController.js
const Address = require("../models/Address");
const User = require("../models/User");
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ===========================
// Get all addresses
// ===========================
exports.getAllAddresses = async (req, res) => {
  try {
    const addresses = await Address.find().populate("userId", "name email");
    res.json(addresses);
  } catch (err) {
    console.error("❌ Fetch all addresses error:", err);
    res.status(500).json({ error: "Failed to fetch addresses" });
  }
};

// ===========================
// Admin Login
// ===========================
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: admin._id, email: admin.email }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // cookie config
    const cookieConfig = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // only true in prod HTTPS
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    };

    res.cookie("adminToken", token, cookieConfig);
    res.json({ message: "Login successful", email: admin.email });
  } catch (err) {
    console.error("❌ Admin login error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ===========================
// Admin Dashboard (Auth Check)
// ===========================
exports.getAdminDashboard = async (req, res) => {
  try {
    const token = req.cookies.adminToken;
    if (!token) {
      return res.status(401).json({ message: "Not logged in" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select("email");
    if (!admin) {
      return res.status(401).json({ message: "Invalid token" });
    }

    res.json({ email: admin.email });
  } catch (err) {
    console.error("❌ Admin dashboard error:", err.message);
    res.status(401).json({ message: "Unauthorized" });
  }
};

// ===========================
// Admin Logout
// ===========================
exports.logoutAdmin = (req, res) => {
  res.clearCookie("adminToken");
  res.json({ message: "Logout successful" });
};