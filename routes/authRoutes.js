// const express = require('express');
// const router = express.Router();
// const { registerUser, loginUser } = require('../controllers/authController');

// // Route to handle registration
// router.post('/register', registerUser);

// // Route to handle login
// router.post('/login', loginUser);

// module.exports = router;























// // const bcrypt = require("bcryptjs");
// // const jwt = require("jsonwebtoken");
// // const { RegisterUser, Customer } = require("../models/customerModel"); // Import RegisterUser and Customer models

// // // Register user
// // const registerUser = async (req, res) => {
// //   const { name, email, mobile, password } = req.body;

// //   const JWT_SECRET = process.env.JWT_SECRET || "mysingh-ancnbd";

// //   if (!JWT_SECRET) {
// //     return res.status(500).json({ success: false, message: "JWT_SECRET is missing" });
// //   }

// //   try {
// //     // Check if user already exists by email or mobile
// //     const existingUser = await RegisterUser.findOne({
// //       $or: [{ email }, { mobile }]
// //     });

// //     if (existingUser) {
// //       return res.status(400).json({ success: false, message: "User already exists" });
// //     }

// //     // Hash password
// //     const hashedPassword = await bcrypt.hash(password, 10);

// //     // Create new user
// //     const newUser = new RegisterUser({
// //       name,
// //       email,
// //       mobile,
// //       password: hashedPassword,
// //     });

// //     // Save the new user
// //     await newUser.save();

// //     // After registering, check if the user is a customer
// //     const customer = await Customer.findOne({
// //       $or: [{ email: newUser.email }, { mobile: newUser.mobile }],
// //     });

// //     if (!customer) {
// //       // If not found in customer list, you might redirect them to the home page
// //       return res.status(200).json({
// //         success: true,
// //         message: "User registered successfully. Please complete your customer profile.",
// //         redirectToHomePage: true, // A flag to redirect to the home page
// //       });
// //     }

// //     res.status(201).json({
// //       success: true,
// //       message: "User registered successfully and added to the customer list.",
// //     });

// //   } catch (err) {
// //     console.error("Registration error:", err);
// //     res.status(500).json({ success: false, message: "Server error in user register" });
// //   }
// // };

// // // Login user
// // const loginUser = async (req, res) => {
// //   const { identifier, password } = req.body;
// //   // identifier = email OR mobile

// //   const JWT_SECRET = process.env.JWT_SECRET || "mysingh-ancnbd";

// //   if (!JWT_SECRET) {
// //     return res.status(500).json({ success: false, message: "JWT_SECRET is missing" });
// //   }

// //   try {
// //     // Find user by email or mobile
// //     const user = await RegisterUser.findOne({
// //       $or: [{ email: identifier }, { mobile: identifier }]
// //     });

// //     if (!user) {
// //       return res.status(404).json({ success: false, message: "User not found" });
// //     }

// //     // Compare password
// //     const isPasswordValid = await bcrypt.compare(password, user.password);
// //     if (!isPasswordValid) {
// //       return res.status(400).json({ success: false, message: "Incorrect password" });
// //     }

// //     // Check if the user exists in the customer list
// //     const customer = await Customer.findOne({
// //       $or: [{ email: user.email }, { mobile: user.mobile }]
// //     });

// //     // If the user is not in the customer list, restrict access to the dashboard
// //     if (!customer) {
// //       return res.status(403).json({ success: false, message: "User is not a registered customer. Please complete your profile." });
// //     }

// //     // Create JWT token
// //     const token = jwt.sign(
// //       {
// //         userId: user._id,
// //         email: user.email,
// //         isHost: user.isHost, // ⭐ Include user host status if needed
// //       },
// //       JWT_SECRET,
// //       { expiresIn: "7d" }  // You can change this depending on your session needs
// //     );

// //     res.json({
// //       success: true,
// //       message: "User login successful",
// //       token,
// //       user: {
// //         id: user._id,
// //         name: user.name,
// //         email: user.email,
// //         mobile: user.mobile,
// //         isHost: user.isHost, // Return the host status in the response
// //       }
// //     });

// //   } catch (error) {
// //     console.error("Login error:", error);
// //     res.status(500).json({ success: false, message: "Server error" });
// //   }
// // };

// // module.exports = { registerUser, loginUser };



// routes/authRoutes.js
const express = require("express");
const router = express.Router();

// Import controller functions
const { sendOTP, verifyOTP } = require("../controllers/authController");
const { addFine, removeFine } =require('../controllers/fineController')
// -------------------------
// Auth Routes
// -------------------------

// @route   POST /api/auth/send-otp
// @desc    Send OTP to user's mobile number
router.post("/send-otp", sendOTP);

// @route   POST /api/auth/verify-otp
// @desc    Verify OTP and create/verify user account
router.post("/verify-otp", verifyOTP);

// Export router
module.exports = router;
