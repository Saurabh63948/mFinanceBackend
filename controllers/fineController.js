const { Customer } = require("../models/customerModel");

// -----------------------------
// Add Fine (Admin Only)
// -----------------------------
const addFine = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, reason } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: "Fine amount must be greater than 0" });
    }

    const customer = await Customer.findById(id);
    if (!customer) {
      return res.status(404).json({ success: false, message: "Customer not found" });
    }

    const fine = {
      date: new Date().toISOString().split("T")[0],
      amount: Number(amount),
      reason: reason || "Late payment",
    };

    customer.fines.push(fine);
    customer.totalPayableAmount += Number(amount);
    customer.remainingAmount += Number(amount);

    await customer.save();

    return res.status(200).json({
      success: true,
      message: "Fine added successfully",
      customer,
    });
  } catch (error) {
    console.error("❌ Add Fine Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while adding fine",
      error: error.message,
    });
  }
};

// -----------------------------
// Remove Fine (Admin Only)
// -----------------------------
const removeFine = async (req, res) => {
  try {
    const { id, fineId } = req.params;

    const customer = await Customer.findById(id);
    if (!customer) {
      return res.status(404).json({ success: false, message: "Customer not found" });
    }

    const fineToRemove = customer.fines.id(fineId);
    if (!fineToRemove) {
      return res.status(404).json({ success: false, message: "Fine not found" });
    }

    // Subtract the fine amount from totals
    customer.totalPayableAmount -= fineToRemove.amount;
    customer.remainingAmount -= fineToRemove.amount;

    fineToRemove.remove();
    await customer.save();

    return res.status(200).json({
      success: true,
      message: "Fine removed successfully",
      customer,
    });
  } catch (error) {
    console.error("❌ Remove Fine Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while removing fine",
      error: error.message,
    });
  }
};

module.exports = { addFine, removeFine };
