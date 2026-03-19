import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { setAuthUser } = useAuth();
  const [userInput, setUserInput] = useState();
  const [loading, setLoading] = useState(false);

  const handleInput = (e) => {
    setUserInput({
      ...userInput,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      if (!userInput.gender) {
        toast.error("Please select gender");
        return;
      }

      if (userInput.password !== userInput.confirmPassword) {
        setLoading(false)
        toast.error("Passwords do not match");
        return;
      }

      // remove confirmPassword before sending to backend
      const { confirmPassword, ...payload } = userInput;

      const { data } = await axios.post("api/auth/register", payload);

      //DIRECT LOGIN AFTER REGISTER
      localStorage.setItem("chatapp", JSON.stringify(data));
      setAuthUser(data) // share data to globle manually
      toast.success("Registered & logged in successfully");
      navigate("/");
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = `
    w-full px-3 py-2 rounded-lg text-sm
    text-gray-900 bg-white/60 backdrop-blur-md
    border border-orange-300/40
    shadow-[inset_0_1px_2px_rgba(0,0,0,0.12),0_1px_2px_rgba(255,255,255,0.2)]
    focus:outline-none focus:ring-2 focus:ring-orange-400/60
    focus:border-orange-400 transition
  `;

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      {/* Card */}
      <div
        className="
          w-full max-w-md
          rounded-xl
          px-4 py-5 sm:px-6 sm:py-6
          bg-orange-200/40 backdrop-blur-lg
          shadow-[0_20px_40px_rgba(249,115,22,0.3)]
          border border-orange-300/30
        "
      >
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            Welcome to Chat-Com
          </h1>
          <p className="text-xs sm:text-sm text-gray-600">
            Start chatting in seconds 💬
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs text-gray-700">Full Name</label>
            <input
              id="fullname"
              onChange={handleInput}
              type="text"
              placeholder="Full name"
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-xs text-gray-700">Username</label>
            <input
              id="username"
              onChange={handleInput}
              type="text"
              placeholder="Username"
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-xs text-gray-700">Email Address</label>
            <input
              id="email"
              onChange={handleInput}
              type="email"
              placeholder="Email address"
              className={inputClass}
            />
          </div>

          {/* Gender + Password */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="sm:w-1/3">
              <label className="text-xs text-gray-700">Gender</label>
              <select id="gender" onChange={handleInput} className={inputClass}>
                <option value="">Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div className="sm:w-2/3">
              <label className="text-xs text-gray-700">Password</label>
              <input
                id="password"
                onChange={handleInput}
                type="password"
                placeholder="Password"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-700">
              Confirm-Password
            </label>
            <input
              id="confirmPassword"
              onChange={handleInput}
              type="password"
              placeholder="Confirm-Password"
              className={inputClass}
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="
              w-full py-2 rounded-lg
              text-sm font-semibold text-white
              bg-gradient-to-r from-orange-500 to-orange-600
              hover:from-orange-600 hover:to-orange-700
              shadow-lg shadow-orange-500/40
              transition
            "
          >
            {loading ? "Loading..." : "Register"}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-3">
          <p className="text-xs text-gray-700">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-orange-600 font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
