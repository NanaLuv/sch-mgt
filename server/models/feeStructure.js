const mongoose = require("mongoose");
const feeStructure = new mongoose.Schema({
  class: [{ type: mongoose.Schema.Types.ObjectId, ref: "Class" }],
  bills: [{ type: mongoose.Schema.Types.ObjectId, ref: "Bill" }],
  totalAmount: { type: Number, default: 0 },
});

// Middleware to calculate total amount before saving
feeStructure.pre("save", async function (next) {
  const bills = await mongoose.model("Bill").find({ _id: { $in: this.bills } });
  this.totalAmount = bills.reduce((sum, bill) => sum + bill.amount, 0);
  next();
});

module.exports = mongoose.model("FeeStructure", feeStructure);
