const Class = require("../models/class");
const Student = require("../models/student");
const Subject = require("../models/subject");
const Teacher = require("../models/teacher");
const Bill = require("../models/bill");
const FeeStructure = require("../models/feeStructure");
const schoolInfo = require("../models/schoolInfo");
const Fee = require("../models/fee");
const Assessment = require("../models/assessment");
const NewTerm = require("../models/academicSession");
const User = require("../models/user");
const Expense = require("../models/expenses");
const expenses = require("../models/expenses");

const addStudent = (req, res) => {
  const {
    firstName,
    surname,
    name,
    gender,
    classes, // Single class name (but stored in an array)
    dob,
    parentName,
    contact,
  } = req.body;

  let savedStudent; // Store student data for later linking
  let currentTermInfo;

  // Fetch the current academic term
  NewTerm.findOne({ isCurrent: true })
    .then((currentTerm) => {
      if (!currentTerm) {
        return res.status(404).json({ msg: "No current academic term found" });
      }
      currentTermInfo = currentTerm; //save current term for later
      // Find Class by Name
      return Class.findOne({ name: classes }).then((foundClass) => {
        if (!foundClass) {
          return res.status(404).json({ msg: "Class not found" });
        }

        // Find FeeStructure containing this class
        return FeeStructure.findOne({ class: { $in: [foundClass._id] } }) // Handles array format
          .then((feeStructure) => {
            if (!feeStructure) {
              return res
                .status(404)
                .json({ msg: "Fee structure not found for this class" });
            }

            // Create new Student
            const newStudent = new Student({
              firstName,
              surname,
              name,
              gender,
              class: [foundClass._id], // Store in array format
              dob,
              parentName,
              contact,
              assessments: [],
              fees: [],
              year: currentTermInfo.year,
              term: currentTermInfo.term,
            });

            return newStudent.save().then((student) => {
              savedStudent = student; // Store for linking
              return feeStructure;
            });
          });
      });
    })
    .then((feeStructure) => {
      // Create Fee Record (Assign a single FeeStructure, but stored as an array)
      const newFee = new Fee({
        student: savedStudent._id,
        class: [feeStructure._id], // Store in array format
        amountPaid: 0,
        balance: feeStructure.totalAmount, // Initial balance = total fee
        paymentHistory: [],
        year: currentTermInfo.year,
        term: currentTermInfo.term,
      });

      return newFee.save();
    })
    .then((savedFee) => {
      savedStudent.fees = savedFee._id; // Link Fee ID to Student
      return savedStudent.save().then(() => res.status(201).json(savedFee));
    })
    .catch((error) => {
      console.error("Error creating student or fee:", error.message);
    });
};

//get classes names for student registration
const getClassNames = (req, res) => {
  Class.find()
    .then((foundClass) => {
      const classNames = foundClass.map((cls) => cls.name);
      res.json(classNames);
      console.log(classNames);
    })
    .catch((error) => console.error("class not found", error));
};

//get all student
const getStudents = (req, res) => {
  Student.find()
    .populate("class", "name")
    .then((students) => {
      res.json(students);
      console.log(students);
    })
    .catch((error) => console.log(error));
};

//update student
const updateStudent = (req, res) => {
  const {
    firstName,
    surname,
    name,
    gender,
    classes, // an array of class names
    dob,
    parentName,
    contact,
  } = req.body;
  const id = req.params.id;
  Class.find({ name: { $in: classes } })
    .then((gotClass) => {
      const classId = gotClass.map((cls) => cls._id);
      Student.findByIdAndUpdate(
        id,
        {
          firstName,
          surname,
          name,
          gender,
          class: classId, // assuming 'class' is an array of ObjectIds
          dob,
          parentName,
          contact,
        },
        { new: true }
      )
        .then((student) => {
          res.json({ msg: "student is updated", student });
        })
        .catch((error) => console.error("student not updated", error));
    })
    .catch((error) => {
      console.error("class not found", error);
      res.status(400).json({ message: "failed to update student" });
    });
};

//delete student
const deleteStudent = (req, res) => {
  const id = req.params.id;
  Student.findByIdAndDelete(id)
    .then((student) => {
      res.json({ msg: "student deleted", student });
      console.log(student);
    })
    .catch((error) => console.log(error));
};

//add school information
const addSchoolInfo = (req, res) => {
  schoolInfo
    .create(req.body)
    .then((schoolInfo) => {
      res.status(200).json(schoolInfo);
      console.log(schoolInfo);
    })
    .catch((error) => console.error("school info not found", error));
};

const getSchoolInfo = (req, res) => {
  schoolInfo
    .find()
    .then((schoolInfo) => {
      res.status(200).json(schoolInfo);
      console.log(schoolInfo);
    })
    .catch((error) => console.error("school information not found", error));
};

//add subject
const addSubject = (req, res) => {
  const { name } = req.body;
  Subject.findOne({ name: name })
    .then((subject) => {
      if (subject) {
        return res.json({ msg: "subject already exist", subject });
      }
      const newSubject = new Subject(req.body);
      return newSubject.save();
    })
    .then((newSubject) => {
      res.json(newSubject);
      console.log(newSubject);
    })
    .catch((error) => {
      console.log(error);
    });
};

//get subjects
const getSubjects = (req, res) => {
  Subject.find()
    .then((subjects) => {
      res.json(subjects);
      console.log(subjects);
    })
    .catch((error) => console.log(error));
};

//get subject names
const getSubjectNames = (req, res) => {
  Subject.find({})
    .then((subjects) => {
      if (subjects) {
        const subjectNames = subjects.map((subject) => subject.name);
        return subjectNames;
      }
    })
    .then((subjectNames) => {
      res.json(subjectNames);
    })
    .catch((error) => console.log(error));
};

//get subject by id and /update
const updateSubject = (req, res) => {
  const id = req.params.id;
  Subject.findByIdAndUpdate(id, req.body)
    .then((subject) => {
      res.json(subject);
      console.log(subject);
    })
    .catch((error) => console.log(error));
};

//delete subject
const deleteSubject = (req, res) => {
  const id = req.params.id;
  Subject.findByIdAndDelete(id)
    .then((subject) => {
      res.json(subject);
      console.log(subject);
    })
    .catch((error) => console.log(error));
};

//add class
const addClass = (req, res) => {
  const { name, description, subjects, code } = req.body;
  Subject.find({ name: { $in: subjects } })
    .then((subjects) => {
      if (subjects) {
        const subjectIds = subjects.map((subject) => subject._id);
        return subjectIds;
      }
    })
    .then((subjectIds) => {
      const newClass = new Class({
        name: name,
        description: description,
        subjects: subjectIds,
        code,
      });
      return newClass.save();
    })
    .then((newClass) => {
      res.json(newClass);
      console.log(newClass);
    })
    .catch((error) => console.log(error));
};

//get  classes for assessment
const getClassforAssessment = async (req, res) => {
  try {
    const classes = await Class.find().sort({ name: 1 });
    const formattedClasses = await Promise.all(
      classes.map(async (cls) => {
        return {
          _id: cls._id,
          name: cls.name,
          description: cls.description,
          code: cls.code,
        };
      })
    );
    res.json(formattedClasses);
  } catch (error) {
    console.error("Error fetching classes:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch classes",
      error: error.message,
    });
  }
};

//get classes
const getClasses = async (req, res) => {
  try {
    const classes = await Class.find().sort({ name: 1 }).populate("subjects");
    const formattedClasses = await Promise.all(
      classes.map(async (cls) => {
        return {
          _id: cls._id,
          name: cls.name,
          description: cls.description,
          subjects: cls.subjects.map((s) => s.name),
          code: cls.code,
        };
      })
    );
    res.json(formattedClasses);
  } catch (error) {
    console.error("Error fetching classes:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch classes",
      error: error.message,
    });
  }
};

//updating class
const updateClass = (req, res) => {
  const id = req.params.id;
  const { name, description, subjects } = req.body;
  Subject.findOne({ name: subjects })
    .then((foundSubjects) => {
      return Class.findByIdAndUpdate(
        id,
        { name, description, subjects: foundSubjects._id },
        { new: true }
      ).then((Class) => {
        res.json(Class);
        console.log(Class);
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ msg: "update failed" });
    });
};

//delete class
const deleteClass = (req, res) => {
  const id = req.params.id;
  Class.findByIdAndDelete(id)
    .then((Class) => {
      res.json(Class);
      console.log(Class);
    })
    .catch((error) => console.log(error));
};

//teacher controllers
//get both class and subjects to update teaher state at front end
const getClassAndSubject = (req, res) => {
  Class.find().then((classes) => {
    Subject.find()
      .then((subjects) => {
        res.json({ classes, subjects });
      })
      .catch((error) => console.log(error));
  });
};

//add teachers
const addTeachers = (req, res) => {
  const { name, subjects, classNames, contact } = req.body;
  Class.find({ name: { $in: classNames } })
    .then((classes) => {
      if (!classes) {
        return res.json({ msg: "Class not found" });
      }
      const classIds = classes.map((Class) => Class._id);
      Subject.find({ name: { $in: subjects } })
        .then((subjects) => {
          const subjectIds = subjects.map((subject) => subject._id);
          const newTeacher = new Teacher({
            name: name,
            subjects: subjectIds,
            class: classIds,
            contact: contact,
          });
          return newTeacher.save();
        })
        .then((newTeacher) => {
          res.json(newTeacher);
          console.log(newTeacher);
        });
    })
    .catch((error) => console.log(error));
};

//get teachers
const getTeachers = (req, res) => {
  Teacher.find()
    .then((teachers) => {
      res.json(teachers);
      console.log(teachers);
    })
    .catch((error) => console.log(error));
};

//get teachers with subject and class names
const getAllTeachers = (req, res) => {
  Teacher.find()
    .populate("subjects", "shortName") //  Get subject names instead of IDs
    .populate("class", "name") // Get class names instead of IDs
    .then((teachers) => {
      res.json(teachers);
      console.log(teachers);
    })
    .catch((error) => {
      console.error("Error fetching teachers:", error);
      res.status(500).json({ message: "Server error" });
    });
};

//update teacher
const updateTeacher = (req, res) => {
  const { name, contact, subjects, classNames } = req.body;
  const id = req.params.id;
  // Convert subject names to ObjectIds
  Subject.find({ name: { $in: subjects } })
    .then((foundSubjects) => {
      const subjectIds = foundSubjects.map((subject) => subject._id);

      // Find class ObjectIds (if needed)
      Class.find({ name: { $in: classNames } })
        .then((foundClasses) => {
          const classIds = foundClasses.map((cls) => cls._id);

          //Update teacher with correct ObjectIds
          return Teacher.findByIdAndUpdate(
            id,
            {
              name,
              contact,
              class: classIds,
              subjects: subjectIds,
            },
            { new: true }
          );
        })
        .then((updatedTeacher) => {
          res.status(200).json(updatedTeacher);
        })
        .catch((error) => {
          console.error("Error updating teacher:", error);
          res.status(500).json({ message: "Failed to update teacher" });
        });
    })
    .catch((error) => {
      console.error("Error finding subjects:", error);
      res.status(500).json({ message: "Failed to fetch subjects" });
    });
};

//delete teacher
const deleteTeacher = (req, res) => {
  const id = req.params.id;
  Teacher.findByIdAndDelete(id)
    .then((teacher) => {
      res.json(teacher);
      console.log(teacher);
    })
    .catch((error) => console.error("teacher not found", error));
};

//add bill
const addBills = (req, res) => {
  const { name } = req.body;
  Bill.findOne({ name: name })
    .then((name) => {
      if (name) {
        return res.status(400).json({ error: "bill name already exist", name });
      }
      const newBill = new Bill(req.body);
      return newBill.save().then((newBill) => {
        res.status(200).json(newBill);
        console.log(newBill);
      });
    })
    .catch((error) => console.error(error));
};

//get bills
const getBills = (req, res) => {
  Bill.find()
    .then((bills) => {
      res.status(200).json(bills);
      console.log(bills);
    })
    .catch((error) => console.error("Bills not found", error));
};

//update bills
const updateBills = (req, res) => {
  const id = req.params.id;
  Bill.findByIdAndUpdate(id, req.body)
    .then((bill) => {
      res.status(200).json(bill);
      console.log(bill);
    })
    .catch((error) => console.log(error));
};

//delete bill
const deleteBill = (req, res) => {
  const id = req.params.id;
  Bill.findByIdAndDelete(id)
    .then((bill) => {
      res.status(201).json(bill);
      console.log(bill);
    })
    .catch((error) => console.log(error));
};

//get fees structure
const getFeeStructure = (req, res) => {
  FeeStructure.find()
    .then((feeStruct) => {
      res.status(200).json(feeStruct);
      console.log(feeStruct);
    })
    .catch((error) => console.error("fee structure not found", error));
};

// //get both class and subjects to update teaher state at front end
const getClassAndBills = (req, res) => {
  Class.find().then((classes) => {
    Bill.find()
      .then((bills) => {
        res.json({ classes, bills });
      })
      .catch((error) => console.log(error));
  });
};

//add fee structure
const addFeeStructure = (req, res) => {
  const { className, bills, totalAmount } = req.body;
  Class.find({ name: { $in: className } })
    .then((foundClass) => {
      const classId = foundClass.map((cls) => cls._id);
      Bill.find({ name: { $in: bills } })
        .then((foundBills) => {
          const billId = foundBills.map((bill) => bill._id);
          const newFeeStructure = new FeeStructure({
            class: classId,
            bills: billId,
            totalAmount,
          });
          return newFeeStructure.save();
        })
        .then((newFeeStructure) => {
          res.status(200).json(newFeeStructure);
          console.log(newFeeStructure);
        });
    })
    .catch((error) => console.error("class not found", error));
};

//get fee structure with class and bills names
const getAllFeeStructures = (req, res) => {
  FeeStructure.find()
    .populate("bills", "name") //  Get bill names instead of IDs
    .populate("class", "name") // Get class names instead of IDs
    .then((feeStructure) => {
      res.json(feeStructure);
      console.log(feeStructure);
    })
    .catch((error) => {
      console.error("Error fetching fee structure:", error);
      res.status(500).json({ message: "Server error" });
    });
};

//update fee struture
const updateFeeStructure = (req, res) => {
  const { className, bills, totalAmount } = req.body;
  const id = req.params.id;
  Class.find({ name: { $in: className } })
    .then((foundClass) => {
      const classId = foundClass.map((cls) => cls._id);
      Bill.find({ name: { $in: bills } })
        .then((foundBill) => {
          const billId = foundBill.map((bill) => bill._id);
          return FeeStructure.findByIdAndUpdate(
            id,
            {
              class: classId,
              bills: billId,
              totalAmount,
            },
            { new: true }
          );
        })
        .then((feeStructure) => {
          res.status(200).json(feeStructure);
          console.log(feeStructure);
        });
    })
    .catch((error) => console.error("class not found", error));
};

//delete fee structure
const deleteFeeStructure = (req, res) => {
  FeeStructure.findByIdAndDelete(req.params.id)
    .then((feeStruct) => {
      res.json(feeStruct);
      console.log(feeStruct);
    })
    .catch((error) => console.error("fee structure not found", error));
};

//get fees for each student in each class
const getFeesUpdate = (req, res) => {
  const className = decodeURIComponent(req.params.className);
  // Find the Class by Name
  Class.findOne({ name: className })
    .then((classData) => {
      if (!classData) {
        return res.status(404).json({ message: "Class not found" });
      }
      //  Find All Students in This Class
      return Student.find({ class: classData._id });
    })
    .then((students) => {
      if (!students || students.length === 0) {
        return res
          .status(404)
          .json({ message: "No students found in this class" });
      }

      const studentIds = students.map((student) => student._id);

      //Fetch Fees for These Students
      return Fee.find({ student: { $in: studentIds } })
        .populate("student") // Populate student names
        .populate("class") // Populate class name
        .then((fees) => {
          if (!fees.length) {
            return res.status(404).json({ message: "No fess found" });
          }
          //Format data for frontend
          const formattedData = fees.map((fee) => {
            const totalAmount = fee.class.reduce(
              (sum, item) => sum + (item.totalAmount || 0),
              0
            );
            return {
              id: fee._id,
              name: fee.student ? fee.student.name : "N/A",
              studentId: fee.student ? fee.student._id : "N/A",
              totalAmount: totalAmount,
              amountPaid: fee.amountPaid,
              balance: fee.balance,
              paymentHistory: fee ? fee.paymentHistory : [],
            };
          });

          res.json(formattedData); //Send formatted data to frontend
        });
    })

    .catch((error) => {
      console.error("Error fetching fees:", error);
    });
};

//make payment
const handlePayment = (req, res) => {
  const { amount, method, reference } = req.body;
  const studentId = req.params.id;

  Fee.findOne({ student: studentId })
    .populate("class") // Fetch `FeeStructure` details
    .then((fee) => {
      if (!fee) {
        return res
          .status(404)
          .json({ message: "Fee record not found for this student" });
      }

      if (!fee.class || !fee.class.length === 0) {
        return res
          .status(500)
          .json({ message: "Fee structure not set for this student" });
      }
      const classTotal = fee.class.reduce(
        (sum, item) => sum + (item.totalAmount || 0),
        0
      );
      const totalAmount = classTotal; // Get total fees from FeeStructure
      const updatedAmountPaid = fee.amountPaid + amount;
      const updatedBalance = totalAmount - updatedAmountPaid;

      const newPayment = {
        amount,
        date: new Date(),
        method,
        reference,
      };

      return Fee.findByIdAndUpdate(
        fee._id,
        {
          $push: { paymentHistory: newPayment },
          amountPaid: updatedAmountPaid,
          balance: updatedBalance,
        },
        { new: true }
      ).then((updatedFee) => {
        res.json(updatedFee);
        console.log(updatedFee);
      });
    })
    .catch((error) => {
      console.error("Error updating fee:", error);
      res.status(500).json({ message: "Failed to process payment" });
    });
};

//get total fees paid to dashboard
const getTotalFees = (req, res) => {
  Fee.find()
    .then((fees) => {
      const total = fees.reduce((sum, fee) => sum + fee.amountPaid, 0);
      res.json(total);
      console.log({ totalFees: total });
    })
    .catch((error) => console.error("fees not found", error));
};

//function to save scores
const saveScores = (req, res) => {
  const { subject, scores } = req.body;
  if (!subject || !scores) {
    return res.status(400).json({ msg: "Subject and scores are required" });
  }

  Subject.findOne({ name: subject })
    .then((foundSubject) => {
      if (!foundSubject) {
        return res.status(404).json({ msg: "Subject not found" });
      }

      const subjectId = foundSubject._id;
      const studentScores = Object.entries(scores).map(
        ([studentId, { classScore, examScore }]) => ({
          studentId,
          classScore: Number(classScore),
          examScore: Number(examScore),
          totalScore: Number(classScore) + Number(examScore),
        })
      );

      // Sort for position
      const sorted = [...studentScores].sort(
        (a, b) => b.totalScore - a.totalScore
      );
      sorted.forEach((item, index) => {
        item.position = (index + 1).toString(); // Add 1-based position
      });

      // Update or create assessments
      const promises = sorted.map((item) => {
        const { studentId, classScore, examScore, totalScore, position } = item;

        return Assessment.findOne({ student: studentId }).then((assessment) => {
          if (!assessment) {
            const newAssessment = new Assessment({
              student: studentId,
              // year: resentTerm.year,
              // term: resentTerm.term,
              subjects: [
                {
                  subject: subjectId,
                  classScore,
                  examScore,
                  totalScore,
                  position,
                },
              ],
            });

            return newAssessment
              .save()
              .then((saved) =>
                Student.findByIdAndUpdate(
                  studentId,
                  { $push: { assessments: saved._id } },
                  { new: true }
                ).then(() => saved)
              );
          }

          const subjectIndex = assessment.subjects.findIndex(
            (sub) => sub.subject.toString() === subjectId.toString()
          );

          if (subjectIndex !== -1) {
            assessment.subjects[subjectIndex].classScore = classScore;
            assessment.subjects[subjectIndex].examScore = examScore;
            assessment.subjects[subjectIndex].totalScore = totalScore;
            assessment.subjects[subjectIndex].position = position;
          } else {
            assessment.subjects.push({
              subject: subjectId,
              classScore,
              examScore,
              totalScore,
              position,
            });
          }

          // Update overall total score
          const updatedTotal = assessment.subjects.reduce(
            (sum, s) => sum + (s.totalScore || 0),
            0
          );
          assessment.totalScore = updatedTotal;

          return assessment.save();
        });
      });

      return Promise.all(promises);
    })
    .then(() => {
      res
        .status(200)
        .json({ msg: "Scores and positions updated successfully!" });
    })
    .catch((error) => {
      console.error("Error saving scores:", error);
      res.status(500).json({ msg: "Internal server error" });
    });
};

//get students assessment
const assessment = (req, res) => {
  const className = decodeURIComponent(req.params.className);

  Class.findOne({ name: className })
    .populate("subjects", "name")
    .then((classData) => {
      if (!classData) {
        return Promise.reject({ status: 404, message: "Class not found" });
      }
      return Student.find({ class: classData._id })
        .populate({
          path: "assessments",
          populate: { path: "subjects.subject", select: "name" },
        })
        .then((students) => {
          let studentData = students.map((student) => {
            const scores = student.assessments.flatMap((assessment) =>
              assessment.subjects.map((subj) => ({
                subject: subj.subject.name,
                classScore: subj.classScore,
                examScore: subj.examScore,
                totalScore: subj.totalScore,
                grade: getGrade(subj.totalScore),
                remarks: getRemarks(subj.totalScore),
                position: null, // placeholder for now
              }))
            );

            const overallTotalScore = student.assessments.reduce(
              (sum, assessment) => sum + (assessment.totalScore || 0),
              0
            );

            return {
              _id: student._id,
              name: student.name,
              subjects: classData.subjects,
              scores,
              overallTotalScore,
              class: classData.name,
            };
          });

          //  Assign subject-wise positions with suffix
          classData.subjects.forEach((subject) => {
            const scoresForSubject = [];

            studentData.forEach((student) => {
              const subj = student.scores.find(
                (s) => s.subject === subject.name
              );
              if (subj) {
                scoresForSubject.push({
                  studentId: student._id.toString(),
                  totalScore: subj.totalScore || 0,
                });
              }
            });

            scoresForSubject.sort((a, b) => b.totalScore - a.totalScore);

            scoresForSubject.forEach((entry, index) => {
              const sameScoreCount = scoresForSubject.filter(
                (s) => s.totalScore === entry.totalScore
              ).length;

              let position;
              if (sameScoreCount > 1) {
                const firstIndex = scoresForSubject.findIndex(
                  (s) => s.totalScore === entry.totalScore
                );
                position = `${firstIndex + 1}${ordinalSuffix(firstIndex + 1)}`;
              } else {
                position = `${index + 1}${ordinalSuffix(index + 1)}`;
              }

              const student = studentData.find(
                (s) => s._id.toString() === entry.studentId
              );
              if (student) {
                const subj = student.scores.find(
                  (s) => s.subject === subject.name
                );
                if (subj) {
                  subj.position = position;
                }
              }
            });
          });

          //  Sort and assign overall positions
          studentData.sort((a, b) => b.overallTotalScore - a.overallTotalScore);

          studentData = studentData.map((student, index, arr) => {
            const sameScoreCount = arr.filter(
              (s) => s.overallTotalScore === student.overallTotalScore
            ).length;

            let position;
            if (sameScoreCount > 1) {
              const firstIndex = arr.findIndex(
                (s) => s.overallTotalScore === student.overallTotalScore
              );
              position = `${firstIndex + 1}${ordinalSuffix(firstIndex + 1)}`;
            } else {
              position = `${index + 1}${ordinalSuffix(index + 1)}`;
            }

            return {
              ...student,
              overallPosition: position,
            };
          });

          res.json(studentData);
        });
    })
    .catch((error) => {
      console.error("Error fetching students:", error);
      res.status(500).json({ message: "Internal Server Error" });
    });
};

//get all student assessment in a class for report
const getAssessmentForReport = (req, res) => {
  const className = decodeURIComponent(req.params.className);

  Class.findOne({ name: className })
    .populate("subjects", "name")
    .then((classData) => {
      if (!classData) {
        return Promise.reject({ status: 404, message: "Class not found" });
      }

      return Student.find({ class: classData._id })
        .populate({
          path: "assessments",
          populate: { path: "subjects.subject", select: "name" },
        })
        .then((students) => {
          let studentData = students.map((student) => {
            const scores = student.assessments.flatMap((assessment) =>
              assessment.subjects.map((subj) => ({
                subject: subj.subject.name,
                classScore: subj.classScore,
                examScore: subj.examScore,
                totalScore: subj.totalScore,
                grade: getGrade(subj.totalScore),
                remarks: getRemarks(subj.totalScore),
                position: null, // placeholder for now
              }))
            );

            const overallTotalScore = student.assessments.reduce(
              (sum, assessment) => sum + (assessment.totalScore || 0),
              0
            );

            return {
              id: student._id,
              name: student.name,
              subjects: classData.subjects,
              scores,
              overallTotalScore,
              class: classData.name,
            };
          });

          //  Assign subject-wise positions with suffix
          classData.subjects.forEach((subject) => {
            const scoresForSubject = [];

            studentData.forEach((student) => {
              const subj = student.scores.find(
                (s) => s.subject === subject.name
              );
              if (subj) {
                scoresForSubject.push({
                  studentId: student.id.toString(),
                  totalScore: subj.totalScore || 0,
                });
              }
            });

            scoresForSubject.sort((a, b) => b.totalScore - a.totalScore);

            scoresForSubject.forEach((entry, index) => {
              const sameScoreCount = scoresForSubject.filter(
                (s) => s.totalScore === entry.totalScore
              ).length;

              let position;
              if (sameScoreCount > 1) {
                const firstIndex = scoresForSubject.findIndex(
                  (s) => s.totalScore === entry.totalScore
                );
                position = `${firstIndex + 1}${ordinalSuffix(firstIndex + 1)}`;
              } else {
                position = `${index + 1}${ordinalSuffix(index + 1)}`;
              }

              const student = studentData.find(
                (s) => s.id.toString() === entry.studentId
              );
              if (student) {
                const subj = student.scores.find(
                  (s) => s.subject === subject.name
                );
                if (subj) {
                  subj.position = position;
                }
              }
            });
          });

          //  Sort and assign overall positions
          studentData.sort((a, b) => b.overallTotalScore - a.overallTotalScore);

          studentData = studentData.map((student, index, arr) => {
            const sameScoreCount = arr.filter(
              (s) => s.overallTotalScore === student.overallTotalScore
            ).length;

            let position;
            if (sameScoreCount > 1) {
              const firstIndex = arr.findIndex(
                (s) => s.overallTotalScore === student.overallTotalScore
              );
              position = `${firstIndex + 1}${ordinalSuffix(firstIndex + 1)}`;
            } else {
              position = `${index + 1}${ordinalSuffix(index + 1)}`;
            }

            return {
              ...student,
              overallPosition: position,
            };
          });

          res.json(studentData);
        });
    })
    .catch((error) => {
      console.error("Error fetching students:", error);
      res.status(500).json({ message: "Internal Server Error" });
    });
};

//get academic current term
const getCurrentTerm = (req, res) => {
  NewTerm.findOne({ isCurrent: true })
    .then((term) => {
      res.status(200).json(term);
      console.log(term);
    })
    .catch((error) => console.error("curent term found", error));
};

//new term switch
const newTermSwitch = (req, res) => {
  const { year, term, startDate, endDate } = req.body;
  NewTerm.updateMany({}, { isCurrent: false }).then(() => {
    NewTerm.create({
      year,
      term,
      startDate,
      endDate,
      isCurrent: true,
    })
      .then((newTerm) => {
        if (!newTerm) {
          return res.status(404).json({ msg: "new term not created" });
        }
        Student.updateMany({}, { $set: { year, term } }).then(() => {
          res.status(200).json(newTerm);
          console.log(newTerm);
        });
      })
      .catch((error) => console.error("error updating new term", error));
  });
};

//get current term and year for the report card
const getTermYear = (req, res) => {
  let currentTermInfo;
  NewTerm.findOne({ isCurrent: true })
    .then((currentTerm) => {
      if (!currentTerm) {
        return res.status(404).json({ msg: "current term and year not found" });
      }
      currentTermInfo = currentTerm;
      const year = currentTermInfo.year;
      const term = currentTermInfo.term;

      res.status(201).json({ year, term });
    })
    .catch((error) => console.error(error));
};

//reset new term fee for new term
const reset = async (req, res) => {
  try {
    // Find current term
    const currentTerm = await NewTerm.findOne({ isCurrent: true });
    if (!currentTerm) {
      return res.status(404).json({ msg: "No current term found" });
    }

    // Find students for the current term
    const students = await Student.find({
      term: currentTerm.term,
      year: currentTerm.year,
    });
    if (!students || students.length === 0) {
      return res.status(404).json({ msg: "No matching students found" });
    }

    const studentIds = students.map((s) => s._id);

    // Reset Fees
    const feeResetOperations = await Fee.updateMany(
      { student: { $in: studentIds } },
      {
        $set: {
          amountPaid: 0,
          balance: 0,
          totalAmount: 0,
          paymentHistory: [],
        },
      }
    );
    // Reset expenses
    const expensesResetOperations = await Expense.updateMany(
      {},
      {
        $set: {
          name: "",
          amount: 0,
        },
      }
    );

    // Reset Assessments
    const assessmentResetOperations = await Assessment.updateMany(
      {
        student: { $in: studentIds },
        // term: currentTerm.term,
        // year: currentTerm.year,
      },
      {
        $set: {
          subjects: [], // Reset all subject scores
          totalScore: 0,
          overallPosition: 0,
          grade: "",
          // Keep term and year as they are identifiers
        },
      }
    );

    // Get updated data
    const updatedFees = await Fee.find({
      student: { $in: studentIds },
    }).populate("student");
    const updatedAssessments = await Assessment.find({
      student: { $in: studentIds },
      term: currentTerm.term,
      year: currentTerm.year,
    }).populate("student");

    // Prepare response
    const responseData = {
      fees: updatedFees.map((fee) => ({
        id: fee._id,
        studentId: fee.student?._id,
        name: fee.student?.name,
        amountPaid: fee.amountPaid,
        balance: fee.balance,
        totalAmount: fee.totalAmount,
        paymentHistory: fee.paymentHistory,
      })),
      assessments: updatedAssessments.map((assessment) => ({
        id: assessment._id,
        studentId: assessment.student?._id,
        name: assessment.student?.name,
        subjects: assessment.subjects,
        totalScore: assessment.totalScore,
        overallPosition: assessment.overallPosition,
        grade: assessment.grade,
      })),
      expenses,
    };
    res.json(responseData);
  } catch (error) {
    console.error("Reset error:", error);
    res.status(500).json({
      success: false,
      msg: error.message || "Internal server error",
    });
  }
};

//authenticating users
//sign up
const signUp = async (req, res) => {
  try {
    const { username, password } = req.body;
    const newUser = await User.create({ username, password });
    res.status(201).json(newUser);
  } catch (err) {
    const error = handleError(err);
    res.status(500).json({ error });
    console.error("Error", error);
  }
};

//expenses tracker
const addExpense = async (req, res) => {
  try {
    const { name, amount } = req.body;
    if (!name || !amount) return;
    const newExpense = await Expense.create({ name, amount });
    res.status(200).json(newExpense);
  } catch (error) {
    console.error("expense not found", error);
  }
};

//get all expenses
const getExpenses = async (req, res) => {
  try {
    const allExpenses = await Expense.find();
    res.json(allExpenses);
    console.log(allExpenses);
  } catch (error) {
    console.error("expenses not found", error);
  }
};

//delete expenses
const deleteExpense = async (req, res) => {
  try {
    const id = req.params.id;
    const expense = await Expense.findByIdAndDelete(id);
    res.status(200).json(expense);
  } catch (error) {
    console.error("cant delete expense", error);
  }
};

//total expense
const totalExpenses = async (req, res) => {
  try {
    const allExpenses = await Expense.find();
    const sumExpense = allExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );
    res.status(200).json(sumExpense);
    console.log(sumExpense);
  } catch (error) {
    console.error("cannot find expenses", error);
  }
};

module.exports = {
  addStudent,
  getStudents,
  getClassNames,
  updateStudent,
  deleteStudent,
  addSchoolInfo,
  getSchoolInfo,
  addSubject,
  getSubjects,
  getSubjectNames,
  updateSubject,
  deleteSubject,
  addClass,
  getClasses,
  getClassforAssessment,
  updateClass,
  deleteClass,
  addTeachers,
  getTeachers,
  getClassAndSubject,
  getAllTeachers,
  updateTeacher,
  deleteTeacher,
  addBills,
  getBills,
  updateBills,
  deleteBill,
  addFeeStructure,
  getFeeStructure,
  getClassAndBills,
  getAllFeeStructures,
  updateFeeStructure,
  deleteFeeStructure,
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
  addExpense,
  getExpenses,
  deleteExpense,
  totalExpenses,
};

function handleError(err) {
  let errors = { username: "", password: "" };
  if (err.message.includes("User validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
}
//  Grade function
function getGrade(score) {
  if (score >= 80) return "A";
  if (score >= 75) return "P";
  if (score >= 70) return "AP";
  if (score >= 65) return "D";
  if (score >= 40) return "F";
  return "F";
}
//  remarks function
function getRemarks(score) {
  if (score >= 80) return "Advance";
  if (score >= 75) return "Proficient";
  if (score >= 70) return "Approaching Proficiency";
  if (score >= 65) return "Developing";
  if (score >= 40) return "Beginning";
  return "Beginning";
}

//  Ordinal suffix helper (e.g., 1st, 2nd)
function ordinalSuffix(i) {
  const j = i % 10,
    k = i % 100;
  if (j === 1 && k !== 11) return "st";
  if (j === 2 && k !== 12) return "nd";
  if (j === 3 && k !== 13) return "rd";
  return "th";
}

// Utility: Determine next class (e.g., Basic 1 -> Basic 2)
function normalize(name) {
  return name.trim().toLowerCase();
}
