import React, { useState } from "react";

const TopBar = ({ username, profilePic, text }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="fixed top-0 w-full ml-14  bg-white shadow-lg lg:left-64">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo or Branding */}
          <div className="text-xl font-bold ml-0 md:ml-20 lg:ml-0">
            <span className="text-2xl font-bold text-white mb-6">{text}</span>
          </div>

          {/* Profile Section */}
          <div className="relative mr-0 lg:mr-64">
            <div
              className="flex items-center space-x-4 cursor-pointer"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
            >
              <span className="hidden sm:block text-sm font-medium">
                {username}
              </span>
              <img
                src={profilePic}
                alt="Profile"
                className="h-8 w-8 rounded-full object-cover border border-white shadow-sm"
              />
            </div>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg overflow-hidden">
                <button
                  onClick={() => setIsDropdownOpen(false)}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  View Profile
                </button>
                <button
                  onClick={() => setIsDropdownOpen(false)}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Settings
                </button>
                <button
                  onClick={() => setIsDropdownOpen(false)}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;


