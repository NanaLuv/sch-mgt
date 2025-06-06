const mongoose = require("mongoose");

const feeSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" }, // Reference to Student
  class: [{ type: mongoose.Schema.Types.ObjectId, ref: "FeeStructure" }], // Total fees for the term/year
  amountPaid: { type: Number, default: 0 }, // Total amount paid so far
  balance: { type: Number, required: true, default: 0 }, // Remaining balance
  dueDate: { type: Date, required: true, default: Date.now }, // Deadline for fee payment
  paymentHistory: [
    {
      amount: { type: Number, required: true, default: 0 }, // Amount paid in a single transaction
      date: { type: Date, default: Date.now }, // Date of the payment
      method: {
        type: String,
        enum: ["Cash", "Card", "Bank Transfer"],
        required: true,
        default: "Cash",
      }, // Payment method
      reference: { type: String, required: true, default: "" }, // Reference ID or receipt number for tracking
    },
  ],
  year: { type: String, required: true },
  term: { type: Number, required: true },
});

// Create the Fee model
const Fee = mongoose.model("Fee", feeSchema);

module.exports = Fee;
