const mongoose = require("mongoose");
const billSchema = new mongoose.Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
});
module.exports = mongoose.model("Bill", billSchema);
