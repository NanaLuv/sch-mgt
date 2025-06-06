import React, { useState } from "react";
import { NavLink } from "react-router-dom";

import { FiClipboard } from "react-icons/fi";

const SidebarOther = ({heading}) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    // { name: "Dashboard", path: "/", icon: <AiFillDashboard size={20} /> },
    // { name: "Students", path: "/students", icon: <FaUserGraduate size={20} /> },
    // { name: "Classes", path: "/classes", icon: <MdClass size={20} /> },
    // { name: "Settings", path: "/settings", icon: <FiSettings size={20} /> },
    {
      name: "Assessment",
      path: "/class-assess",
      icon: <FiClipboard size={20} />,
    },
  ];

  return (
    <>
      {/* SidebarOther for Medium and Larger Screens */}
      <div className="hidden lg:flex flex-col w-64 bg-blue-600 text-white h-screen shadow-lg fixed left-0 top-0 z-20">
        <div className="p-6 text-xl font-bold">{heading}</div>
        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded-md text-sm font-medium transition duration-300 ${
                  isActive
                    ? "bg-white text-blue-600"
                    : "hover:bg-blue-700 hover:text-white"
                }`
              }
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Hamburger Menu for Small Screens */}
      <div className="md:block sm:z-50 lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-4 text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:z-10 "
        >
          <svg
            className="h-6 w-6 z-10"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Drawer SidebarOther for Small Screens */}
      <div
        className={`fixed inset-y-0 left-0 z-50 bg-blue-600 text-white w-64 shadow-lg transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 text-xl font-bold">{heading}</div>
        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setIsOpen(false)} // Close drawer after navigation
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded-md text-sm font-medium transition duration-300 ${
                  isActive
                    ? "bg-white text-blue-600"
                    : "hover:bg-blue-700 hover:text-white"
                }`
              }
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Overlay for Mobile Drawer */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-300"
        ></div>
      )}
    </>
  );
};

export default SidebarOther;
