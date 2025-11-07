// const mongoose = require("mongoose");

// // ----- Customer Schema -----
// const customerSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     aadhaarNumber: { type: String, required: true, unique: true },
//     mobileNumber: { type: String, required: true },

//     loanAmount: { type: Number, required: true },
//     interestRatePercent: { type: Number, required: true },
//     totalPayableAmount: { type: Number, required: true },
//     remainingAmount: { type: Number, required: true },
//     paidAmount: { type: Number, default: 0 },

//     aadhaarPhotoUrl: { type: String },
//     loanStartDate: { type: Date },
//     durationInDays: { type: Number },
//     isActive: { type: Boolean, default: true },

//     repaymentHistory: [
//       {
//         date: String,
//         amountPaid: Number,
//       },
//     ],

//     fines: [
//       {
//         date: String,
//         amount: Number,
//         reason: String,
//       },
//     ],
//   },
//   { timestamps: true }
// );

// // ----- RegisterUser Schema -----
// const registerUserSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     mobile: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     isHost: { type: Boolean, default: false }, // ⭐ Host ya Admin ka flag
//   },
//   { timestamps: true }
// );

// // ----- Create Models -----
// const Customer = mongoose.model("Customer", customerSchema);
// const RegisterUser = mongoose.model("RegisterUser", registerUserSchema);

// // ----- Export Models -----
// module.exports = { Customer, RegisterUser };


const mongoose = require("mongoose")

// ----- OTP Schema -----
const otpSchema = new mongoose.Schema(
  {
    mobileNumber: { type: String, required: true, unique: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    attempts: { type: Number, default: 0 },
  },
  { timestamps: true },
)

// ----- Customer Schema -----
const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    aadhaarNumber: { type: String, required: true, unique: true },
    mobileNumber: { type: String, required: true, unique: true },

    loanAmount: { type: Number, required: true },
    interestRatePercent: { type: Number, required: true },
    totalPayableAmount: { type: Number, required: true },
    remainingAmount: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },

    aadhaarPhotoUrl: { type: String },
    loanStartDate: { type: Date },
    durationInDays: { type: Number },
    isActive: { type: Boolean, default: true },

    repaymentHistory: [
      {
        date: String,
        amountPaid: Number,
      },
    ],

    fines: [
      {
        date: String,
        amount: Number,
        reason: String,
      },
    ],
  },
  { timestamps: true },
)

// ----- RegisterUser Schema -----
const registerUserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    mobileNumber: { type: String, required: true, unique: true },
    isAdmin: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true },
)

// ----- Create Models -----
const Customer = mongoose.model("Customer", customerSchema)
const RegisterUser = mongoose.model("RegisterUser", registerUserSchema)
const OTP = mongoose.model("OTP", otpSchema)

// ----- Export Models -----
module.exports = { Customer, RegisterUser, OTP }
