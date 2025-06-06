const mongoose = require("mongoose");

const newTermSchema = new mongoose.Schema({
  term: { type: Number, required: true },
  year: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  isCurrent: { type: Boolean, default: false },
});
const NewTerm = mongoose.model("NewTerm", newTermSchema);
module.exports = NewTerm;
