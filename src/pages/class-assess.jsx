import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import SidebarOther from "../other-components/sidebar-other";
import {
  FiBook,
  FiFolder,
  FiPlus,
  FiAlertCircle,
  FiLoader,
  FiLock,
  FiX,
  FiCheck,
} from "react-icons/fi";
import { div } from "framer-motion/client";

const ClassAssess = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errorCode, setErrorCode] = useState("");
  const [selectedClass, setSelectedClass] = useState(null);
  const [codeInput, setCodeInput] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3001/school/class-assessment") // Adjust API endpoint
      .then((response) => {
        setClasses(response.data); //  Store classes
        console.log(classes);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching classes:", error);
        setError("Failed to load classes.");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    console.log("fetched classes", classes);
  }, [classes]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <FiLoader className="animate-spin text-blue-500 text-4xl" />
      </div>
    );
  if (error)
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <div className="flex items-center text-red-700">
          <FiAlertCircle className="mr-2" />
          <span>{error}</span>
        </div>
        ;
      </div>
    );

  const handleClassSelect = (cls) => {
    setSelectedClass(cls);
    setCodeInput("");
    setErrorCode("");
  };

  const verifyCode = () => {
    if (!codeInput.trim()) {
      setErrorCode("Please enter an access code");
      return;
    }

    setIsLoading(true);

    // Simulate API verification
    setTimeout(() => {
      if (codeInput === selectedClass.code) {
        navigate(`/assessment/${encodeURIComponent(selectedClass.name)}`);
      } else {
        setErrorCode("Invalid access code. Please try again.");
      }
      setIsLoading(false);
    }, 800);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      verifyCode();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-10 bg-white shadow-sm border-b border-gray-100">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center md:ml-64">
            <FiBook className="text-blue-600 mr-2" />
            <h1 className="text-xl font-bold text-gray-800">
              Assessment Portal
            </h1>
          </div>
        </div>
      </header>

      <div className="flex flex-col md:flex-row flex-1 pt-16">
        <SidebarOther heading="Class Assessment" />

        <main className="flex-1 p-4 md:p-8 lg:ml-64">
          {/* Page Header */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-blue-600 mb-2">
              Class Assessment
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Select a class and enter the access code to manage assessments
            </p>
          </div>

          {/* Class Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {classes.map((cls) => (
              <div key={cls._id} className="space-y-3">
                {/* Class Card */}
                <div
                  className={`p-5 bg-white rounded-xl shadow-sm border-2 transition-all cursor-pointer hover:shadow-md ${
                    selectedClass?._id === cls._id
                      ? "border-blue-500"
                      : "border-transparent hover:border-gray-200"
                  }`}
                  onClick={() => handleClassSelect(cls)}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mb-3">
                      <FiBook className="text-blue-600 text-xl" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-800 line-clamp-1">
                      {cls.name}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {cls.description}
                    </p>
                  </div>
                </div>

                {/* Access Code Form (appears below selected class) */}
                {selectedClass?._id === cls._id && (
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <div className="flex items-center mb-3">
                      <FiLock className="text-blue-600 mr-2" />
                      <span className="text-sm font-medium text-gray-700">
                        Enter access code
                      </span>
                    </div>

                    <div className="relative">
                      <input
                        type="text"
                        value={codeInput}
                        onChange={(e) => setCodeInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Enter class code"
                        className="w-full p-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        disabled={isLoading}
                      />
                      <FiLock className="absolute left-3 top-3 text-gray-400" />
                    </div>

                    {errorCode && (
                      <div className="flex items-center mt-2 text-sm text-red-600">
                        <FiX className="mr-1" />
                        <span>{errorCode}</span>
                      </div>
                    )}

                    <button
                      onClick={verifyCode}
                      disabled={isLoading || !codeInput.trim()}
                      className={`mt-3 w-full flex items-center justify-center py-2 px-4 rounded-lg transition-colors ${
                        isLoading
                          ? "bg-blue-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700"
                      } text-white font-medium`}
                    >
                      {isLoading ? (
                        "Verifying..."
                      ) : (
                        <>
                          <FiCheck className="mr-2" />
                          Verify
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Empty State */}
          {classes.length === 0 && (
            <div className="bg-white rounded-xl p-8 text-center border border-gray-200 max-w-2xl mx-auto">
              <FiFolder className="mx-auto text-gray-400 text-4xl mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                No Classes Available
              </h3>
              <p className="text-gray-500 mb-6">
                There are currently no classes set up for assessment. Please
                create classes first.
              </p>
              <button
                onClick={() => navigate("/settings/classes")}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FiPlus className="mr-2" />
                Manage Classes
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ClassAssess;
