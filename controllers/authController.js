// controllers/authController.js

const jwt = require("jsonwebtoken");
const { RegisterUser, OTP } = require("../models/customerModel");

// Environment variable for JWT secret
const JWT_SECRET = process.env.JWT_SECRET || "mysingh-ancnbd";

// -----------------------------
// Utility: Generate random 6-digit OTP
// -----------------------------
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// -----------------------------
// Controller: Send OTP
// -----------------------------
const sendOTP = async (req, res) => {
  try {
    const { mobileNumber } = req.body;

    // Validate mobile number
    if (!mobileNumber || !/^\d{10}$/.test(mobileNumber)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid 10-digit mobile number.",
      });
    }

    // Generate new OTP & expiration time
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Delete any existing OTP for this number (cleanup)
    await OTP.deleteOne({ mobileNumber });

    // Create new OTP record
    const newOTP = await OTP.create({ mobileNumber, otp, expiresAt });

    console.log(`✅ OTP for ${mobileNumber}: ${otp}`); // Dev log (remove in production)

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully.",
      testOTP: otp, // For testing only
    });
  } catch (error) {
    console.error("❌ OTP Sending Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error while sending OTP.",
      error: error.message,
    });
  }
};

// -----------------------------
// Controller: Verify OTP
// -----------------------------
const verifyOTP = async (req, res) => {
  try {
    const { mobileNumber, otp, isAdmin } = req.body;

    if (!mobileNumber || !otp) {
      return res.status(400).json({
        success: false,
        message: "Mobile number and OTP are required.",
      });
    }

    // Check if OTP exists
    const otpRecord = await OTP.findOne({ mobileNumber });
    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "OTP not found or expired. Please request a new one.",
      });
    }

    // Validate OTP expiration
    if (new Date() > otpRecord.expiresAt) {
      await OTP.deleteOne({ mobileNumber });
      return res.status(400).json({ success: false, message: "OTP expired. Please request a new one." });
    }

    // Validate OTP code
    if (otpRecord.otp !== otp) {
      otpRecord.attempts += 1;
      await otpRecord.save();

      if (otpRecord.attempts >= 3) {
        await OTP.deleteOne({ mobileNumber });
        return res.status(400).json({
          success: false,
          message: "Too many failed attempts. Please request a new OTP.",
        });
      }

      return res.status(400).json({ success: false, message: "Invalid OTP. Please try again." });
    }

    // OTP is valid — delete it now
    await OTP.deleteOne({ mobileNumber });

    // Find or create user
    let user = await RegisterUser.findOne({ mobileNumber });
    if (!user) {
      user = await RegisterUser.create({
        name: `User-${mobileNumber}`,
        mobileNumber,
        isAdmin: Boolean(isAdmin),
        isVerified: true,
      });
    } else {
      user.isVerified = true;
      await user.save();
    }

    // Generate JWT Token
    const token = jwt.sign(
      {
        userId: user._id,
        mobileNumber: user.mobileNumber,
        isAdmin: user.isAdmin,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully. Login successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        mobileNumber: user.mobileNumber,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error("❌ OTP Verification Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error while verifying OTP.",
      error: error.message,
    });
  }
};

module.exports = { sendOTP, verifyOTP };
