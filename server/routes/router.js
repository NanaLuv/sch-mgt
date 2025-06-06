const express = require("express");
const {
  addStudent,
  getStudents,
  updateStudent,
  deleteStudent,
  addSubject,
  getSubjects,
  getSubjectNames,
  addClass,
  getClasses,
  updateSubject,
  updateClass,
  deleteSubject,
  deleteClass,
  getClassAndSubject,
  getTeachers,
  addTeachers,
  getAllTeachers,
  updateTeacher,
  deleteTeacher,
  addBills,
  getBills,
  updateBills,
  deleteBill,
  getFeeStructure,
  getClassAndBills,
  addFeeStructure,
  getAllFeeStructures,
  updateFeeStructure,
  deleteFeeStructure,
  addSchoolInfo,
  getClassNames,
  getSchoolInfo,
  handlePayment,
  getFeesUpdate,
  assessment,
  saveScores,
  getAssessmentForReport,
  getTotalFees,
  newTermSwitch,
  getCurrentTerm,
  getTermYear,
  reset,
  signUp,
  getClassforAssessment,
  addExpense,
  getExpenses,
  deleteExpense,
  totalExpenses,
} = require("../controller/controller");
const router = express.Router();

//add student
router.post("/add-student", addStudent);

//get all students
router.get("/get-students", getStudents);

//get class names for student registration
router.get("/student-classes", getClassNames);

//update student
router.put("/update/:id", updateStudent);

//delete student
router.delete("/delete/:id", deleteStudent);

//add school info
router.post("/add-schoolInfo", addSchoolInfo);

router.get("/schoolinfo", getSchoolInfo);

//add subject
router.post("/add-subject", addSubject);

//get subjects
router.get("/subjects", getSubjects);

//get subject names
router.get("/subject-names/class", getSubjectNames);

//update subject
router.put("/update-subject/:id", updateSubject);

//delete subject
router.delete("/subjects/:id", deleteSubject);

//add classes
router.post("/add-class", addClass);

//get classes
router.get("/class", getClasses);

//get classes for assessment
router.get("/class-assessment", getClassforAssessment);

//update class
router.put("/update-class/:id", updateClass);

//delete class
router.delete("/class/:id", deleteClass);

//add teachers
router.post("/add-teachers", addTeachers);

//get teachers
router.get("/teachers", getTeachers);

//get both class and subject
router.get("/classes-subjects/teachers", getClassAndSubject);

//get both class and subject names not ids
router.get("/t/teachers", getAllTeachers);

// update teacher
router.put("/update-teachers/:id", updateTeacher);

//delete teacher
router.delete("/teachers/:id", deleteTeacher);

//bills
// add bills
router.post("/add-bills", addBills);

//get bills
router.get("/bills", getBills);

//update bills
router.put("/update-bills/:id", updateBills);

//delete bill
router.delete("/bills/:id", deleteBill);

//add fee structure
router.post("/add-feeStructure", addFeeStructure);

//get fee structure
router.get("/feestructure", getFeeStructure);

//get fee structure with bill and class names
router.get("/fs/feestructure", getAllFeeStructures);

//get classes and bills to update fee structure state
router.get("/classes-bills/feestructure", getClassAndBills);

//update fee structure
router.put("/update-feeStructure/:id", updateFeeStructure);

//delete fee structure
router.delete("/feestructure/:id", deleteFeeStructure);

//school fees payment
router.post("/pay-fee/:id", handlePayment);

//get fees update
router.get("/students/class-fee/:className", getFeesUpdate);

//get total amount of fees
router.get("/fees", getTotalFees);

//get student details for assesement
router.get("/students/class-assess/:className", assessment);

//save all scores for students
router.post("/students/save-scores", saveScores);

//get assessment for report
router.get("/students/class-report/:className", getAssessmentForReport);

//update new term switch
router.post("/term/switch", newTermSwitch);

//get term and year
router.get("/students/year-term", getTermYear);

//get current term
router.get("/term/current", getCurrentTerm);

//handle reset of new term fees
router.post("/student/newfees", reset);

//handle signup
router.post("/user-signup", signUp);

//handle expenses
router.post("/expenses", addExpense);

//get expenses
router.get("/get-expenses", getExpenses);

//delete expense
router.delete("/expense/:id", deleteExpense);

//total expenses
router.get("/total-expenses", totalExpenses);

module.exports = router;
