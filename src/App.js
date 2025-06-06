import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Dashboard from "./pages/dashboard";
import Students from "./pages/students";
import Classes from "./pages/class-fees";
import Settings from "./pages/settings";
import Sidebar from "./other-components/sidebar";
import TopBar from "./topbar";
import FeeCollection from "./pages/fee-collection";
import { ToastContainer } from "react-toastify";
import ClassAssess from "./pages/class-assess";
import Assessment from "./pages/Assessment";
import ReportPage from "./pages/reportPage";
import Academics from "./pages/AcademicSessions";
import Authentication from "./pages/authenticate";
import Expenses from "./pages/expenses";

function App() {
  const AnimatedRoutes = () => {
    const location = useLocation();

    return (
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/admin-dashboard" element={<Dashboard />} />
          <Route path="/students" element={<Students />} />
          <Route path="/fees" element={<Classes />} />
          <Route path="/settings" element={<Settings />} />
          <Route
            path="/fees-collection/:className"
            element={<FeeCollection />}
          />
          <Route path="/class-assess/" element={<ClassAssess />} />
          <Route path="/assessment/:className" element={<Assessment />} />
          <Route
            path="/assessment/report/:className"
            element={<ReportPage />}
          />
          <Route path="/academics" element={<Academics />} />
          <Route path="/" element={<Authentication />} />
          <Route path="/expenses" element={<Expenses />} />
        </Routes>
      </AnimatePresence>
    );
  };

  return (
    <Router>
      <div className="flex">
        {/* <Sidebar /> */}
        <div className="flex-1">
          <AnimatedRoutes />
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </Router>
  );
}

export default App;
