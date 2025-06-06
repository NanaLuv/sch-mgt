const mongoose = require("mongoose");

// Class Schema
const classSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., "Basic 1"
  description: { type: String },
  code: { type: String, required: true },
  subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }], // References to Subject
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }], // References to student
});

module.exports = mongoose.model("Class", classSchema);
