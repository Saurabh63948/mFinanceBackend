// const express = require("express");
// const router = express.Router();
// const { Customer } = require("../models/customerModel");
// const authenticateToken = require("../authMiddleware"); // Middleware import

// // ✅ Create a new customer (This route could be public or protected, depending on your requirements)
// router.post("/", async (req, res) => {
//   try {
//     const { name, aadhaarNumber, mobileNumber, totalPayableAmount, interestRatePercent, paidAmount = 0, loanAmount, loanStartDate, durationInDays, aadhaarPhotoUrl, repaymentHistory = [], fines = [] } = req.body;

//     if (!name || !aadhaarNumber || !mobileNumber || !totalPayableAmount || !interestRatePercent) {
//       return res.status(400).json({ error: "Missing required fields" });
//     }

//     // Validate aadhaarNumber (length check, assuming 12-digit number)
//     if (!/^\d{12}$/.test(aadhaarNumber)) {
//       return res.status(400).json({ error: "Invalid Aadhaar Number. It should be 12 digits." });
//     }

//     // Validate mobileNumber (length check, assuming 10-digit number)
//     if (!/^\d{10}$/.test(mobileNumber)) {
//       return res.status(400).json({ error: "Invalid Mobile Number. It should be 10 digits." });
//     }

//     const remainingAmount = totalPayableAmount - paidAmount;

//     const newCustomer = new Customer({
//       name,
//       aadhaarNumber,
//       mobileNumber,
//       totalPayableAmount,
//       interestRatePercent,
//       paidAmount,
//       remainingAmount,
//       loanAmount,
//       loanStartDate,
//       durationInDays,
//       aadhaarPhotoUrl,
//       repaymentHistory,
//       fines,
//     });

//     await newCustomer.save();
//     res.status(201).json(newCustomer);
//   } catch (error) {
//     console.error("Error creating customer:", error.message);
//     res.status(400).json({ error: error.message });
//   }
// });

// // ✅ Get all customers (Protected route using JWT)
// router.get("/", authenticateToken, async (req, res) => { // Middleware applied here
//   try {
//     const customers = await Customer.find();
//     res.status(200).json(customers);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // ✅ Add payment to customer (Protected route using JWT)
// router.post('/:id/add-payment', authenticateToken, async (req, res) => { // Middleware applied here
//   try {
//     const { amount, date } = req.body;

//     const customer = await Customer.findById(req.params.id);
//     if (!customer) {
//       return res.status(404).json({ message: 'Customer not found' });
//     }

//     const paymentAmount = Number(amount);
//     if (isNaN(paymentAmount) || paymentAmount <= 0) {
//       return res.status(400).json({ message: 'Invalid payment amount' });
//     }

//     const paymentDate = date ? new Date(date) : new Date();

//     customer.repaymentHistory.push({
//       date: paymentDate.toISOString().split("T")[0],
//       amountPaid: paymentAmount,
//     });

//     customer.paidAmount += paymentAmount;
//     customer.remainingAmount = customer.totalPayableAmount - customer.paidAmount;

//     await customer.save();
//     res.status(200).json({ message: 'Payment added successfully', customer });

//   } catch (error) {
//     console.error('Payment error:', error);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// module.exports = router; // Export the router



const express = require("express")
const router = express.Router()
const { Customer } = require("../models/customerModel")
const { authenticateToken, adminOnly } = require("../authMiddleware")

router.post("/", authenticateToken, adminOnly, async (req, res) => {
  try {
    const {
      name,
      aadhaarNumber,
      mobileNumber,
      totalPayableAmount,
      interestRatePercent,
      paidAmount = 0,
      loanAmount,
      loanStartDate,
      durationInDays,
      aadhaarPhotoUrl,
      repaymentHistory = [],
      fines = [],
    } = req.body

    if (!name || !aadhaarNumber || !mobileNumber || !totalPayableAmount || !interestRatePercent) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    if (!/^\d{12}$/.test(aadhaarNumber)) {
      return res.status(400).json({ error: "Invalid Aadhaar Number" })
    }

    if (!/^\d{10}$/.test(mobileNumber)) {
      return res.status(400).json({ error: "Invalid Mobile Number" })
    }

    const remainingAmount = totalPayableAmount - paidAmount

    const newCustomer = new Customer({
      name,
      aadhaarNumber,
      mobileNumber,
      totalPayableAmount,
      interestRatePercent,
      paidAmount,
      remainingAmount,
      loanAmount,
      loanStartDate,
      durationInDays,
      aadhaarPhotoUrl,
      repaymentHistory,
      fines,
    })

    await newCustomer.save()
    res.status(201).json(newCustomer)
  } catch (error) {
    console.error("Error creating customer:", error.message)
    res.status(400).json({ error: error.message })
  }
})

router.get("/", authenticateToken, adminOnly, async (req, res) => {
  try {
    const customers = await Customer.find()
    res.status(200).json(customers)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get("/by-mobile/:mobileNumber", authenticateToken, async (req, res) => {
  try {
    // Users can only see their own data
    if (req.user.mobileNumber !== req.params.mobileNumber && !req.user.isAdmin) {
      return res.status(403).json({ error: "Unauthorized" })
    }

    const customer = await Customer.findOne({ mobileNumber: req.params.mobileNumber })
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" })
    }

    res.status(200).json(customer)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.put("/:id", authenticateToken, adminOnly, async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" })
    }
    res.status(200).json(customer)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.delete("/:id", authenticateToken, adminOnly, async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id)
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" })
    }
    res.status(200).json({ message: "Customer deleted successfully" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post("/:id/add-payment", authenticateToken, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id)
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" })
    }

    // Check authorization
    if (customer.mobileNumber !== req.user.mobileNumber && !req.user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized" })
    }

    const { amount, date } = req.body
    const paymentAmount = Number(amount)

    if (isNaN(paymentAmount) || paymentAmount <= 0) {
      return res.status(400).json({ message: "Invalid payment amount" })
    }

    const paymentDate = date ? new Date(date) : new Date()

    customer.repaymentHistory.push({
      date: paymentDate.toISOString().split("T")[0],
      amountPaid: paymentAmount,
    })

    customer.paidAmount += paymentAmount
    customer.remainingAmount = customer.totalPayableAmount - customer.paidAmount

    await customer.save()
    res.status(200).json({ message: "Payment added successfully", customer })
  } catch (error) {
    console.error("Payment error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Add Fine
router.post("/:id/add-fine", authenticateToken, adminOnly, async (req, res) => {
  try {
    const { amount, reason, date } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid fine amount" });
    }

    if (!reason || reason.trim() === "") {
      return res.status(400).json({ message: "Reason is required" });
    }

    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const fineDate = date ? new Date(date) : new Date();

    customer.fines.push({
      date: fineDate.toISOString().split("T")[0],
      amount,
      reason,
    });

    customer.totalPayableAmount += amount;
    customer.remainingAmount += amount;

    await customer.save();

    res.status(200).json({ message: "Fine added successfully", customer });
  } catch (error) {
    console.error("Error adding fine:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router
