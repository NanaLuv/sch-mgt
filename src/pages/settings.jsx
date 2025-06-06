import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AiOutlinePlus, AiFillEdit, AiFillDelete } from "react-icons/ai";
import axios from "axios";
import Swal from "sweetalert2";
import Sidebar from "../other-components/sidebar";
import { FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import Notification from "../other-components/notification";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("General Information");
  const [activeSection, setActiveSection] = useState("School Info");
  const [formVisibility, setFormVisibility] = useState("School Info");
  const [updateForm, setUpdateForm] = useState("School Info");
  const [tableData, setTableData] = useState({});
  const [subjectNames, setSubjectNames] = useState();
  const [allClasses, setAllClasses] = useState();
  const [allSubjects, setAllSubjects] = useState();
  const [allBills, setAllBills] = useState();
  const [teacherData, setTeacherData] = useState([]);
  const [feeStructureData, setFeeStructureData] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [classDropDown, setClassDropDown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  //forms state
  const [schoolInfo, setSchoolInfo] = useState({
    name: "",
    address: "",
    email: "",
    contact: "",
  });

  const [Class, setClass] = useState({
    name: "",
    description: "",
    subjects: [],
    Ccode: "",
  });
  const [subjects, setSubjects] = useState({
    name: "",
    shortName: "",
  });
  const [teachers, setTeachers] = useState({
    name: "",
    subjects: [],
    classNames: [],
    contact: "",
  });

  const [bill, setBill] = useState({
    name: "",
    amount: 0,
  });
  const [feeStructure, setFeeStructure] = useState({
    className: "",
    bills: [],
    totalAmount: 0,
  });
  const [fee, setFee] = useState({
    totalAmount: 0,
    amountPaid: 0,
    balance: 0,
    dueDate: "",
    method: "Cash",
    reference: "",
  });

  // Sections data
  const tabs = {
    "General Information": {
      "School Info": ["School Name", "Address", "Email", "Contact", "Action"],
      Class: ["Class Name", "Description", "Code", "Action"],
      Subjects: ["Subject Name", "Short Name", "Action"],
      Teachers: ["Teacher Name", "Subject", "Class", "Contact", "Action"],
    },
    Financials: {
      Bills: ["Name", "Amount", "Action"],
      "Fee Structure": ["Class", "Bills", "Amount", "Action"],
    },
  };

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

  // Initialize form visibility state
  const initializeFormVisibility = () => {
    const visibility = {};
    Object.keys(tabs).forEach((tab) => {
      Object.keys(tabs[tab]).forEach((section) => {
        visibility[section] = false;
      });
    });
    return visibility;
  };

  // Set initial state
  useEffect(() => {
    setFormVisibility(initializeFormVisibility());
  }, []);

  // Handle tab switching
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    const firstSection = Object.keys(tabs[tab])[0];
    setActiveSection(firstSection);
  };

  // Handle section switching
  const handleSectionClick = (section) => {
    setActiveSection(section);
  };

  // Toggle form visibility
  const toggleForm = (section) => {
    setFormVisibility(section);
  };

  //handleInputChange
  const handleInputChange = (e, setForm) => {
    const { name, value } = e.target;
    setForm((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  //handle toggle subjects
  const toggleSubject = (subject) => {
    setClass((prevClass) => ({
      ...prevClass,
      subjects: prevClass.subjects.includes(subject)
        ? prevClass.subjects.filter((item) => item !== subject)
        : [...prevClass.subjects, subject],
    }));
  };

  //remove subjects
  const removeSubject = (subject) => {
    setClass((prevClass) => ({
      ...prevClass,
      subjects: prevClass.subjects.filter((item) => item !== subject),
    }));
  };

  //handle teacher toggle subjects
  const toggleTeacherSubjects = (subject) => {
    setTeachers((prevSubject) => ({
      ...prevSubject,
      subjects: prevSubject.subjects.includes(subject)
        ? prevSubject.subjects.filter((item) => item !== subject)
        : [...prevSubject.subjects, subject],
    }));
  };

  //handle teacher toggle class
  const toggleTeacherClass = (Class) => {
    setTeachers((prevClass) => ({
      ...prevClass,
      classNames: prevClass.classNames.includes(Class)
        ? prevClass.classNames.filter((item) => item !== Class)
        : [...prevClass.classNames, Class],
    }));
  };

  //handle fee structure toggle class
  const toggleFeeStructureClass = (Class) => {
    setFeeStructure((prevClass) => ({
      ...prevClass,
      className: prevClass.className.includes(Class)
        ? prevClass.className.filter((item) => item !== Class)
        : [...prevClass.className, Class],
    }));
  };

  //handle fee structure toggle classes
  const toggleFeeStructureBill = (bill) => {
    setFeeStructure((prevBill) => ({
      ...prevBill,
      bills: prevBill.bills.includes(bill)
        ? prevBill.bills.filter((item) => item !== bill)
        : [...prevBill.bills, bill],
    }));
  };

  //handle edit of the section forms
  const handleEdit = (item, section) => {
    if (!item) {
      console.error("error item not found", item);
      return;
    }
    setSchoolInfo({
      id: item._id,
      name: item.name,
      address: item.address,
      email: item.email,
      contact: item.contact,
    });
    setSubjects({
      id: item._id,
      name: item.name,
      shortName: item.shortName,
    });

    setClass({
      id: item._id,
      name: item.name,
      description: item.description,
      subjects: item.subjects,
      code: item.code,
    });
    setTeachers({
      id: item.id,
      name: item.name,
      subjects: item.subjects || [],
      classNames: item.class || [],
      contact: item.contact,
    });
    setBill({
      id: item._id,
      name: item.name,
      amount: item.amount,
    });
    setFeeStructure({
      id: item.id,
      className: item.className,
      bills: item.bills,
      totalAmount: item.totalAmount,
    });
    setUpdateForm(section);
  };

  //api requests

  //making a post requests for each section
  const handleSubmit = (e, formData, endpoint) => {
    e.preventDefault();
    setLoading(true);
    setNotification(null);
    axios
      .post(`http://localhost:3001/school/${endpoint}`, formData)
      .then((result) => {
        if (result.data) {
          console.log(result.data);
          setNotification({
            message: "Saved successfully!",
            type: "success",
          });
          setSubjects({
            name: "",
            shortName: "",
          });
          setClass({
            name: "",
            description: "",
            subjects: [],
            code: "",
          });
          setTeachers({
            name: "",
            contact: "",
            subjects: [],
            classNames: [],
          });
          setBill({
            name: "",
            amount: 0,
          });
          setFeeStructure({
            className: [],
            bills: [],
            totalAmount: 0,
          });
          setLoading(false);
          setTimeout(() => setNotification(null), 3000); // Hide notification after 3 seconds
          setTableData(result.data);
          return;
        }
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
  };

  //get all data based on section clicked
  useEffect(() => {
    if (activeSection) {
      axios
        .get(
          `http://localhost:3001/school/${activeSection
            .toLowerCase()
            .replace(/\s+/g, "")}`
        )
        .then((result) => {
          if (result) {
            setTableData(result.data);
            console.log("Fetched Data:", result.data);
            return;
          }
        })
        .catch((error) =>
          console.error(`Error fetching ${activeSection.toLowerCase()}:`, error)
        );
    }
  }, [activeSection]);

  // Log tableData  it's updated
  useEffect(() => {
    console.log("Updated tableData:", tableData);
  }, [tableData]);

  //get subject names for class forms
  useEffect(() => {
    if (activeSection) {
      axios
        .get(
          `http://localhost:3001/school/subject-names/${activeSection.toLowerCase()}`
        )
        .then((result) => {
          if (result) {
            console.log("subjects:", result.data);
            setSubjectNames(result.data);
            return;
          }
        })
        .catch((error) => console.error("Error fetching subjects:", error));
    }
  }, [activeSection]);

  //get both class and subject and update the teacher state
  useEffect(() => {
    if (activeSection) {
      axios
        .get(
          `http://localhost:3001/school/classes-subjects/${activeSection.toLowerCase()}`
        )
        .then((result) => {
          if (result) {
            const classesNames = result.data.classes.map((cls) => cls.name);
            const subsNames = result.data.subjects.map((sub) => sub.name);
            setAllClasses(classesNames);
            setAllSubjects(subsNames);
            return;
          }
        })
        .catch((error) => console.error("Error:", error));
    }
  }, [activeSection]);

  useEffect(() => {
    console.log("fetched classes", allClasses);
    console.log("fetched subjects", allSubjects);
  }, [allClasses, allSubjects]);

  //get both class and bills to update class and bill state
  useEffect(() => {
    if (activeSection) {
      axios
        .get(
          `http://localhost:3001/school/classes-bills/${activeSection
            .toLowerCase()
            .replace(/\s+/g, "")}`
        )
        .then((result) => {
          if (result) {
            const classesNames = result.data.classes.map((cls) => cls.name);
            const billNames = result.data.bills.map((bill) => bill.name);
            setAllClasses(classesNames);
            setAllBills(billNames);
            return;
          }
        })
        .catch((error) =>
          console.error("Error fetching classes and bills:", error)
        );
    }
  }, [activeSection]);

  useEffect(() => {
    console.log("fetched classes", allClasses);
    console.log("fetched bills", allBills);
  }, [allClasses, allBills]);

  //get teachers with subject, class names
  useEffect(() => {
    if (activeSection) {
      axios
        .get(`http://localhost:3001/school/t/${activeSection.toLowerCase()}`)
        .then((result) => {
          if (result) {
            console.log("teacher names", result.data);
            const formattedTeachers = result.data.map((teacher) => ({
              id: teacher._id,
              name: teacher.name,
              contact: teacher.contact,
              subjects: teacher.subjects.map((sub) => sub.shortName),
              class: teacher.class.map((cls) => cls.name),
            }));
            setTeacherData(formattedTeachers);
            return;
          }
        })
        .catch((error) => console.error("Error:", error));
    }
  }, [activeSection]);

  useEffect(() => {
    console.log("fetched teacher data", teacherData);
  }, [teacherData]);

  //get fee structure with bills and class names
  useEffect(() => {
    if (activeSection) {
      axios
        .get(
          `http://localhost:3001/school/fs/${activeSection
            .toLowerCase()
            .replace(/\s+/g, "")}`
        )
        .then((response) => {
          if (response) {
            console.log("fee structure names", response.data);
            const formattedBills = response.data.map((feeStr) => ({
              id: feeStr._id,
              className: feeStr.class.map((clsName) => clsName.name),
              bills: feeStr.bills.map((bill) => bill.name),
              totalAmount: feeStr.totalAmount,
            }));
            setFeeStructureData(formattedBills);
            return;
          }
        })
        .catch((error) => console.error("Error:", error));
    }
  }, [activeSection]);

  useEffect(() => {
    console.log("fetched fee structure data", feeStructureData);
  }, [feeStructureData]);

  //handle close for subjects
  const handleClose = (section) => {
    setFormVisibility(section);
    if (formVisibility) {
      axios
        .get(
          `http://localhost:3001/school/${activeSection
            .toLowerCase()
            .replace(/\s+/g, "")}`
        )
        .then((result) => {
          setTableData(result.data);
        })
        .catch((error) =>
          console.error(`Error fetching ${activeSection.toLowerCase()}:`, error)
        );
      setUpdateForm(false);
      setFormVisibility(false);
    }
  };

  // make an update for a section (put request)
  const handleUpdate = (e, formData, endpoint) => {
    e.preventDefault();
    setLoading(true);
    setNotification(null);
    axios
      .put(`http://localhost:3001/school/${endpoint}/${formData.id}`, formData)
      .then((result) => {
        if (result.data) {
          console.log(result.data);
          setNotification({
            message: "updated successfully!",
            type: "success",
          });
          setLoading(false);
          setTimeout(() => setNotification(null), 3000); // Hide notification after 3 seconds
          setSubjects({
            name: "",
            shortName: "",
          });
          setClass({
            name: "",
            description: "",
            subjects: [],
            code: "",
          });
          setTeachers({
            name: "",
            subjects: [],
            classNames: [],
            contact: "",
          });
          setBill({
            name: "",
            amount: 0,
          });
          return;
        }
        setTableData(result.data);
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
  };

  const handleDelete = (id) => {
    if (activeSection) {
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
            .delete(
              `http://localhost:3001/school/${activeSection
                .toLowerCase()
                .replace(/\s+/g, "")}/${id}`
            )
            .then((response) => {
              console.log(response.data);
              Swal.fire("Deleted!", "The item has been deleted.", "success");
            })
            .catch((error) => {
              console.error("Error:", error);
              Swal.fire("Error!", "Failed to delete the item.", "error");
            });
        }
      });
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex">
      <Sidebar />
      <div className="w-full bg-white mx-auto md:ml-0 lg:ml-64">
        {/* Tabs General information / Finance */}
        <div className="flex justify-center space-x-4 my-16">
          {Object.keys(tabs).map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              className={`px-6 py-2 font-medium transition duration-300 border-b-4 ${
                activeTab === tab
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:border-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content Under Active Tab */}
        <div className="flex flex-col lg:flex-row">
          {/* Sidebar Buttons */}
          <div className="flex flex-wrap lg:flex-col lg:w-1/4 p-4 bg-white rounded-lg shadow-md">
            {Object.keys(tabs[activeTab]).map((section) => (
              <button
                key={section}
                onClick={() => handleSectionClick(section)}
                className={`w-full px-4 py-2 mb-2 font-medium rounded-md transition duration-300 text-left ${
                  activeSection === section
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-blue-600 hover:bg-blue-100"
                }`}
              >
                {section}
              </button>
            ))}
          </div>

          {/* Dynamic Content Section */}
          <motion.div
            className="flex-1 bg-white p-6 rounded-lg shadow-md"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <div className="flex items-center">
              <h2 className="text-xl font-semibold mb-4">{activeSection}</h2>
              <div
                className=" bg-green-600 rounded-ful p-3 rounded-full mx-4 mb-3 cursor-pointer"
                onClick={() => toggleForm(activeSection)}
              >
                <AiOutlinePlus
                  size={20}
                  style={{ strokeWidth: "5", color: "white" }}
                />
              </div>
            </div>

            {/* form for current section school info  */}
            {formVisibility === "School Info" && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                {/* import notification component */}
                {notification && <Notification notification={notification} />}
                <motion.div
                  className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl overflow-y-auto max-h-[90vh]"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={modalVariants}
                  transition={{ duration: 0.3 }}
                >
                  <form
                    onSubmit={(e) =>
                      handleSubmit(e, schoolInfo, "add-schoolInfo")
                    }
                    className="space-y-6"
                  >
                    <div className="text-center">
                      <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        Add School Information
                      </h2>
                      <p className="text-gray-500">Fill in the details below</p>
                    </div>

                    <div className="grid gap-6">
                      {/* School Name */}
                      <div>
                        <label
                          htmlFor="school-name"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          School Name *
                        </label>
                        <input
                          id="school-name"
                          type="text"
                          name="name"
                          placeholder="Enter school name"
                          value={schoolInfo.name}
                          onChange={(e) => handleInputChange(e, setSchoolInfo)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                          required
                        />
                      </div>

                      {/* Address */}
                      <div>
                        <label
                          htmlFor="address"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Address
                        </label>
                        <input
                          id="address"
                          type="text"
                          name="address"
                          placeholder="Enter school address"
                          value={schoolInfo.address}
                          onChange={(e) => handleInputChange(e, setSchoolInfo)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Email
                        </label>
                        <input
                          id="email"
                          type="email"
                          name="email"
                          placeholder="Enter school email"
                          value={schoolInfo.email}
                          onChange={(e) => handleInputChange(e, setSchoolInfo)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        />
                      </div>

                      {/* Contact */}
                      <div>
                        <label
                          htmlFor="contact"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Contact Number
                        </label>
                        <input
                          id="contact"
                          type="tel"
                          name="contact"
                          placeholder="Enter contact number"
                          value={schoolInfo.contact}
                          onChange={(e) => handleInputChange(e, setSchoolInfo)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        />
                      </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={handleClose}
                        className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className={`px-5 py-2.5 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ${
                          loading
                            ? "bg-blue-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                      >
                        {loading ? (
                          <span className="flex items-center justify-center">
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Saving...
                          </span>
                        ) : (
                          "Save Changes"
                        )}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}

            {/* Form for Current Section  subject section*/}
            {formVisibility === "Subjects" && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                {/* import notification component */}
                {notification && <Notification notification={notification} />}
                <motion.div
                  className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl overflow-y-auto max-h-[90vh]"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={modalVariants}
                  transition={{ duration: 0.3 }}
                >
                  <form
                    className="space-y-4 mt-4"
                    onSubmit={(e) => handleSubmit(e, subjects, "add-subject")}
                  >
                    <h2 className="text-2xl font-bold text-blue-600 mb-6">
                      Add Subject
                    </h2>
                    <input
                      type="text"
                      name="name"
                      placeholder="Subject Name"
                      value={subjects.name}
                      onChange={(e) => handleInputChange(e, setSubjects)}
                      className="w-full px-4 py-2 border rounded-md"
                      required
                    />
                    <input
                      type="text"
                      name="shortName"
                      placeholder="Short Name"
                      value={subjects.shortName}
                      onChange={(e) => handleInputChange(e, setSubjects)}
                      className="w-full px-4 py-2 border rounded-md"
                    />
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
                        className={`px-4 py-2 rounded-md text-white font-medium ${
                          loading
                            ? "bg-gray-400"
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                        disabled={loading}
                      >
                        {loading ? (
                          <div className="flex items-center gap-2">
                            <div className="border-4 border-t-4 border-white rounded-full w-5 h-5 animate-spin"></div>
                            Processing...
                          </div>
                        ) : (
                          "Save"
                        )}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}

            {/* Form for Current Section  class section*/}
            {formVisibility === "Class" && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                {/* import notification component */}
                {notification && <Notification notification={notification} />}
                <motion.div
                  className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl overflow-y-auto max-h-[90vh]"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={modalVariants}
                  transition={{ duration: 0.3 }}
                >
                  <form
                    className="space-y-6 mt-6"
                    onSubmit={(e) => handleSubmit(e, Class, "add-class")}
                  >
                    <div>
                      <label className="block text-lg font-medium text-gray-700">
                        Class Name:
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={Class.name}
                        onChange={(e) => handleInputChange(e, setClass)}
                        placeholder="Enter class name"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-lg font-medium text-gray-700">
                        Description:
                      </label>
                      <textarea
                        name="description"
                        value={Class.description}
                        onChange={(e) => handleInputChange(e, setClass)}
                        placeholder="Enter class description"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                      />
                    </div>
                    <div className="relative">
                      <div
                        onClick={() => setDropdownOpen((prev) => !prev)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-white cursor-pointer"
                      >
                        {Class.subjects.length > 0
                          ? `Selected: ${Class.subjects.join(", ")}`
                          : "Click to select subjects"}
                      </div>

                      {dropdownOpen && (
                        <div className="absolute w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto z-10 -top-60">
                          {subjectNames.map((subject, index) => (
                            <label
                              key={index}
                              className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100"
                            >
                              <input
                                type="checkbox"
                                checked={Class.subjects.includes(subject)}
                                onChange={() => toggleSubject(subject)}
                                className="mr-2"
                                required
                              />
                              {subject}
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                    {Class.subjects.length > 0 && (
                      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-lg font-medium text-blue-700">
                          Subjects Selected:
                        </p>
                        <ul className="mt-2 space-y-1">
                          {Class.subjects.map((subject, index) => (
                            <li
                              key={index}
                              className="flex justify-between items-center text-sm text-blue-900"
                            >
                              <span>{subject}</span>
                              <button
                                type="button"
                                onClick={() => removeSubject(subject)}
                                className="text-red-600 hover:text-red-800"
                              >
                                ✖
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* code input */}
                    <div>
                      <label className="block text-lg font-medium text-gray-700">
                        Class Code:
                      </label>
                      <input
                        type="text"
                        name="code"
                        value={Class.code}
                        onChange={(e) => handleInputChange(e, setClass)}
                        placeholder="Enter class code"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                      />
                    </div>

                    <div className="flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => handleClose(activeSection)}
                        className="px-4 py-2 bg-gray-500 text-white rounded-md shadow hover:bg-gray-600 transition"
                      >
                        Close
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}

            {/* Form for Current Section  teachers section*/}
            {formVisibility === "Teachers" && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                {/* import notification component */}
                {notification && <Notification notification={notification} />}
                <motion.div
                  className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl overflow-y-auto max-h-[90vh]"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={modalVariants}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-bold text-blue-600 mb-4">
                    Add Teacher
                  </h2>
                  <form
                    className="space-y-6"
                    onSubmit={(e) => handleSubmit(e, teachers, "add-teachers")}
                  >
                    <div>
                      <label className="block text-lg font-medium text-gray-700">
                        Teacher Name:
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={teachers.name}
                        onChange={(e) => handleInputChange(e, setTeachers)}
                        placeholder="Enter Teacher's Name"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                      />
                    </div>

                    {/* Subjects Dropdown */}
                    <div className="relative">
                      <label className="block text-lg font-medium text-gray-700 mb-1">
                        Subjects
                      </label>
                      <div
                        onClick={() => setDropdownOpen((prev) => !prev)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-white cursor-pointer"
                      >
                        {teachers.subjects.length > 0
                          ? `Selected: ${teachers.subjects.join(", ")}`
                          : "Click to select subjects"}
                      </div>

                      {dropdownOpen && (
                        <div className="absolute w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto z-10 mt-1">
                          {allSubjects.map((subject, index) => (
                            <label
                              key={index}
                              className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100"
                            >
                              <input
                                type="checkbox"
                                checked={teachers.subjects.includes(subject)}
                                onChange={() => toggleTeacherSubjects(subject)}
                                className="mr-2"
                                required
                              />
                              {subject}
                            </label>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Class Dropdown */}
                    <div className="relative">
                      <label className="block text-lg font-medium text-gray-700 mb-1">
                        Class
                      </label>
                      <div
                        onClick={() => setClassDropDown((prev) => !prev)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-white cursor-pointer"
                      >
                        {teachers.classNames.length > 0
                          ? `Selected: ${teachers.classNames.join(", ")}`
                          : "Click to select class"}
                      </div>

                      {classDropDown && (
                        <div className="absolute w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto z-10 mt-1">
                          {allClasses.map((Class, index) => (
                            <label
                              key={index}
                              className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100"
                            >
                              <input
                                type="checkbox"
                                checked={teachers.classNames.includes(Class)}
                                onChange={() => toggleTeacherClass(Class)}
                                className="mr-2"
                              />
                              {Class}
                            </label>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Contact Field */}
                    <div>
                      <label className="block text-lg font-medium text-gray-700">
                        Contact:
                      </label>
                      <input
                        name="contact"
                        value={teachers.contact}
                        onChange={(e) => handleInputChange(e, setTeachers)}
                        placeholder="Enter Contact"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => handleClose(activeSection)}
                        className="px-4 py-2 bg-gray-500 text-white rounded-md shadow hover:bg-gray-600 transition"
                      >
                        Close
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}

            {/* Table */}
            {/* school info table*/}
            {activeSection === "School Info" && (
              <table className="min-w-full bg-gray-100 rounded-lg shadow-md">
                {/* Table Head */}
                <thead className="bg-blue-600 text-white">
                  <tr>
                    {tabs[activeTab][activeSection]?.map((header) => (
                      <th key={header} className="py-3 px-6 text-left">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                {/* Table Body */}
                <tbody>
                  {tableData.length > 0 ? (
                    tableData.map((item, index) => (
                      <tr key={index} className="border-b hover:bg-gray-100">
                        <td className="py-3 px-6 text-left">
                          {item.name || "N/A"}
                        </td>
                        <td className="py-3 px-6 text-left">
                          {item.address || "N/A"}
                        </td>
                        <td className="py-3 px-6 text-left">
                          {item.email || "N/A"}
                        </td>
                        <td className="py-3 px-6 text-left">
                          {item.contact || "N/A"}
                        </td>
                        <td className="py-3 px-6 text-left flex gap-4">
                          {/* Edit Icon */}
                          <AiFillEdit
                            className="text-blue-500 cursor-pointer hover:text-blue-700"
                            onClick={() => handleEdit(item, activeSection)}
                          />

                          {/* Delete Icon */}
                          <AiFillDelete
                            className="text-red-500 cursor-pointer hover:text-red-700"
                            onClick={() => handleDelete(item._id)}
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="3"
                        className="py-3 px-6 text-center text-gray-500"
                      >
                        No data found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}

            {/* subject table */}
            {activeSection === "Subjects" && (
              <table className="min-w-full bg-gray-100 rounded-lg shadow-md">
                {/* Table Head */}
                <thead className="bg-blue-600 text-white">
                  <tr>
                    {tabs[activeTab][activeSection]?.map((header) => (
                      <th key={header} className="py-3 px-6 text-left">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                {/* Table Body */}
                <tbody>
                  {tableData.length > 0 ? (
                    tableData.map((item, index) => (
                      <tr key={index} className="border-b hover:bg-gray-100">
                        <td className="py-3 px-6 text-left">
                          {item.name || "N/A"}
                        </td>
                        <td className="py-3 px-6 text-left">
                          {item.shortName || "N/A"}
                        </td>
                        <td className="py-3 px-6 text-left flex gap-4">
                          {/* Edit Icon */}
                          <AiFillEdit
                            className="text-blue-500 cursor-pointer hover:text-blue-700"
                            onClick={() => handleEdit(item, activeSection)}
                          />

                          {/* Delete Icon */}
                          <AiFillDelete
                            className="text-red-500 cursor-pointer hover:text-red-700"
                            onClick={() => handleDelete(item._id)}
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="3"
                        className="py-3 px-6 text-center text-gray-500"
                      >
                        No data found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}

            {/* class table*/}
            {activeSection === "Class" && (
              <table className="min-w-full bg-gray-100 rounded-lg shadow-md">
                {/* Table Head */}
                <thead className="bg-blue-600 text-white">
                  <tr>
                    {tabs[activeTab][activeSection]?.map((header) => (
                      <th key={header} className="py-3 px-6 text-left">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                {/* Table Body */}
                <tbody>
                  {tableData.length > 0 ? (
                    tableData.map((item, index) => (
                      <tr key={index} className="border-b hover:bg-gray-100">
                        <td className="py-3 px-6 text-left">
                          {item.name || "N/A"}
                        </td>
                        <td className="py-3 px-6 text-left">
                          {item.description || "N/A"}
                        </td>
                        <td className="py-3 px-6 text-left">
                          {item.code || "N/A"}
                        </td>
                        <td className="py-3 px-6 text-left flex gap-4">
                          {/* Edit Icon */}
                          <AiFillEdit
                            className="text-blue-500 cursor-pointer hover:text-blue-700"
                            onClick={() => handleEdit(item, activeSection)}
                          />

                          {/* Delete Icon */}
                          <AiFillDelete
                            className="text-red-500 cursor-pointer hover:text-red-700"
                            onClick={() => handleDelete(item._id)}
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="3"
                        className="py-3 px-6 text-center text-gray-500"
                      >
                        No data found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}

            {/* teachers table*/}
            {activeSection === "Teachers" && (
              <table className="min-w-full bg-gray-100 rounded-lg shadow-md">
                {/* Table Head */}
                <thead className="bg-blue-600 text-white">
                  <tr>
                    {tabs[activeTab][activeSection]?.map((header) => (
                      <th key={header} className="py-3 px-6 text-left">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                {/* Table Body */}
                <tbody>
                  {teacherData.length > 0 ? (
                    teacherData.map((item, index) => (
                      <tr key={index} className="border-b hover:bg-gray-100">
                        <td className="py-3 px-6 text-left">
                          {item.name || "N/A"}
                        </td>

                        <td className="py-3 px-6 text-left">
                          {item.subjects?.length > 0 ? (
                            <div className="flex flex-col">
                              {item.subjects.map((subject, idx) => (
                                <span key={idx}>{subject}</span>
                              ))}
                            </div>
                          ) : (
                            "N/A"
                          )}
                        </td>
                        <td className="py-3 px-6 text-left">
                          {item.class?.length > 0 ? (
                            <div className="flex flex-col">
                              {item.class.map((cls, idx) => (
                                <span key={idx}>{cls}</span>
                              ))}
                            </div>
                          ) : (
                            "N/A"
                          )}
                        </td>
                        <td className="py-3 px-6 text-left">
                          {item.contact || "N/A"}
                        </td>
                        <td className="py-3 px-6 text-left flex gap-4">
                          {/* Edit Icon */}
                          <AiFillEdit
                            className="text-blue-500 cursor-pointer hover:text-blue-700"
                            onClick={() => handleEdit(item, activeSection)}
                          />
                          {/* Delete Icon */}
                          <AiFillDelete
                            className="text-red-500 cursor-pointer hover:text-red-700"
                            onClick={() => handleDelete(item.id)}
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="py-3 px-6 text-center text-gray-500"
                      >
                        No data found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}

            {/* making an update for sections */}
            {/* subject edit forms */}

            {updateForm === "Subjects" && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                {/* import notification component */}
                {notification && <Notification notification={notification} />}
                <motion.div
                  className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl overflow-y-auto max-h-[90vh]"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={modalVariants}
                  transition={{ duration: 0.3 }}
                >
                  <form
                    className="space-y-4 mt-4"
                    onSubmit={(e) =>
                      handleUpdate(e, subjects, "update-subject")
                    }
                  >
                    <h2 className="text-2xl font-bold text-blue-600 mb-6">
                      Update Subject
                    </h2>
                    <input
                      type="text"
                      name="name"
                      placeholder="Subject Name"
                      value={subjects.name}
                      onChange={(e) => handleInputChange(e, setSubjects)}
                      className="w-full px-4 py-2 border rounded-md"
                    />
                    <input
                      type="text"
                      name="shortName"
                      placeholder="Short Name"
                      value={subjects.shortName}
                      onChange={(e) => handleInputChange(e, setSubjects)}
                      className="w-full px-4 py-2 border rounded-md"
                    />
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

            {/* class edit forms */}
            {updateForm === "Class" && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                {/* import notification component */}
                {notification && <Notification notification={notification} />}
                <motion.div
                  className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl overflow-y-auto max-h-[90vh]"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={modalVariants}
                  transition={{ duration: 0.3 }}
                >
                  <form
                    className="space-y-6 mt-6"
                    onSubmit={(e) => handleUpdate(e, Class, "update-class")}
                  >
                    <div>
                      <label className="block text-lg font-medium text-gray-700">
                        Class Name:
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={Class.name}
                        onChange={(e) => handleInputChange(e, setClass)}
                        placeholder="Enter Class name"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-lg font-medium text-gray-700">
                        Description:
                      </label>
                      <textarea
                        name="description"
                        value={Class.description}
                        onChange={(e) => handleInputChange(e, setClass)}
                        placeholder="Enter class description"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                      />
                    </div>
                    <div className="relative">
                      <div
                        onClick={() => setDropdownOpen((prev) => !prev)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-white cursor-pointer"
                      >
                        {Class.subjects.length > 0
                          ? `Selected: ${Class.subjects.join(", ")}`
                          : "Click to select subjects"}
                      </div>

                      {dropdownOpen && (
                        <div className="absolute w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto z-10 -top-60">
                          {subjectNames.map((subject, index) => (
                            <label
                              key={index}
                              className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100"
                            >
                              <input
                                type="checkbox"
                                checked={Class.subjects.includes(subject)}
                                onChange={() => toggleSubject(subject)}
                                className="mr-2"
                              />
                              {subject}
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                    {Class.subjects.length > 0 && (
                      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-lg font-medium text-blue-700">
                          Subjects Selected:
                        </p>
                        <ul className="mt-2 space-y-1">
                          {Class.subjects.map((subject, index) => (
                            <li
                              key={index}
                              className="flex justify-between items-center text-sm text-blue-900"
                            >
                              <span>{subject}</span>
                              <button
                                type="button"
                                onClick={() => removeSubject(subject)}
                                className="text-red-600 hover:text-red-800"
                              >
                                ✖
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* code box */}
                    <div>
                      <label className="block text-lg font-medium text-gray-700">
                        Class Code:
                      </label>
                      <input
                        type="text"
                        name="code"
                        value={Class.code}
                        onChange={(e) => handleInputChange(e, setClass)}
                        placeholder="Enter Class code"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => handleClose(activeSection)}
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

            {/* teacher edit forms */}
            {updateForm === "Teachers" && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                {/* import notification component */}
                {notification && <Notification notification={notification} />}
                <motion.div
                  className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl overflow-y-auto max-h-[90vh]"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={modalVariants}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-bold text-blue-600 mb-4">
                    Update Teacher
                  </h2>
                  <form
                    className="space-y-6"
                    onSubmit={(e) =>
                      handleUpdate(e, teachers, "update-teachers")
                    }
                  >
                    <div>
                      <label className="block text-lg font-medium text-gray-700">
                        Teacher Name:
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={teachers.name}
                        onChange={(e) => handleInputChange(e, setTeachers)}
                        placeholder="Enter Teacher's Name"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                      />
                    </div>

                    {/* Subjects Dropdown */}
                    <div className="relative">
                      <label className="block text-lg font-medium text-gray-700 mb-1">
                        Subjects
                      </label>
                      <div
                        onClick={() => setDropdownOpen((prev) => !prev)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-white cursor-pointer"
                      >
                        {teachers.subjects.length > 0
                          ? `Selected: ${teachers.subjects.join(", ")}`
                          : "Click to select subjects"}
                      </div>

                      {dropdownOpen && (
                        <div className="absolute w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto z-10 mt-1">
                          {allSubjects.map((subject, index) => (
                            <label
                              key={index}
                              className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100"
                            >
                              <input
                                type="checkbox"
                                checked={teachers.subjects.includes(subject)}
                                onChange={() => toggleTeacherSubjects(subject)}
                                className="mr-2"
                              />
                              {subject}
                            </label>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Class Dropdown */}
                    <div className="relative">
                      <label className="block text-lg font-medium text-gray-700 mb-1">
                        Class
                      </label>
                      <div
                        onClick={() => setClassDropDown((prev) => !prev)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-white cursor-pointer"
                      >
                        {teachers.classNames.length > 0
                          ? `Selected: ${teachers.classNames.join(", ")}`
                          : "Click to select class"}
                      </div>

                      {classDropDown && (
                        <div className="absolute w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto z-10 mt-1">
                          {allClasses.map((Class, index) => (
                            <label
                              key={index}
                              className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100"
                            >
                              <input
                                type="checkbox"
                                checked={teachers.classNames.includes(Class)}
                                onChange={() => toggleTeacherClass(Class)}
                                className="mr-2"
                              />
                              {Class}
                            </label>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Contact Field */}
                    <div>
                      <label className="block text-lg font-medium text-gray-700">
                        Contact:
                      </label>
                      <input
                        name="contact"
                        value={teachers.contact}
                        onChange={(e) => handleInputChange(e, setTeachers)}
                        placeholder="Enter Contact"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => handleClose(activeSection)}
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

            {/***** financials tabs ****/}
            {/* bill forms */}

            {formVisibility === "Bills" && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                {/* import notification component */}
                {notification && <Notification notification={notification} />}
                <motion.div
                  className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl overflow-y-auto max-h-[90vh]"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={modalVariants}
                  transition={{ duration: 0.3 }}
                >
                  <form
                    className="space-y-4 mt-4"
                    onSubmit={(e) => handleSubmit(e, bill, "add-bills")}
                  >
                    <h2 className="text-2xl font-bold text-blue-600 mb-6">
                      Add Bill
                    </h2>
                    <input
                      type="text"
                      name="name"
                      placeholder="Bill Name"
                      value={bill.name}
                      onChange={(e) => handleInputChange(e, setBill)}
                      className="w-full px-4 py-2 border rounded-md"
                    />
                    <input
                      type="number"
                      name="amount"
                      placeholder="Amount"
                      value={bill.amount}
                      onChange={(e) => handleInputChange(e, setBill)}
                      className="w-full px-4 py-2 border rounded-md"
                    />
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
                        Save
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}

            {/* fee structure forms */}
            {formVisibility === "Fee Structure" && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                {/* import notification component */}
                {notification && <Notification notification={notification} />}
                <motion.div
                  className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl overflow-y-auto max-h-[90vh]"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={modalVariants}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-bold text-blue-600 mb-4">
                    Add Fee Structure
                  </h2>
                  <form
                    className="space-y-6"
                    onSubmit={(e) =>
                      handleSubmit(e, feeStructure, "add-feeStructure")
                    }
                  >
                    {/* Class Dropdown */}
                    <div className="relative">
                      <label className="block text-lg font-medium text-gray-700 mb-1">
                        Class
                      </label>
                      <div
                        onClick={() => setClassDropDown((prev) => !prev)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-white cursor-pointer"
                      >
                        {feeStructure.className.length > 0
                          ? `Selected: ${feeStructure.className.join(", ")}`
                          : "Click to Select class"}
                      </div>

                      {classDropDown && (
                        <div className="absolute w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto z-10 mt-1">
                          {allClasses.map((Class, index) => (
                            <label
                              key={index}
                              className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100"
                            >
                              <input
                                type="checkbox"
                                checked={feeStructure.className.includes(Class)}
                                onChange={() => toggleFeeStructureClass(Class)}
                                className="mr-2"
                              />
                              {Class}
                            </label>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* bills Dropdown */}
                    <div className="relative">
                      <label className="block text-lg font-medium text-gray-700 mb-1">
                        Bills
                      </label>
                      <div
                        onClick={() => setDropdownOpen((prev) => !prev)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-white cursor-pointer"
                      >
                        {feeStructure.bills.length > 0
                          ? `Selected: ${feeStructure.bills.join(", ")}`
                          : "Click to select bills"}
                      </div>

                      {dropdownOpen && (
                        <div className="absolute w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto z-10 mt-1">
                          {allBills.map((bill, index) => (
                            <label
                              key={index}
                              className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100"
                            >
                              <input
                                type="checkbox"
                                checked={feeStructure.bills.includes(bill)}
                                onChange={() => toggleFeeStructureBill(bill)}
                                className="mr-2"
                                required
                              />
                              {bill}
                            </label>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => handleClose(activeSection)}
                        className="px-4 py-2 bg-gray-500 text-white rounded-md shadow hover:bg-gray-600 transition"
                      >
                        Close
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}

            {/* edit /updating forms */}
            {/*bill forms */}
            {updateForm === "Bills" && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                {/* import notification component */}
                {notification && <Notification notification={notification} />}
                <motion.div
                  className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl overflow-y-auto max-h-[90vh]"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={modalVariants}
                  transition={{ duration: 0.3 }}
                >
                  <form
                    className="space-y-4 mt-4"
                    onSubmit={(e) => handleUpdate(e, bill, "update-bills")}
                  >
                    <h2 className="text-2xl font-bold text-blue-600 mb-6">
                      Update Bill
                    </h2>
                    <input
                      type="text"
                      name="name"
                      placeholder="Bill Name"
                      value={bill.name}
                      onChange={(e) => handleInputChange(e, setBill)}
                      className="w-full px-4 py-2 border rounded-md"
                    />
                    <input
                      type="number"
                      name="amount"
                      placeholder="Amount"
                      value={bill.amount}
                      onChange={(e) => handleInputChange(e, setBill)}
                      className="w-full px-4 py-2 border rounded-md"
                    />
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

            {/* fee struture */}
            {updateForm === "Fee Structure" && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                {/* import notification component */}
                {notification && <Notification notification={notification} />}
                <motion.div
                  className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl overflow-y-auto max-h-[90vh]"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={modalVariants}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-bold text-blue-600 mb-4">
                    Update Fee Structure
                  </h2>
                  <form
                    className="space-y-6"
                    onSubmit={(e) =>
                      handleUpdate(e, feeStructure, "update-feeStructure")
                    }
                  >
                    {/* Class Dropdown */}
                    <div className="relative">
                      <label className="block text-lg font-medium text-gray-700 mb-1">
                        Class
                      </label>
                      <div
                        onClick={() => setClassDropDown((prev) => !prev)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-white cursor-pointer"
                      >
                        {feeStructure.className.length > 0
                          ? `Selected: ${feeStructure.className.join(", ")}`
                          : "Click to Select class"}
                      </div>

                      {classDropDown && (
                        <div className="absolute w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto z-10 mt-1">
                          {allClasses.map((Class, index) => (
                            <label
                              key={index}
                              className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100"
                            >
                              <input
                                type="checkbox"
                                checked={feeStructure.className.includes(Class)}
                                onChange={() => toggleFeeStructureClass(Class)}
                                className="mr-2"
                              />
                              {Class}
                            </label>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* bills Dropdown */}
                    <div className="relative">
                      <label className="block text-lg font-medium text-gray-700 mb-1">
                        Bills
                      </label>
                      <div
                        onClick={() => setDropdownOpen((prev) => !prev)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-white cursor-pointer"
                      >
                        {feeStructure.bills.length > 0
                          ? `Selected: ${feeStructure.bills.join(", ")}`
                          : "Click to select bills"}
                      </div>

                      {dropdownOpen && (
                        <div className="absolute w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto z-10 mt-1">
                          {allBills.map((bill, index) => (
                            <label
                              key={index}
                              className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100"
                            >
                              <input
                                type="checkbox"
                                checked={feeStructure.bills.includes(bill)}
                                onChange={() => toggleFeeStructureBill(bill)}
                                className="mr-2"
                                required
                              />
                              {bill}
                            </label>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* total amount Field */}
                    <div>
                      <label className="block text-lg font-medium text-gray-700">
                        Total Amount:
                      </label>
                      <input
                        name="totalAmount"
                        value={feeStructure.totalAmount}
                        onChange={(e) => handleInputChange(e, setFeeStructure)}
                        placeholder="Enter Total Amount"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => handleClose(activeSection)}
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

            {/* Bills table */}
            {activeSection === "Bills" && (
              <table className="min-w-full bg-gray-100 rounded-lg shadow-md">
                {/* Table Head */}
                <thead className="bg-blue-600 text-white">
                  <tr>
                    {tabs[activeTab][activeSection]?.map((header) => (
                      <th key={header} className="py-3 px-6 text-left">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                {/* Table Body */}
                <tbody>
                  {tableData.length > 0 ? (
                    tableData.map((item, index) => (
                      <tr key={index} className="border-b hover:bg-gray-100">
                        <td className="py-3 px-6 text-left">
                          {item.name || "N/A"}
                        </td>
                        <td className="py-3 px-6 text-left">
                          {item.amount || "N/A"}
                        </td>
                        <td className="py-3 px-6 text-left flex gap-4">
                          {/* Edit Icon */}
                          <AiFillEdit
                            className="text-blue-500 cursor-pointer hover:text-blue-700"
                            onClick={() => handleEdit(item, activeSection)}
                          />

                          {/* Delete Icon */}
                          <AiFillDelete
                            className="text-red-500 cursor-pointer hover:text-red-700"
                            onClick={() => handleDelete(item._id)}
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="3"
                        className="py-3 px-6 text-center text-gray-500"
                      >
                        No data found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}

            {/* fee structure table */}
            {activeSection === "Fee Structure" && (
              <table className="min-w-full bg-gray-100 rounded-lg shadow-md">
                {/* Table Head */}
                <thead className="bg-blue-600 text-white">
                  <tr>
                    {tabs[activeTab][activeSection]?.map((header) => (
                      <th key={header} className="py-3 px-6 text-left">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                {/* Table Body */}
                <tbody>
                  {feeStructureData.length > 0 ? (
                    feeStructureData.map((item, index) => (
                      <tr key={index} className="border-b hover:bg-gray-100">
                        <td className="py-3 px-6 text-left">
                          {item.className || "N/A"}
                        </td>

                        <td className="py-3 px-6 text-left">
                          {item.bills?.length > 0 ? (
                            <div className="flex flex-col">
                              {item.bills.map((bill, idx) => (
                                <span key={idx}>{bill}</span>
                              ))}
                            </div>
                          ) : (
                            "N/A"
                          )}
                        </td>

                        <td className="py-3 px-6 text-left">
                          {item.totalAmount || 0}
                        </td>
                        <td className="py-3 px-6 text-left flex gap-4">
                          {/* Edit Icon */}
                          <AiFillEdit
                            className="text-blue-500 cursor-pointer hover:text-blue-700"
                            onClick={() => handleEdit(item, activeSection)}
                          />
                          {/* Delete Icon */}
                          <AiFillDelete
                            className="text-red-500 cursor-pointer hover:text-red-700"
                            onClick={() => handleDelete(item.id)}
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="py-3 px-6 text-center text-gray-500"
                      >
                        No data found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
