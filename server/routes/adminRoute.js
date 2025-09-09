const express = require("express");
const router = express.Router();
const { getAllAddresses, loginAdmin, logoutAdmin } = require("../controllers/adminController");
const adminAuth = require("../middleware/adminAuth");
/*
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");

// Protect all routes for admin only
router.use(authMiddleware);
router.use(adminMiddleware);
*/
// Fetch all addresses
router.get("/addresses", getAllAddresses);

router.post("/login", loginAdmin);
// Admin logout
router.post("/logout", adminAuth, logoutAdmin);
module.exports = router;