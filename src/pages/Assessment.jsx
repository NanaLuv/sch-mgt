import React, { useState, useEffect } from "react";
import axios from "axios";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import SidebarOther from "../other-components/sidebar-other";
import {
  FiCheckCircle,
  FiAlertCircle,
  FiFileText,
  FiSave,
  FiChevronDown,
  FiLoader,
} from "react-icons/fi";

const Assessment = () => {
  const Navigate = useNavigate();
  const { className } = useParams();
  const decodedClassName = decodeURIComponent(className);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [scores, setScores] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState(null);
  const [inputError, setInputError] = useState("");
  const [process, setProcess] = useState(false);

  //score input change
  const handleScoreChange = (studentId, type, value) => {
    if (value === 0 || (!isNaN(value) && Number(value) <= 50)) {
      setScores((prev) => ({
        ...prev,
        [studentId]: { ...prev[studentId], [type]: value },
      }));
      setInputError("");
    } else {
      setInputError("Number must be 50 or less");
      setTimeout(() => setInputError(null), 3000);
    }
  };

  //fetch students in a selected class
  useEffect(() => {
    if (!decodedClassName) return;
    setLoading(true);
    axios
      .get(
        `http://localhost:3001/school/students/class-assess/${encodeURIComponent(
          decodedClassName
        )}`
      )
      .then((res) => {
        setStudents(res.data);
        if (res.data.length > 0) {
          setSubjects(res.data[0].subjects || []);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch students.");
        setLoading(false);
      });
  }, [decodedClassName]);

  useEffect(() => {
    console.log("fetched students", students);
  }, [students]);

  //set, reset scores function
  useEffect(() => {
    if (!selectedSubject || students.length === 0) return;
    console.log("Updated students after save:", students);

    const newScores = {};
    students.forEach((student) => {
      const score = student.scores?.find((s) => s.subject === selectedSubject);
      newScores[student._id] = {
        classScore: score?.classScore || 0,
        examScore: score?.examScore || 0,
      };
    });

    setScores(newScores);
  }, [selectedSubject, students]);

  //handle save function
  const handleSave = () => {
    setProcess(true);
    axios
      .post("http://localhost:3001/school/students/save-scores", {
        subject: selectedSubject,
        scores,
      })
      .then((response) => {
        setNotification({
          message: "Saved Successfully!",
          type: "success",
        });
        setLoading(false);
        setProcess(false);
        setTimeout(() => setNotification(null), 3000);

        //  Re-fetch updated student scores immediately
        axios
          .get(
            `http://localhost:3001/school/students/class-assess/${encodeURIComponent(
              decodedClassName
            )}`
          )
          .then((res) => {
            setStudents(res.data);
          });
      })
      .catch(() => {
        setNotification({
          message: "Error Saving Scores",
          type: "error",
        });
        setLoading(false);
        setProcess(false);
        setTimeout(() => setNotification(null), 3000); // Hide notification after 3 seconds
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 ">
      {/* header */}
      <header className="fixed top-0 left-0 right-0 z-10 bg-white shadow-md">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center md:ml-64">
            <h1 className="text-xl font-bold text-gray-800">Report Scores</h1>
          </div>
        </div>
      </header>
      <SidebarOther heading={"Students Report"} />

      <main className="flex-1 p-4 md:p-6 md:mt-10 lg:p-8 lg:ml-64">
        {/* Notification and Error Boxes (fixed position) */}
        <div className="fixed top-4 right-4 space-y-2 z-50">
          {notification && (
            <div
              className={`p-3 rounded-md shadow-lg text-white ${
                notification.type === "success" ? "bg-green-500" : "bg-red-500"
              } transition-all duration-300 transform hover:scale-105`}
            >
              <div className="flex items-center">
                {notification.type === "success" ? (
                  <FiCheckCircle className="mr-2" />
                ) : (
                  <FiAlertCircle className="mr-2" />
                )}
                {notification.message}
              </div>
            </div>
          )}

          {inputError && (
            <div className="p-3 rounded-md shadow-lg text-white bg-red-600 transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center">
                <FiAlertCircle className="mr-2" />
                {inputError}
              </div>
            </div>
          )}
        </div>

        {/* Action Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {/* Subject Selection */}
            <div className="relative flex-1 sm:w-64">
              <select
                className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
                <option value="">Select Subject</option>
                {subjects.map((subject, index) => (
                  <option key={index} value={subject.name}>
                    {subject.name}
                  </option>
                ))}
              </select>
              <FiChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
            </div>

            {/* Generate Report Button */}
            <button
              onClick={() =>
                Navigate(
                  `/assessment/report/${encodeURIComponent(decodedClassName)}`
                )
              }
              className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              <FiFileText />
              Generate Report
            </button>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={!selectedSubject}
            className={`flex items-center justify-center gap-2 px-4 py-2 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 w-full sm:w-auto ${
              selectedSubject
                ? "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                : "bg-blue-300 cursor-not-allowed"
            }`}
          >
            <FiSave />
            {process ? (
              <span className="flex items-center">
                <FiLoader className="animate-spin mr-2" />
                Saving...
              </span>
            ) : (
              "Save Score"
            )}
          </button>
        </div>

        {/* Student Table */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <FiLoader className="animate-spin text-blue-500 text-4xl" />
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex items-center text-red-700">
              <FiAlertCircle className="mr-2" />
              <span>{error}</span>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Student Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Class Score (50)
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Exam Score (50)
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((student) => (
                    <tr key={student._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 capitalize">
                          {student.name
                            .split(" ")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() +
                                word.slice(1).toLowerCase()
                            )
                            .join(" ")}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          className="w-20 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center"
                          value={scores[student._id]?.classScore || 0}
                          onChange={(e) =>
                            handleScoreChange(
                              student._id,
                              "classScore",
                              e.target.value
                            )
                          }
                          min="0"
                          max="50"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          className="w-20 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center"
                          value={scores[student._id]?.examScore || 0}
                          onChange={(e) =>
                            handleScoreChange(
                              student._id,
                              "examScore",
                              e.target.value
                            )
                          }
                          min="0"
                          max="50"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Assessment;
