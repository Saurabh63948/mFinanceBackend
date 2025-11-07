const express = require("express");
const router = express.Router();
const Customer = require("../models/customerModel");

// ✅ Create a new customer
router.post("/", async (req, res) => {
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
    } = req.body;

    if (!name || !aadhaarNumber || !mobileNumber || !totalPayableAmount || !interestRatePercent) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const remainingAmount = totalPayableAmount - paidAmount;

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
    });

    await newCustomer.save();
    res.status(201).json(newCustomer);
  } catch (error) {
    console.error("Error creating customer:", error.message);
    res.status(400).json({ error: error.message });
  }
});

// ✅ Get all customers
router.get("/", async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Add payment to a customer's account
router.post('/:id/add-payment', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const { amount, date } = req.body;
    const paymentAmount = Number(amount);

    if (isNaN(paymentAmount) || paymentAmount <= 0) {
      return res.status(400).json({ message: 'Invalid payment amount' });
    }

    const paymentDate = date ? new Date(date) : new Date();

    // Add payment to repayment history
    customer.repaymentHistory.push({
      date: paymentDate.toISOString().split("T")[0],
      amountPaid: paymentAmount,
    });

    // Update paid and remaining
    customer.paidAmount += paymentAmount;
    customer.remainingAmount = customer.totalPayableAmount - customer.paidAmount;

    await customer.save();

    res.status(200).json({ message: 'Payment added successfully', customer });
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ✅ Add late fee to a customer's account
router.post('/:id/add-late-fee', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const { amount, date } = req.body;
    const lateFeeAmount = Number(amount);

    if (isNaN(lateFeeAmount) || lateFeeAmount <= 0) {
      return res.status(400).json({ message: 'Invalid late fee amount' });
    }

    const feeDate = date ? new Date(date) : new Date();

    // Add to fines array
    customer.fines.push({
      date: feeDate.toISOString().split("T")[0],
      amount: lateFeeAmount,
    });

    // Only update totalPayableAmount, then recalculate remaining
    customer.totalPayableAmount += lateFeeAmount;
    customer.remainingAmount = customer.totalPayableAmount - customer.paidAmount;

    await customer.save();

    res.status(200).json({ message: 'Late fee added successfully', customer });
  } catch (error) {
    console.error('Late fee error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
