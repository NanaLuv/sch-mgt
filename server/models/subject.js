const mongoose = require("mongoose");
const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  shortName: { type: String, required: false },
});
module.exports = mongoose.model("Subject", subjectSchema);
