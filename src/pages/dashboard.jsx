import axios from "axios";
import { useEffect, useState } from "react";
import {
  FiLayout,
  FiUser,
  FiSettings,
  FiLogOut,
  FiCalendar,
  FiClock,
  FiRefreshCw,
  FiLoader,
  FiChevronDown,
} from "react-icons/fi";
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaSchool,
  FaMoneyBillWave,
} from "react-icons/fa";
import Sidebar from "../other-components/sidebar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StatCard from "../other-components/stat-card";
import { Navigate, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [profilePic, setProfilePic] = useState();
  const navigate = useNavigate();

  //resetting fees
  const [isActive, setIsActive] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const [prevDates, setPrevDates] = useState({
    start: null,
    end: null,
    term: null,
    year: null,
  });
  const [term, setTerm] = useState();
  const [year, setYear] = useState();
  const [endDate, setEndDate] = useState(null);
  const [startDate, setStartDate] = useState(null);

  //fetch term and year

  //get current term details
  useEffect(() => {
    const localStart = localStorage.getItem("startDate");
    const localEnd = localStorage.getItem("endDate");
    const localTerm = localStorage.getItem("term");
    const localYear = localStorage.getItem("year");

    axios
      .get("http://localhost:3001/school/term/current")
      .then((res) => {
        const apiStart = res.data.startDate;
        const apiEnd = res.data.endDate;
        const apiTerm = res.data.term;
        const apiYear = res.data.year;

        const hasChanged =
          apiStart !== localStart &&
          apiEnd !== localEnd &&
          apiTerm !== localTerm;

        setStartDate(apiStart);
        setEndDate(apiEnd);
        setTerm(apiTerm);
        setYear(apiYear);

        if (hasChanged) {
          setIsActive(true); // Enable switch if values changed
          setPrevDates({
            start: apiStart,
            end: apiEnd,
            term: apiTerm,
            year: apiYear,
          });

          // Save to localStorage
          localStorage.setItem("startDate", apiStart);
          localStorage.setItem("endDate", apiEnd);
          localStorage.setItem("term", apiTerm);
          localStorage.setItem("year", apiYear);
        } else {
          setIsActive(false);
          setPrevDates({
            start: localStart,
            end: localEnd,
            term: localTerm,
            year: localYear,
          });
        }
      })
      .catch((err) => {
        console.error("API error, trying localStorage fallback", err);
        if (localStart && localEnd && localTerm) {
          setStartDate(localStart);
          setEndDate(localEnd);
          setTerm(localTerm);
          setPrevDates({ start: localStart, end: localEnd, term: localTerm });
          setIsActive(true);
        }
      });
  }, []);

  //click to change between terms
  function handleSwitchTerm() {
    if (!isActive) return;
    setIsSwitching(true);
    axios
      .post("http://localhost:3001/school/student/newfees")
      .then((res) => {
        toast.success("Term Switched Successfully");
        setIsActive(false);
        setIsSwitching(false);
        console.log(res.data);
      })
      .catch((error) => {
        console.error("Failed to fetch reset fees:", error);
        toast.error("Failed to switch term");
      });
    console.log({ startDate, endDate, prevDates });
  }

  //api
  //fetch students
  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:3001/school/get-students")
      .then((response) => {
        setStudents(response.data);
        console.log(students);
        setLoading(false);
      })
      .catch((error) => {
        {
          console.error("students not found", error);
          setLoading(false);
        }
      });

    //get teachers
    axios
      .get("http://localhost:3001/school/teachers")
      .then((response) => {
        setTeachers(response.data);
        console.log(teachers);
        setLoading(false);
      })
      .catch((error) => {
        {
          console.error("teachers not found", error);
          setLoading(false);
        }
      });

    //get classes
    axios
      .get("http://localhost:3001/school/class")
      .then((response) => {
        setClasses(response.data);
        console.log(classes);
        setLoading(false);
      })
      .catch((error) => {
        {
          console.error("classes not found", error);
          setLoading(false);
        }
      });

    //get fees
    axios
      .get("http://localhost:3001/school/fees")
      .then((response) => {
        setFees(response.data);
        console.log(fees);
        setLoading(false);
      })
      .catch((error) => {
        {
          console.error("fees not found", error);
          setLoading(false);
        }
      });
  }, []);

  useEffect(() => {
    console.log("updated fees", fees);
  }, [fees]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-10 bg-white shadow-sm border-b border-gray-100">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center ml-16 lg:ml-64">
            <FiLayout className="text-blue-600 mr-2" />
            <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
          </div>

          {/* Profile Section */}
          <div className="relative">
            <div
              className="flex items-center space-x-2 cursor-pointer group"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span className="hidden sm:block text-sm font-medium text-gray-700 group-hover:text-gray-900">
                Nana Love
              </span>
              <div className="relative">
                <img
                  src={profilePic}
                  alt="Profile"
                  className="h-8 w-8 rounded-full object-cover border-2 border-white shadow-sm"
                />
                <div className="absolute bottom-0 right-0 h-2 w-2 bg-green-500 rounded-full border border-white"></div>
              </div>
              <FiChevronDown
                className={`text-gray-500 transition-transform duration-200 ${
                  isDropdownOpen ? "transform rotate-180" : ""
                }`}
              />
            </div>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 divide-y divide-gray-100">
                <div className="px-4 py-3">
                  <p className="text-sm font-medium text-gray-900">Nana Love</p>
                  <p className="text-xs text-gray-500 truncate">
                    admin@school.edu
                  </p>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setIsDropdownOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <FiUser className="mr-2" />
                    View Profile
                  </button>
                  <button
                    onClick={() => {
                      navigate("/settings");
                      setIsDropdownOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <FiSettings className="mr-2" />
                    Settings
                  </button>
                </div>
                <div className="py-1">
                  <button
                    // onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    <FiLogOut className="mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex pt-16">
        <Sidebar />

        <main className="flex-1 p-6 md:ml-64">
          {/* Current Term Info */}
          {prevDates && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-blue-800 mb-1">
                    CURRENT ACADEMIC TERM
                  </h3>
                  <div className="flex flex-wrap gap-x-6 gap-y-2">
                    <div className="flex items-center">
                      <FiCalendar className="text-blue-600 mr-2" />
                      <span className="font-medium">
                        Term {prevDates.term}, {prevDates.year}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <FiClock className="text-blue-600 mr-2" />
                      <span className="font-medium">
                        {new Date(prevDates.start).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}{" "}
                        -{" "}
                        {new Date(prevDates.end).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                {isActive && (
                  <button
                    onClick={handleSwitchTerm}
                    disabled={!isActive || isSwitching}
                    className={`flex items-center px-4 py-2 rounded-md font-medium transition-colors ${
                      isActive
                        ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    } ${isSwitching ? "opacity-75" : ""}`}
                  >
                    {isSwitching ? (
                      <>
                        <FiLoader className="animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <FiRefreshCw className="mr-2" />
                        Switch Term
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Stats Cards Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
            {/* Total Students */}
            <StatCard
              loading={loading}
              title="Total Students"
              value={students.length}
              icon={<FaUserGraduate className="text-blue-600" />}
              color="blue"
            />

            {/* Total Teachers */}
            <StatCard
              loading={loading}
              title="Total Teachers"
              value={teachers.length}
              icon={<FaChalkboardTeacher className="text-green-600" />}
              color="green"
            />

            {/* Total Classes */}
            <StatCard
              loading={loading}
              title="Total Classes"
              value={classes.length}
              icon={<FaSchool className="text-indigo-600" />}
              color="indigo"
            />

            {/* Fees Collected */}
            <StatCard
              loading={false}
              title="Fees Collected"
              value={`GH₵${fees.toLocaleString()}`}                                                                                                             
              icon={<FaMoneyBillWave className="text-purple-600" />}
              color="purple"
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
