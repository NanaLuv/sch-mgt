import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { div } from "framer-motion/client";
import Swal from "sweetalert2";
import Sidebar from "../other-components/sidebar";
import {
  FiSearch,
  FiX,
  FiPlus,
  FiDownload,
  FiUser,
  FiEdit2,
  FiEye,
  FiTrash2,
  FiLoader,
  FiUsers,
  FiAlertCircle,
} from "react-icons/fi";

const Students = () => {
  // const Navigate = useNavigate();
  // const { id } = useParams;

  const [students, setStudents] = useState({
    firstName: "",
    surname: "",
    name: "",
    gender: "",
    classes: "",
    dob: "",
    parentName: "",
    contact: "",
  });

  //keeps all registered students

  const [isFormVisible, setIsFormVisible] = useState(false); // Toggle form visibility
  const [isEditFormVisible, setIsEditFormVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [allClasses, setAllClasses] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [studentError, setStudentError] = useState("");

  const [studentsPerPage, setStudentsPerPage] = useState(5); // Default: 5 per page
  const [searchQuery, setSearchQuery] = useState("");

  //handleInputChange
  const handleInputChange = (e, setForm) => {
    const { name, value } = e.target;
    setForm((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const filteredStudents = allStudents.filter((student) => {
    return student.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Determine the students to display
  const displayedStudents =
    studentsPerPage === "All"
      ? filteredStudents
      : filteredStudents.slice(0, studentsPerPage);

  const handleRowsPerPageChange = (e) => {
    setStudentsPerPage(
      e.target.value === "All" ? "All" : Number(e.target.value)
    );
  };

  //update student name input field in update form
  useEffect(() => {
    setStudents((students) => ({
      ...students,
      name: `${students?.firstName} ${students?.surname}`.trim(),
    }));
  }, [students?.firstName, students?.surname]);

  //edit /update student
  function handleEdit(student) {
    if (!student) {
      console.error("student not found", student);
      return;
    }
    setStudents({
      id: student.id,
      firstName: student.firstName,
      surname: student.surname,
      name: student.name,
      gender: student.gender,
      classes: student.class,
      dob: student.dob,
      parentName: student.parentName,
      contact: student.contact,
    });
    setIsEditFormVisible(true);
  }

  //api
  //fetch class from the api[get the names]
  useEffect(() => {
    axios
      .get(`http://localhost:3001/school/student-classes`)
      .then((result) => {
        if (result) {
          setAllClasses(result.data);
          return;
        }
      })
      .catch((error) => console.error("Error fetching classes:", error));
  }, []);

  //save students
  function handleSubmitSave(e) {
    e.preventDefault();
    setStudentError("");
    setLoading(true);
    setNotification(null);
    console.log("students data", students);
    axios
      .post("http://localhost:3001/school/add-student", students)
      .then((result) => {
        console.log(result.data);
        setNotification({
          message: "Saved successfully!",
          type: "success",
        });
        setLoading(false);
        setTimeout(() => setNotification(null), 3000); // Hide notification after 3 seconds
        setStudents({
          firstName: "",
          surname: "",
          name: "",
          gender: "",
          classes: [],
          dob: "",
          parentName: "",
          contact: "",
        });
      })
      .catch((error) => {
        setStudentError(error.response?.data?.msg);
        setNotification({
          type: "error",
          message: "failed to Add Student",
        });
        setLoading(false);
        setTimeout(() => setNotification(null), 3000); // Hide notification after 3 seconds
      });
  }

  //get all students
  const getAllStudents = () => {
    setLoading(true);
    axios
      .get("http://localhost:3001/school/get-students")
      .then((result) => {
        const studentData = result.data.map((student) => ({
          id: student._id,
          firstName: student.firstName,
          surname: student.surname,
          name: student.name,
          dob: student.dob,
          contact: student.contact,
          gender: student.gender,
          class: student.class.map((stuClass) => stuClass.name),
          parentName: student.parentName,
        }));
        setAllStudents(studentData);
        setLoading(false);
      })
      .catch((error) => console.log(error));
    setLoading(false);
  };

  useEffect(() => {
    getAllStudents();
  }, []);

  //close button refreshes and get all students in the table
  function handleClose() {
    axios
      .get("http://localhost:3001/school/get-students")
      .then((result) => {
        const studentData = result.data.map((student) => ({
          id: student._id,
          name: student.name,
          gender: student.gender,
          contact: student.contact,
          class: student.class.map((stuClass) => stuClass.name),
        }));
        setAllStudents(studentData);
        setIsFormVisible(false);
        setIsEditFormVisible(false);
      })
      .catch((error) => console.log(error));
  }
  useEffect(() => {
    handleClose();
  }, []);

  //edit/update students
  function handleUpdate(e, formData, endpoint) {
    e.preventDefault();
    setLoading(true);
    setNotification(null);
    axios
      .put(`http://localhost:3001/school/${endpoint}/${formData.id}`, formData)
      .then((result) => {
        console.log(result.data);
        setNotification({
          message: "updated successfully!",
          type: "success",
        });
        setLoading(false);
        setTimeout(() => setNotification(null), 3000); // Hide notification after 3 seconds
        setStudents({
          firstName: "",
          surname: "",
          name: "",
          gender: "",
          classes: [],
          dob: "",
          parentName: "",
          contact: "",
        });
      })
      .catch((error) => {
        console.error("Error:", error);
        setNotification({
          message: "Failed to process request.",
          type: "error",
        });
        setLoading(false);
        setTimeout(() => setNotification(null), 3000); // Hide notification after 3 seconds
      });
  }

  //delete student
  function handleStudentDelete(id) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to undo this action!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:3001/school/delete/${id}`)
          .then((result) => {
            Swal.fire("Deleted!", "The item has been deleted.", "success");
            getAllStudents();
          })
          .catch((error) => console.log(error));
        Swal.fire("Error!", "Failed to delete the item.", "error");
      }
    });
  }

  // Framer Motion animation variants for modal
  const modalVariants = {
    hidden: { opacity: 0, y: "-50%", scale: 0.8 },
    visible: { opacity: 1, y: "0%", scale: 1 },
    exit: { opacity: 0, y: "-50%", scale: 0.8 },
  };

  // Framer Motion Page Animation Variants
  const pageVariants = {
    initial: { opacity: 0, x: "100vw" },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: "100vw" },
  };

  return (
    <div className="p-4 md:p-8 mt-12 bg-gray-100 min-h-screen flex flex-col md:flex-row w-full">
      <header className="fixed top-0 left-0 right-0 z-10 bg-white shadow-md">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center md:ml-64">
            <FiUsers className="text-blue-600 mr-2" />
            <h1 className="text-xl font-bold text-gray-800">Students</h1>
          </div>
        </div>
      </header>
      <Sidebar />
      <div>
        <motion.div
          className="p-6 bg-gray-100 min-h-screen lg:ml-64 w-full"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageVariants}
          transition={{ duration: 0.5 }}
        >
          <div className="min-h-screen mt-2">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-gray-50 border-b">
              <div className="relative w-full sm:w-64 mb-4 sm:mb-0">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <FiX className="text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>

              <div className="flex space-x-2 w-full sm:w-auto">
                <button
                  onClick={() => setIsFormVisible(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                >
                  <FiPlus className="text-lg" />
                  <span>Add Student</span>
                </button>
                {/* <button
                  // onClick={handleExport}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                >
                  <FiDownload className="text-lg" />
                  <span>Export</span>
                </button> */}
              </div>
            </div>

            {/* Add Student Form Modal */}
            {isFormVisible && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                {/* notification box*/}
                {notification && (
                  <div
                    className={`absolute top-0 right-0 mt-2 p-3 rounded-md text-white ${
                      notification.type === "success"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  >
                    {notification.message}
                  </div>
                )}
                <motion.div
                  className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl overflow-y-auto max-h-[90vh]"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={modalVariants}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-bold text-blue-600 mb-6">
                    Add Student
                  </h2>
                  <form onSubmit={handleSubmitSave} className="space-y-6">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-6 border-b pb-4">
                        Student Information
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* First Name */}
                        <div>
                          <label
                            htmlFor="firstName"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            First Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            id="firstName"
                            name="firstName"
                            type="text"
                            value={students.firstName}
                            onChange={(e) => handleInputChange(e, setStudents)}
                            placeholder="Enter first name"
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 border"
                            required
                          />
                        </div>

                        {/* Surname */}
                        <div>
                          <label
                            htmlFor="surname"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Surname <span className="text-red-500">*</span>
                          </label>
                          <input
                            id="surname"
                            name="surname"
                            type="text"
                            value={students.surname}
                            onChange={(e) => handleInputChange(e, setStudents)}
                            placeholder="Enter surname"
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 border"
                            required
                          />
                        </div>

                        {/* Full Name (auto-generated) */}
                        <div>
                          <label
                            htmlFor="fullName"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Full Name
                          </label>
                          <input
                            id="fullName"
                            name="name"
                            type="text"
                            value={students.name}
                            readOnly
                            className="block w-full rounded-md bg-gray-100 border-gray-300 p-2.5 border cursor-not-allowed"
                          />
                        </div>

                        {/* Gender */}
                        <div>
                          <label
                            htmlFor="gender"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Gender <span className="text-red-500">*</span>
                          </label>
                          <select
                            id="gender"
                            name="gender"
                            value={students.gender}
                            onChange={(e) => handleInputChange(e, setStudents)}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 border"
                            required
                          >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>

                        {/* Class */}
                        <div>
                          <label
                            htmlFor="class"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Class <span className="text-red-500">*</span>
                          </label>
                          <select
                            id="class"
                            name="classes"
                            value={students.classes}
                            onChange={(e) => handleInputChange(e, setStudents)}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 border"
                            required
                          >
                            <option value="">Select Class</option>
                            {allClasses.map((className, index) => (
                              <option key={index} value={className}>
                                {className}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Date of Birth */}
                        <div>
                          <label
                            htmlFor="dob"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Date of Birth{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            id="dob"
                            name="dob"
                            type="date"
                            value={students.dob}
                            onChange={(e) => handleInputChange(e, setStudents)}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 border"
                            required
                          />
                        </div>

                        {/* Parent Name */}
                        <div>
                          <label
                            htmlFor="parentName"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Parent/Guardian Name{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            id="parentName"
                            name="parentName"
                            type="text"
                            value={students.parentName}
                            onChange={(e) => handleInputChange(e, setStudents)}
                            placeholder="Enter parent/guardian name"
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 border"
                            required
                          />
                        </div>

                        {/* Contact */}
                        <div>
                          <label
                            htmlFor="contact"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Contact Number{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            id="contact"
                            name="contact"
                            type="tel"
                            value={students.contact}
                            onChange={(e) => handleInputChange(e, setStudents)}
                            placeholder="Enter contact number"
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 border"
                            required
                          />
                        </div>
                      </div>
                      {studentError && (
                        <p className="mt-1 text-xl text-red-600 flex items-center">
                          <FiAlertCircle className="mr-1" size={20} />
                          {studentError}
                        </p>
                      )}
                    </div>
                    {/* Form Actions */}
                    <div className="flex justify-end space-x-4 mt-6">
                      <button
                        type="button"
                        onClick={handleClose}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Save Student
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}

            {isEditFormVisible && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                {/* notification box*/}
                {notification && (
                  <div
                    className={`absolute top-0 right-0 mt-2 p-3 rounded-md text-white ${
                      notification.type === "success"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  >
                    {notification.message}
                  </div>
                )}
                <motion.div
                  className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl overflow-y-auto max-h-[90vh]"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={modalVariants}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-bold text-blue-600 mb-6">
                    Update Student
                  </h2>
                  <form
                    className="space-y-4 bg-gray-50 p-4 rounded-lg shadow-inner"
                    onSubmit={(e) => handleUpdate(e, students, "update")}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700">
                          First Name
                        </label>
                        <input
                          placeholder="First Name"
                          value={students.firstName}
                          type="text"
                          name="firstName"
                          onChange={(e) => handleInputChange(e, setStudents)}
                          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700">Surname</label>
                        <input
                          placeholder="Surname"
                          type="text"
                          name="surname"
                          value={students.surname}
                          onChange={(e) => handleInputChange(e, setStudents)}
                          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700">Full Name</label>
                        <input
                          placeholder="Full Name"
                          value={students.name}
                          type="text"
                          name="name"
                          readOnly
                          className="bg-gray-200 cursor-not-allowed border border-gray-300 rounded-md p-2 w-full"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700">Gender</label>
                        <select
                          name="gender"
                          value={students.gender}
                          onChange={(e) => handleInputChange(e, setStudents)}
                          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                          required
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-700">Class</label>
                        <select
                          name="classes"
                          value={students.classes}
                          onChange={(e) => handleInputChange(e, setStudents)}
                          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                          required
                        >
                          <option value="">Select Class</option>
                          {allClasses.map((className, index) => (
                            <option key={index} value={className}>
                              {className}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-700">
                          Date of Birth
                        </label>
                        <input
                          placeholder="Date of Birth"
                          value={students.dob}
                          type="date"
                          name="dob"
                          onChange={(e) => handleInputChange(e, setStudents)}
                          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700">
                          Parent Name
                        </label>
                        <input
                          placeholder="Parent Name"
                          value={students.parentName}
                          type="text"
                          name="parentName"
                          onChange={(e) => handleInputChange(e, setStudents)}
                          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700">Contact</label>
                        <input
                          placeholder="Contact"
                          value={students.contact}
                          type="text"
                          name="contact"
                          onChange={(e) => handleInputChange(e, setStudents)}
                          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={handleClose}
                        className="px-4 py-2 bg-gray-500 text-white rounded-md shadow hover:bg-gray-600 transition"
                      >
                        Close
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition"
                      >
                        Update
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}

            {/* Student Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Student
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Class
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Contact
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center">
                        <div className="flex justify-center">
                          <FiLoader className="animate-spin text-blue-500 text-2xl" />
                        </div>
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-4 text-center text-red-500"
                      >
                        {error}
                      </td>
                    </tr>
                  ) : displayedStudents.length > 0 ? (
                    displayedStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              {student.gender === "Female" ? (
                                <FiUser className="text-pink-500" />
                              ) : (
                                <FiUser className="text-blue-500" />
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 capitalize">
                                {student.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {student.gender}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                            {student.class}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div>{student.contact}</div>
                          <div className="text-xs text-gray-400">
                            {student.parentName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              student.status === "Active"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {student.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleEdit(student)}
                              className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                              title="Edit"
                            >
                              <FiEdit2 size={18} />
                            </button>
                            {/* <button
                              // onClick={() => handleView(student)}
                              className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors"
                              title="View"
                            >
                              <FiEye size={18} />
                            </button> */}
                            <button
                              onClick={() => handleStudentDelete(student.id)}
                              className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                              title="Delete"
                            >
                              <FiTrash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        No students found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Rows per page dropdown */}
            <div className="flex justify-end items-center mt-4">
              <label className="text-gray-700 font-medium">
                Rows per page:
                <select
                  value={studentsPerPage}
                  onChange={handleRowsPerPageChange}
                  className="ml-2 p-2 border border-gray-300 rounded-md"
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="All">All</option>
                </select>
              </label>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Students;
