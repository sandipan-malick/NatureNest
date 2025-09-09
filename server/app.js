const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

// Routes
const userRoutes = require("./routes/userRoute");
const paymentRoutes = require("./routes/paymentRoute");
const addressRoutes = require("./routes/addressRoute");
const locationRoutes = require("./routes/locationRoute");
const adminRoutes = require("./routes/adminRoute");
const productRoutes = require("./routes/productRoute");
const cartRoutes = require("./routes/cartRoute");

// Middleware
const authMiddleware = require("./middleware/authMiddleware");
const adminAuth = require("./middleware/adminAuth");

// Load environment variables
dotenv.config();

// Connect MongoDB
connectDB();

const app = express();

// Allow origins (update when you deploy frontend)
const allowedOrigins = [
    "https://nature-nest-internship-project.netlify.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, 
  })
);

app.use(express.json());
app.use(cookieParser());

// ========== API Routes ==========

app.use("/api/user", userRoutes);
app.use("/api/payment", paymentRoutes); 
app.use("/api/address", addressRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);

// ========== Protected Routes (User) ==========
app.get("/", authMiddleware, (req, res) => {
  res.send("Welcome to landing page");
});
app.get("/all-product", authMiddleware, (req, res) => {
  res.send("Welcome to all product");
});
app.get("/product-cart", authMiddleware, (req, res) => {
  res.send("Welcome to product cart");
});
app.get("/product-history", authMiddleware, (req, res) => {
  res.send("Welcome to product history");
});

app.get("/cart", authMiddleware, (req, res) => {
  res.send("Welcome to cart");
});

// ========== Protected Routes (Admin) ==========
app.get("/admin-dashboard", adminAuth, (req, res) => {
  res.send("Welcome to admin dashboard");
});

app.get("/admin-order", adminAuth, (req, res) => {
  res.send("Welcome to admin order");
});
app.get("/admin-product-dashboard", adminAuth, (req, res) => {
  res.send("Welcome to admin product dashboard");
});

// ========== Server ==========
const PORT = process.env.PORT || 5080;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
