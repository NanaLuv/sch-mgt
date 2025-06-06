const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  surname: { type: String, required: true },
  name: { type: String, required: true },
  gender: { type: String },
  dob: { type: Date, default: null },
  age: { type: Number, default: null },
  parentName: { type: String, default: null },
  contact: { type: String, default: "" },
  house: { type: String, default: "" },
  dateAdmitted: { type: Date, default: Date.now },
  image: { type: String, default: null },
  class: [{ type: mongoose.Schema.Types.ObjectId, ref: "Class" }],
  fee: [{ type: mongoose.Schema.Types.ObjectId, ref: "Fee" }],
  assessments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Assessment" }],
  year: { type: String, required: true },
  term: { type: Number, required: true },
});

module.exports = mongoose.model("Student", StudentSchema);
