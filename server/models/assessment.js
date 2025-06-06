const mongoose = require("mongoose");

const assessmentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  term: String,
  year: Number,
  subjects: [
    {
      subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
        required: true,
      }, // Reference to the subject
      classScore: { type: Number, required: true }, // Class score
      examScore: { type: Number, required: true }, // Exam score
      totalScore: { type: Number }, // Total score (classScore + examScore)
      position: { type: String }, // Position in class
      remarks: { type: String }, // Remarks based on total score
    },
  ],
  totalScore: Number, // Total score for all subjects
  overallPosition: Number, // Average score for all subjects
  grade: String, // Grade based on average
  year: { type: String },
  term: { type: Number },
});

const Assessment = mongoose.model("Assessment", assessmentSchema);
module.exports = Assessment;
