import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import Sidebar from "../other-components/sidebar";
import {
  FiDollarSign,
  FiBook,
  FiFolder,
  FiPlus,
  FiAlertCircle,
  FiLoader,
} from "react-icons/fi";

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3001/school/class")
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

  // Framer Motion Page Animation Variants
  const pageVariants = {
    initial: { opacity: 0, x: "100vw" },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: "100vw" },
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-10 bg-white shadow-md">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center md:ml-64">
            <FiDollarSign className="mr-2 text-blue-500" />
            <h1 className="text-xl font-bold text-gray-800">Fees Management</h1>
          </div>
        </div>
      </header>

      <div className="flex flex-col md:flex-row flex-1 pt-16">
        <Sidebar />
        <main className="flex-1 p-4 md:p-8">
          <motion.div
            className="p-6 bg-gray-100 min-h-screen lg:ml-64"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={{ duration: 0.5 }}
          >
            {/* Page Header */}
            <div className="mb-8 text-center">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                Fees Collection By Class
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Select a class to view and manage fee payments
              </p>
            </div>

            {/* Class Grid */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <FiLoader className="animate-spin text-blue-500 text-4xl" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {classes.map((cls) => (
                  <div
                    key={cls._id}
                    className="group p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                    onClick={() =>
                      navigate(
                        `/fees-collection/${encodeURIComponent(cls.name)}`
                      )
                    }
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                        <FiBook className="text-blue-600 text-2xl" />
                      </div>
                      <h2 className="text-lg font-semibold text-gray-800 mb-1">
                        {cls.name}
                      </h2>
                      <p className="text-sm text-gray-500">{cls.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {classes.length === 0 && (
              <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
                <FiFolder className="mx-auto text-gray-400 text-4xl mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  No Classes Found
                </h3>
                <p className="text-gray-500 mb-4">
                  There are currently no classes available for fee collection.
                </p>
                <button
                  onClick={() => navigate("/settings")}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FiPlus className="mr-2" />
                  Create New Class
                </button>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <div className="flex items-center text-red-700">
                  <FiAlertCircle className="mr-2" />
                  <span>{error}</span>
                </div>
                ;
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Classes;
