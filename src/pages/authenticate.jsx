import axios from "axios";
import { useState } from "react";
import {
  FiCheckCircle,
  FiAlertCircle,
  FiGoogle,
  FiGithub,
  FiUser,
  FiLock,
  FiUserPlus
} from "react-icons/fi";
import { Navigate, useNavigate } from "react-router-dom";

export default function Authentication() {
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState();
  const [userError, setUserError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const Navigate = useNavigate();

  //api
  const handleSigUP = (e) => {
    e.preventDefault();
    setPasswordError();
    setUserError();
    axios
      .post("http://localhost:3001/school/user-signup", {
        username,
        password,
      })
      .then((res) => {
        console.log(res.data);
        if (
          res.data.username === "teacher" &&
          res.data.password === "teacher123"
        ) {
          Navigate("/class-assess");
        } else if (
          res.data.username === "admin" &&
          res.data.password === "admin123"
        ) {
          Navigate("/admin-dashboard");
        }
      })
      .catch((err) => {
        setUserError(err.response?.data?.error?.username);
        setPasswordError(err.response?.data?.error?.password);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex flex-col md:flex-row items-center justify-center p-4 gap-8 md:gap-16">
      {/* Brand Section - Left Side */}
      <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-md">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">
            Love TechS
          </h1>
          <h4 className="text-xl text-gray-700">School Management System</h4>
        </div>

        <div className="hidden md:block space-y-4">
          <div className="flex items-center space-x-3">
            <FiCheckCircle className="text-green-500 text-xl" />
            <span className="text-gray-700">
              Streamlined school administration
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <FiCheckCircle className="text-green-500 text-xl" />
            <span className="text-gray-700">Real-time student tracking</span>
          </div>
          <div className="flex items-center space-x-3">
            <FiCheckCircle className="text-green-500 text-xl" />
            <span className="text-gray-700">Comprehensive reporting</span>
          </div>
        </div>
      </div>

      {/* Signup Form - Right Side */}
      <div className="w-full max-w-md">
        <form
          className="bg-white shadow-lg rounded-xl p-8 space-y-6 border border-gray-100"
          onSubmit={handleSigUP}
        >
          <div className="text-center">
            <FiUserPlus className="mx-auto text-blue-500 text-4xl mb-3" />
            <h1 className="text-2xl font-bold text-gray-800 mb-1">
              Create Your Account
            </h1>
            <p className="text-gray-500">
              Get started with your school management
            </p>
          </div>

          {/* Username Field */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Username <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className="text-gray-400" />
              </div>
              <input
                id="username"
                type="text"
                placeholder="e.g. john_doe"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`block w-full pl-10 pr-3 py-2.5 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  userError ? "border-red-300" : "border-gray-300"
                }`}
                autoComplete="username"
                required
              />
              {!userError && username && (
                <FiCheckCircle className="absolute right-3 top-3.5 text-green-500" />
              )}
            </div>
            {userError && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <FiAlertCircle className="mr-1" />
                {userError}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="text-gray-400" />
              </div>
              <input
                id="password"
                type="password"
                placeholder="Minimum 6 characters"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`block w-full pl-10 pr-3 py-2.5 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  passwordError ? "border-red-300" : "border-gray-300"
                }`}
                autoComplete="new-password"
                minLength="6"
                required
              />
              {!passwordError && password && (
                <FiCheckCircle className="absolute right-3 top-3.5 text-green-500" />
              )}
            </div>
            {passwordError ? (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <FiAlertCircle className="mr-1" />
                {passwordError}
              </p>
            ) : (
              <p className="mt-1 text-xs text-gray-500">
                Use 6+ characters with mix of letters, numbers & symbols
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!username || !password}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${
              !username || !password
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            }`}
          >
            Create Account
          </button>

          <div className="text-center text-sm text-gray-500 pt-2">
            Already have an account?{" "}
            <button
              type="button"
              // onClick={() => navigate("/login")}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
