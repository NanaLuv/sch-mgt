import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import Sidebar from "../other-components/sidebar";
import { FaMoneyBillWave, FaHistory, FaSms } from "react-icons/fa"; // Import Icons
import {
  FiDollarSign,
  FiInfo,
  FiSearch,
  FiDownload,
  FiLoader,
  FiClock,
  FiSend,
  FiX,
  FiFolder,
  FiAlertCircle,
} from "react-icons/fi";
import { Tooltip } from "react-tooltip"; //Import React Tooltip
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx";

const FeeCollection = () => {
  const { className } = useParams();
  const decodedClassName = decodeURIComponent(className);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [history, setHistory] = useState();

  const [filter, setFilter] = useState("All"); // Default: Show all students
  const [studentsPerPage, setStudentsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(""); // Search query state

  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("Cash");
  const [reference, setReference] = useState("");

  // Framer Motion animation variants for modal
  const modalVariants = {
    hidden: { opacity: 0, y: "-50%", scale: 0.8 },
    visible: { opacity: 1, y: "0%", scale: 1 },
    exit: { opacity: 0, y: "-50%", scale: 0.8 },
  };

  //  Filter Students Based on Selected Status
  const filteredStudents = students
    .filter((student) => {
      if (filter === "Paid") return student.balance <= 0;
      if (filter === "Unpaid") return student.amountPaid === 0;
      if (filter === "Partial")
        return student.amountPaid > 0 && student.balance > 0;
      return true; // "All" shows all students
    })
    .filter((student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  // Export Filtered Data to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredStudents);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students Fees");
    XLSX.writeFile(workbook, "Filtered_Students_Fees.xlsx");
  };

  // Pagination
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const displayedStudents = filteredStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );

  //set status for paid, upaid and partial payment
  const getStatus = (amount, amountPaid) => {
    if (amountPaid === 0)
      return <span className="text-red-600 font-bold"> Unpaid</span>;
    if (amountPaid < amount)
      return <span className="text-yellow-600 font-bold"> Partial</span>;
    return <span className="text-green-500 font-bold"> Paid</span>;
  };

  //api
  //handle payment
  const handlePayment = (e) => {
    e.preventDefault();
    if (!amount || amount <= 0) {
      alert("Enter a valid amount");
      return;
    }
    axios
      .post(
        `http://localhost:3001/school/pay-fee/${selectedStudent.studentId}`,
        {
          amount: Number(amount),
          method,
          reference,
        }
      )
      .then((response) => {
        toast.success("Payment success"); // Success toast
        console.log(response.data);
        fetchFeesData(decodedClassName); // Refresh fee table after payment
        setAmount("");
        setMethod("Cash");
        setReference("");
        setSelectedStudent(null);
      })
      .catch((error) => {
        console.error("Payment error:", error);
        toast.error("Payment failed. Please try again."); // Error toast
      });
  };

  //fetch fees data
  const fetchFeesData = (selectedClass) => {
    axios
      .get(
        `http://localhost:3001/school/students/class-fee/${encodeURIComponent(
          selectedClass
        )}`
      )
      .then((response) => {
        console.log("fetched fees", response.data); //  Update Table with Fee Data
        setStudents(response.data); //  Update Table with Fee Data
        setHistory(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching fees:", error);
        setLoading(false);
      });
  };

  //  Fetch Fees When a Class is Selected
  useEffect(() => {
    fetchFeesData(decodedClassName);
  }, [decodedClassName]);

  //  Open Payment History Modal
  const openHistoryModal = (student) => {
    setHistory(student);
    setShowHistoryModal(true);
  };

  //  Close Payment History Modal
  const closeHistoryModal = () => {
    setShowHistoryModal(false);
    setSelectedStudent(null);
  };

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

  const handleClose = () => {
    setAmount("");
    setMethod("Cash");
    setReference("");
    setSelectedStudent(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-10 bg-white shadow-md">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center md:ml-64">
            <FiDollarSign className="mr-5 text-blue-500" />
            <h1 className="text-xl font-bold text-gray-800">Fees Collection</h1>
          </div>
        </div>
      </header>

      <div className="flex flex-col md:flex-row flex-1 pt-16">
        <Sidebar />

        <main className="flex-1 p-4 md:p-8 lg:ml-64">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              Fees Collection —{" "}
              <span className="text-blue-600">{decodedClassName}</span>
              {"    "}
              <span className="text-green-800 text-sm">
                {" "}
                students {students.length}
              </span>
            </h1>
            <div className="flex items-center text-gray-600">
              <FiInfo className="mr-1" />
              <span>Manage student fee payments for this class</span>
            </div>
          </div>

          {/* Tooltips */}
          <Tooltip id="pay-tooltip" place="top" effect="solid" />
          <Tooltip id="history-tooltip" place="top" effect="solid" />
          <Tooltip id="sms-tooltip" place="top" effect="solid" />

          {/* Filters and Actions */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              {/* Status Filters */}
              <div className="flex flex-wrap gap-2">
                {["All", "Paid", "Partial", "Unpaid"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                      filter === status
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>

              {/* Search and Export */}
              <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                <div className="relative w-full md:w-64">
                  <FiSearch className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search students..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={exportToExcel}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <FiDownload className="text-lg" />
                  <span>Export Excel</span>
                </button>
              </div>
            </div>
          </div>

          {/* Fees Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Class
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Total Fees
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Paid
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Balance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-4 text-center">
                        <div className="flex justify-center">
                          <FiLoader className="animate-spin text-blue-500 text-2xl" />
                        </div>
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-6 py-4 text-center text-red-500"
                      >
                        {error}
                      </td>
                    </tr>
                  ) : filteredStudents.length === 0 ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        No matching students found
                      </td>
                    </tr>
                  ) : (
                    displayedStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 capitalize">
                            {student.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {decodedClassName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            GH₵ {student.totalAmount}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-green-600">
                            GH₵ {student.amountPaid}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-red-600">
                            GH₵ {student.totalAmount - student.amountPaid}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              getStatus(
                                student.totalAmount,
                                student.amountPaid
                              ) === "Paid"
                                ? "bg-green-100 text-green-800"
                                : getStatus(
                                    student.totalAmount,
                                    student.amountPaid
                                  ) === "Partial"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {getStatus(student.totalAmount, student.amountPaid)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-3">
                            <button
                              onClick={() => setSelectedStudent(student)}
                              className="text-green-600 hover:text-green-800"
                              data-tooltip-id="pay-tooltip"
                              data-tooltip-content="Make Payment"
                            >
                              <FiDollarSign size={18} />
                            </button>
                            <button
                              onClick={() => openHistoryModal(student)}
                              className="text-blue-600 hover:text-blue-800"
                              data-tooltip-id="history-tooltip"
                              data-tooltip-content="Payment History"
                            >
                              <FiClock size={18} />
                            </button>
                            <button
                              className="text-yellow-600 hover:text-yellow-800"
                              data-tooltip-id="sms-tooltip"
                              data-tooltip-content="Send Reminder"
                            >
                              <FiSend size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredStudents.length > 0 && (
              <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
                <div className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">
                    {(currentPage - 1) * studentsPerPage + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(
                      currentPage * studentsPerPage,
                      filteredStudents.length
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">{filteredStudents.length}</span>{" "}
                  students
                </div>
                <div className="flex items-center space-x-2">
                  <select
                    value={studentsPerPage}
                    onChange={(e) => setStudentsPerPage(Number(e.target.value))}
                    className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="5">5 per page</option>
                    <option value="10">10 per page</option>
                    <option value="20">20 per page</option>
                    <option value="50">50 per page</option>
                  </select>
                  <div className="flex space-x-1">
                    <button
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
                      disabled={currentPage === 1}
                      className="px-3 py-1 rounded-md border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() =>
                        setCurrentPage(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 rounded-md border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Payment Modal */}
          {selectedStudent && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-800">
                      <FiDollarSign className="inline mr-2 text-blue-500" />
                      Payment for {selectedStudent.name}
                    </h3>
                    <button
                      onClick={handleClose}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <FiX size={20} />
                    </button>
                  </div>

                  <form onSubmit={handlePayment} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Total Fees
                        </label>
                        <div className="p-2 bg-gray-100 rounded-md">
                          GH₵ {selectedStudent.totalAmount}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Balance
                        </label>
                        <div className="p-2 bg-gray-100 rounded-md">
                          GH₵{" "}
                          {selectedStudent.totalAmount -
                            selectedStudent.amountPaid}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Amount to Pay *
                      </label>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        max={
                          selectedStudent.totalAmount -
                          selectedStudent.amountPaid
                        }
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Payment Method *
                      </label>
                      <select
                        value={method}
                        onChange={(e) => setMethod(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Select method</option>
                        <option value="Cash">Cash</option>
                        <option value="Mobile Money">Mobile Money</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                        <option value="Card">Card</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Reference/Note
                      </label>
                      <input
                        type="text"
                        value={reference}
                        onChange={(e) => setReference(e.target.value)}
                        placeholder="Transaction reference or note"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={handleClose}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Record Payment
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Payment History Modal */}
          {showHistoryModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-800">
                      <FiClock className="inline mr-2 text-blue-500" />
                      Payment History for {history.name}
                    </h3>
                    <button
                      onClick={closeHistoryModal}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <FiX size={20} />
                    </button>
                  </div>

                  <div className="overflow-y-auto max-h-[60vh]">
                    {history.paymentHistory.length > 0 ? (
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Amount
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Method
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Reference
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {history.paymentHistory.map((payment, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {payment.date
                                  ? new Date(payment.date).toLocaleDateString(
                                      "en-GB",
                                      {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                      }
                                    )
                                  : "N/A"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                                GH₵ {payment.amount}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {payment.method}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {payment.reference || "—"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <FiFolder className="mx-auto text-3xl mb-2" />
                        No payment history available
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      onClick={closeHistoryModal}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default FeeCollection;
