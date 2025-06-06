import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiBook,
  FiClipboard,
  FiCalendar,
  FiSettings,
  FiMenu,
  FiX,
  FiDribbble,
  FiBriefcase,
} from "react-icons/fi";
import { FaSchool } from "react-icons/fa";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/admin-dashboard", icon: <FiHome size={20} /> },
    { name: "Students", path: "/students", icon: <FiUsers size={20} /> },
    {
      name: "Assessment",
      path: "/class-assess",
      icon: <FiClipboard size={18} />,
    },
    { name: "Fees", path: "/fees", icon: <FiBook size={20} /> },

    {
      name: "Academic Terms",
      path: "/academics",
      icon: <FiCalendar size={20} />,
    },
    { name: "Expenses", path: "/expenses", icon: <FiBriefcase size={20} /> },
    { name: "Settings", path: "/settings", icon: <FiSettings size={20} /> },
  ];

  // Close sidebar when clicking outside on mobile
  const handleOverlayClick = () => setIsOpen(false);

  return (
    <>
      {/* Desktop Sidebar (lg and up) */}
      <div className="hidden lg:flex flex-col w-64 h-screen bg-blue-700 text-white fixed left-0 top-0 z-30 border-r border-blue-800">
        {/* Brand Header */}
        <div className="flex items-center p-6 border-b border-blue-800">
          <FaSchool className="text-2xl mr-3 text-blue-200" />
          <h1 className="text-xl font-bold tracking-tight">SchoolPortal</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => `
                flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all
                ${
                  isActive
                    ? "bg-white text-blue-700 shadow-md"
                    : "text-blue-100 hover:bg-blue-600 hover:text-white"
                }
              `}
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
              {location.pathname === item.path && (
                <span className="ml-auto w-2 h-2 bg-blue-500 rounded-full"></span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 text-xs text-blue-200 border-t border-blue-800">
          © {new Date().getFullYear()} SchoolPortal
        </div>
      </div>

      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-20 p-2 rounded-md bg-blue-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <FiMenu size={24} />
      </button>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 bg-blue-700 text-white w-64 shadow-xl transform transition-all duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-6 border-b border-blue-800">
          <div className="flex items-center">
            <FaSchool className="text-2xl mr-3 text-blue-200" />
            <h1 className="text-xl font-bold">SchoolPortal</h1>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-md hover:bg-blue-600 focus:outline-none"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => `
                flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all
                ${
                  isActive
                    ? "bg-white text-blue-700 shadow-md"
                    : "text-blue-100 hover:bg-blue-600 hover:text-white"
                }
              `}
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
              {location.pathname === item.path && (
                <span className="ml-auto w-2 h-2 bg-blue-500 rounded-full"></span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={handleOverlayClick}
          className="fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-300 lg:hidden"
        />
      )}
    </>
  );
};

export default Sidebar;
