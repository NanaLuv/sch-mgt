import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FaTimes } from "react-icons/fa";
import { FiInfo, FiUser, FiFileText, FiX, FiCalendar } from "react-icons/fi";

export default function ReportPage() {
  const { className } = useParams();
  const decodedClassName = decodeURIComponent(className);
  const [reportDetails, setReportDetails] = useState([]);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [conduct, setConduct] = useState({});
  const [interest, setInterest] = useState({});
  const [attendance, setAttendance] = useState({});
  const [totalAttendance, setTotalAttendance] = useState("");
  const [nextTermBegins, setNextTermBegins] = useState();
  const [term, setTerm] = useState();
  const [year, setYear] = useState();
  const [schoolInfo, setSchoolInfo] = useState();

  const [teachersRemarks, setTeachersRemarks] = useState({});

  useEffect(() => {
    axios
      .get(
        `http://localhost:3001/school/students/class-report/${encodeURIComponent(
          decodedClassName
        )}`
      )
      .then((response) => {
        setReportDetails(response.data);
      })
      .catch((error) => console.error("error", error));
  }, [decodedClassName]);

  //get school information
  useEffect(() => {
    const getStartDate = localStorage.getItem("startDate");
    setNextTermBegins(getStartDate);
    axios
      .get("http://localhost:3001/school/schoolInfo")
      .then((response) => {
        setSchoolInfo(response.data);
      })
      .catch((error) => console.error("error occured", error));

    //get term and year
    axios
      .get("http://localhost:3001/school/students/year-term")
      .then((response) => {
        // setYearTerm(response.data);
        setTerm(response.data.term);
        setYear(response.data.year);
      })
      .catch((error) => console.error("error occured", error));
  }, []);

  useEffect(() => {
    console.log({ report: reportDetails, schinfo: schoolInfo, term: term });
  }, [reportDetails, schoolInfo]);

  const conductOptions = [
    "Excellent",
    "Very Good",
    "Good",
    "Fair",
    "Poor",
    "Needs Improvement",
    "Outstanding",
    "Satisfactory",
    "Unsatisfactory",
    "Inconsistent",
  ];

  const interestOptions = [
    "Science Club",
    "Sports",
    "Music",
    "Arts",
    "Debate",
    "Math Club",
    "Robotics",
    "Drama",
    "Reading Club",
    "Environmental Club",
  ];

  const teachersRemarksOptions = [
    "Keep up the good work",
    "Shows potential",
    "Needs to focus more",
    "Excellent progress",
    "Needs improvement",
    "Struggling with the material",
    "Great participation",
    "Has a positive attitude",
    "Works well with others",
    "Highly motivated",
  ];

  const handleInputChange = (id, field, value) => {
    if (field === "conduct") {
      setConduct((prev) => ({ ...prev, [id]: value }));
    } else if (field === "interest") {
      setInterest((prev) => ({ ...prev, [id]: value }));
    } else if (field === "teachersRemarks") {
      setTeachersRemarks((prev) => ({ ...prev, [id]: value }));
    } else if (field === "attendance") {
      setAttendance((prev) => ({ ...prev, [id]: value }));
    }
  };

  //generate pdf function
 const generatePDF = () => {
   const currentDate = new Date().toLocaleDateString("en-GB", {
     month: "short",
     day: "2-digit",
     year: "numeric",
   });

   // Create a new PDF document with landscape orientation
   const doc = new jsPDF({
     orientation: "portrait",
     unit: "mm",
     format: "a4",
   });

   reportDetails.forEach((student, index) => {
     if (index > 0) doc.addPage();

     // Set up colors
     const primaryColor = [41, 128, 185]; // Blue
     const secondaryColor = [34, 139, 34]; // Green
     const accentColor = [173, 216, 230]; // Light blue
     const darkColor = [0, 0, 0]; // Black

     // Add header with school info
     doc.setFillColor(...accentColor);
     doc.rect(0, 0, doc.internal.pageSize.width, 15, "F");

     // School logo (if available)
      //  if (logo) {
      //    doc.addImage(logo, "JPEG", 10, 5, 30, 30);
      //  } 

     // School information
     doc.setFontSize(12);
     doc.setFont("helvetica", "bold");
     doc.setTextColor(...darkColor);
     doc.text(
       `${schoolInfo[0]?.name.toUpperCase() || "SCHOOL NAME"}`,
       doc.internal.pageSize.width / 2,
       10,
       { align: "center" }
     );

     doc.setFontSize(10);
     doc.setFont("helvetica", "normal");
     doc.text(
       `${schoolInfo[0]?.address || "School Address"}`,
       doc.internal.pageSize.width / 2,
       15,
       { align: "center" }
     );
     doc.text(
       `Email: ${schoolInfo[0]?.email || "email@school.com"} | Phone: ${
         schoolInfo[0]?.contact || "000-000-0000"
       }`,
       doc.internal.pageSize.width / 2,
       20,
       { align: "center" }
     );

     // Report title
     doc.setFontSize(16);
     doc.setFont("helvetica", "bold");
     doc.setTextColor(...primaryColor);
     doc.text("STUDENT REPORT CARD", doc.internal.pageSize.width / 2, 30, {
       align: "center",
     });

     // Divider line
     doc.setDrawColor(...accentColor);
     doc.setLineWidth(0.5);
     doc.line(15, 35, doc.internal.pageSize.width - 15, 35);

     // Student photo placeholder
     if (student.image) {
       doc.addImage(
         student.image,
         "JPEG",
         doc.internal.pageSize.width - 40,
         40,
         30,
         30
       );
     } else {
       doc.setFillColor(200, 200, 200);
       doc.rect(doc.internal.pageSize.width - 40, 40, 30, 30, "F");
       doc.setFontSize(8);
       doc.setTextColor(100, 100, 100);
       doc.text("Student Photo", doc.internal.pageSize.width - 25, 55, {
         align: "center",
       });
     }

     // Student information section
     doc.setFontSize(12);
     doc.setFont("helvetica", "bold");
     doc.setTextColor(...darkColor);
     doc.text("STUDENT INFORMATION", 15, 45);

     doc.setFontSize(10);
     doc.setFont("helvetica", "normal");
     doc.text(`Name: ${student.name.toUpperCase()}`, 15, 50);
     doc.text(`ID: ${student.id}`, 15, 55);
     doc.text(`Class: ${decodedClassName}`, 15, 60);
     doc.text(`Number on Roll: ${reportDetails.length}`, 15, 65);

     // Academic information section
     doc.text(`Year: ${year || "Not provided"}`, 100, 50);
     doc.text(`Term: ${term || "Not provided"}`, 100, 55);
     doc.text(`Date: ${currentDate}`, 100, 60);
     doc.text(
       `Next Term Begins: ${
         nextTermBegins
           ? new Date(nextTermBegins).toLocaleDateString("en-GB", {
               day: "2-digit",
               month: "short",
               year: "numeric",
             })
           : "Not provided"
       }`,
       100,
       65
     );

     // Performance summary
     doc.setFontSize(11);
     doc.setFont("helvetica", "bold");
     doc.text(
       `Overall Total Score: ${student.overallTotalScore || "N/A"}`,
       15,
       75
     );
     doc.text(`Overall Position: ${student.overallPosition || "N/A"}`, 100, 75);

     // Subjects table
     const tableBody = student.scores.map((subject) => [
       subject.subject.charAt(0).toUpperCase() + subject.subject.slice(1),
       subject.classScore || "N/A",
       subject.examScore || "N/A",
       subject.totalScore || "N/A",
       subject.position || "N/A",
       subject.remarks || "No remarks",
     ]);

     autoTable(doc, {
       startY: 80,
       head: [
         [
           "Subject",
           "Class Score",
           "Exam Score",
           "Total",
           "Position",
           "Remarks",
         ],
       ],
       body: tableBody,
       headStyles: {
         fillColor: primaryColor,
         textColor: [255, 255, 255],
         fontStyle: "bold",
       },
       alternateRowStyles: {
         fillColor: [240, 240, 240],
       },
       margin: { left: 15, right: 15 },
       styles: {
         fontSize: 9,
         cellPadding: 3,
         overflow: "linebreak",
         halign: "center",
       },
       columnStyles: {
         0: { halign: "left", cellWidth: "auto" },
         5: { halign: "left", cellWidth: "auto" },
       },
     });

     // Additional remarks section
     const finalY = doc.lastAutoTable.finalY + 10;
     doc.setFontSize(11);
     doc.setFont("helvetica", "bold");
     doc.text("ADDITIONAL INFORMATION", 15, finalY);

     doc.setFontSize(10);
     doc.setFont("helvetica", "normal");
     doc.text(
       `Attendance: ${attendance[student.id] || "N/A"} / ${
         totalAttendance || "N/A"
       }`,
       15,
       finalY + 5
     );
     doc.text(
       `Conduct: ${conduct[student.id] || "Not provided"}`,
       15,
       finalY + 10
     );
     doc.text(
       `Interest: ${interest[student.id] || "Not provided"}`,
       15,
       finalY + 15
     );
     doc.text(
       `Teacher's Remarks: ${teachersRemarks[student.id] || "Not provided"}`,
       15,
       finalY + 20
     );

     // Footer
     doc.setFontSize(8);
     doc.setTextColor(100, 100, 100);
     doc.text(
       "Generated by School Management System",
       doc.internal.pageSize.width / 2,
       doc.internal.pageSize.height - 10,
       { align: "center" }
     );

     // Generate PDF URL
     const pdfBlob = doc.output("blob");
     const pdfUrl = URL.createObjectURL(pdfBlob);
     setPdfUrl(pdfUrl);

     // Update student data with PDF URL
     const updatedStudents = reportDetails.map((s) =>
       s.id === student.id ? { ...s, pdfUrl } : s
     );
     setReportDetails(updatedStudents);
   });
 };
  function closePreview() {
    setPdfUrl(null);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* General Information Section */}
      <div className="bg-blue-50 rounded-xl shadow-sm p-6 mb-8 border border-blue-100">
        <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
          <FiInfo className="mr-2 text-blue-600" />
          General Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Attendance
            </label>
            <div className="relative">
              <input
                type="number"
                value={totalAttendance}
                onChange={(e) => setTotalAttendance(e.target.value)}
                placeholder="Enter total attendance"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <FiCalendar className="absolute right-3 top-3.5 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Next Term Begins
            </label>
            <div className="relative">
              <input
                type="date"
                value={nextTermBegins}
                onChange={(e) => setNextTermBegins(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <FiCalendar className="absolute right-3 top-3.5 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Term
            </label>
            <select
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Term</option>
              <option value="1">Term 1</option>
              <option value="2">Term 2</option>
              <option value="3">Term 3</option>
            </select>
          </div>
        </div>
      </div>

      {/* Student Reports Section */}
      <div className="space-y-6 mb-8">
        {reportDetails.map((student) => (
          <div
            key={student.id}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
          >
            <h4 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
              <FiUser className="mr-2 text-blue-600" />
              {student.name.toUpperCase()}
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Attendance
                </label>
                <input
                  type="number"
                  placeholder="Attendance"
                  value={attendance[student.id] || ""}
                  onChange={(e) =>
                    handleInputChange(student.id, "attendance", e.target.value)
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Conduct
                </label>
                <select
                  value={conduct[student.id] || ""}
                  onChange={(e) =>
                    handleInputChange(student.id, "conduct", e.target.value)
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Conduct</option>
                  {conductOptions.map((option, idx) => (
                    <option key={idx} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Interest
                </label>
                <select
                  value={interest[student.id] || ""}
                  onChange={(e) =>
                    handleInputChange(student.id, "interest", e.target.value)
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Interest</option>
                  {interestOptions.map((option, idx) => (
                    <option key={idx} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teacher's Remarks
                </label>
                <select
                  value={teachersRemarks[student.id] || ""}
                  onChange={(e) =>
                    handleInputChange(
                      student.id,
                      "teachersRemarks",
                      e.target.value
                    )
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Remarks</option>
                  {teachersRemarksOptions.map((option, idx) => (
                    <option key={idx} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center">
        <button
          onClick={generatePDF}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <FiFileText className="text-lg" />
          Preview PDF Report
        </button>
      </div>

      {/* PDF Preview Modal */}
      {pdfUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-6xl h-[90vh] relative">
            <button
              onClick={closePreview}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <FiX size={24} />
            </button>
            <iframe
              src={pdfUrl}
              className="w-full h-full rounded-xl"
              title="PDF Preview"
            />
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  previewContainer: {
    position: "fixed",
    top: "10px",
    left: "0",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: "1000",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  closeButton: {
    marginBottom: "10px",
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
    zIndex: "1001",
  },
  iframe: {
    border: "1px solid #ccc",
    borderRadius: "8px",
  },
};
