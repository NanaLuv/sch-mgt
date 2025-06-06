const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }], // References to Subject
  class: [{ type: mongoose.Schema.Types.ObjectId, ref: "Class" }],
  contact: { type: String, required: false },
});

module.exports = mongoose.model("Teacher",teacherSchema)
