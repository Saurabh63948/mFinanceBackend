// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const helmet = require("helmet");
// const morgan = require("morgan");
// require("dotenv").config();

// // Initialize app
// const app = express();
// const PORT = process.env.PORT || 5000;

// // MongoDB URI (use env variable in production)
// const URI = process.env.MONGODB_URI || "your-default-mongo-uri";

// // Middleware
// app.use(cors());
// app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ limit: "10mb", extended: true }));
// app.use(helmet()); // Adds security headers
// app.use(morgan('combined')); // Logs HTTP requests

// // Connect to MongoDB
// mongoose
//   .connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log("✅ Connected to MongoDB"))
//   .catch((err) => console.error("❌ MongoDB connection error:", err));

// // Import routes
// const customerRoutes = require("./routes/customerRoutes"); // Import customer routes
// const authRoutes = require("./routes/authRoutes"); // Import authentication routes

// // Mount routes
// app.use("/api/customers", customerRoutes); // Mount customer routes
// app.use("/api/auth", authRoutes); // Mount authentication routes

// // Health check route
// app.get("/", (req, res) => {
//   res.send("🚀 Finance Controller Server is running...");
// });

// // Global error handler
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send("Something went wrong!");
// });

// // Start server
// app.listen(PORT, () => {
//   console.log(`🚀 Server running at http://localhost:${PORT}`);
// });



// server.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

// -----------------------------
// App Configuration
// -----------------------------
const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/finance-controller";

// -----------------------------
// Middleware
// -----------------------------
app.use(cors({
  origin: ["https://siddhi-finance.vercel.app/"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(helmet());
app.use(morgan("dev"));

// -----------------------------
// MongoDB Connection
// -----------------------------
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000, // 10s timeout to avoid hanging
  })
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1); // Stop app if DB fails
  });

// -----------------------------
// Routes
// -----------------------------
const customerRoutes = require("./routes/customerRoutes");
const authRoutes = require("./routes/authRoutes");

app.use("/api/customers", customerRoutes);

app.use("/api/auth", authRoutes);

// Health Check Route
app.get("/", (req, res) => {
  res.status(200).send("🚀 Finance Controller Backend is Running...");
});

// -----------------------------
// Global Error Handler
// -----------------------------
app.use((err, req, res, next) => {
  console.error("🔥 Global Error:", err.stack);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: err.message,
  });
});

// -----------------------------
// Start Server
// -----------------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on: http://localhost:${PORT}`);
});
