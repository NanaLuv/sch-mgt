// 📦 Dependencies
import { useEffect, useState } from "react";
import axios from "axios";
import { div } from "framer-motion/client";
import Sidebar from "../other-components/sidebar";
import {
  FiCalendar,
  FiInfo,
  FiEdit2,
  FiCheckCircle,
  FiChevronDown,
  FiUsers,
} from "react-icons/fi";

export default function Academics() {
  const [currentTerm, setCurrentTerm] = useState(null);
  const [year, setYear] = useState("");
  const [term, setTerm] = useState(1);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [message, setMessage] = useState("");
  const [newTerm, setNewTerm] = useState();

  //get current term details
  const getCurrentTerm = () => {
    axios
      .get("http://localhost:3001/school/term/current")
      .then((res) => {
        setCurrentTerm(res.data);
        setYear(res.data.year);
        setTerm(res.data.term);
        console.log(currentTerm);
      })
      .catch((err) => console.error("Failed to load current term", err));
  };
  useEffect(() => {
    getCurrentTerm();
  }, []);

  const handleSwitchTerm = () => {
    if (!term || !year || !startDate || !endDate) {
      return alert("all fields required");
    }
    axios
      .post("http://localhost:3001/school/term/switch", {
        year,
        term,
        startDate,
        endDate,
      })
      .then((res) => {
        setNewTerm(res.data);
        console.log(newTerm);
        getCurrentTerm();
        setMessage("Term switched successfully");
        setTimeout(() => setMessage(null), 3000);
      })
      .catch((err) => {
        console.error("Error switching term:", err);
        setMessage("Something went wrong");
        setTimeout(() => setMessage(null), 3000);
      });
  };

  useEffect(() => {
    console.log({ "current term": currentTerm, newterm: newTerm });
  }, [currentTerm, newTerm]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-10 bg-white shadow-md">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center md:ml-64">
            <h1 className="text-xl font-bold text-gray-800">Term Switch</h1>
          </div>
        </div>
      </header>

      <div className="flex flex-col md:flex-row flex-1 pt-16">
        <Sidebar />

        <main className="flex-1 p-4 md:p-8 lg:ml-64">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-6 pb-4 border-b border-gray-200">
              <div className="flex items-center">
                <FiCalendar className="text-blue-600 mr-3 text-2xl" />
                <h2 className="text-2xl font-bold text-gray-800">
                  Academic Term Management
                </h2>
              </div>
              <p className="text-gray-600 mt-1">
                Switch between academic terms and configure term dates
              </p>
            </div>

            {/* Current Term Card */}
            {currentTerm && (
              <div className="mb-8 p-5 bg-blue-50 rounded-lg border border-blue-100">
                <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
                  <FiInfo className="mr-2" />
                  Current Active Term
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-600">
                      Term Period
                    </p>
                    <p className="font-medium">
                      Term {currentTerm.term}, {currentTerm.year}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-600">
                      Date Range
                    </p>
                    <p className="font-medium">
                      {new Date(currentTerm.startDate).toLocaleDateString(
                        "en-GB",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }
                      )}{" "}
                      -{" "}
                      {new Date(currentTerm.endDate).toLocaleDateString(
                        "en-GB",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* New Term Form */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <FiEdit2 className="mr-2 text-blue-600" />
                Configure New Term
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Academic Year */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Academic Year <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      placeholder="e.g. 2023/2024"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    <FiCalendar className="absolute right-3 top-3 text-gray-400" />
                  </div>
                </div>

                {/* Term Selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Term <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                    required
                  >
                    <option value="">Select Term</option>
                    <option value="1">Term 1</option>
                    <option value="2">Term 2</option>
                    <option value="3">Term 3</option>
                  </select>
                  <FiChevronDown className="absolute right-3 top-10 text-gray-400 pointer-events-none" />
                </div>

                {/* Start Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    <FiCalendar className="absolute right-3 top-3 text-gray-400" />
                  </div>
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    <FiCalendar className="absolute right-3 top-3 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row justify-end gap-3">
                <button
                  onClick={handleSwitchTerm}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <FiCheckCircle />
                  Confirm Term Switch
                </button>
              </div>

              {/* Success Message */}
              {message && (
                <div className="mt-6 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start">
                  <FiCheckCircle className="text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <p className="text-green-700">{message}</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
