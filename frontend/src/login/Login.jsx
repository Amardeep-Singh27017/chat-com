import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const {setAuthUser} = useAuth();  // share data to globle
  const [userInput, setUserInput] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInput = (e) => {
    setUserInput({
      ...userInput,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post("api/auth/login", userInput);
      toast.success(data.message);
      localStorage.setItem("chatapp", JSON.stringify(data));
      setAuthUser(data)  // share data to globle manually
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
        <div className="text-center mb-5">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            Welcome Back 👋
          </h1>
          <p className="text-xs sm:text-sm text-gray-600">
            Login to continue chatting 💬
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-gray-700">Email Address</label>
            <input
              id="email"
              type="email"
              onChange={handleInput}
              placeholder="Email address"
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className="text-xs text-gray-700">Password</label>
            <input
              id="password"
              type="password"
              onChange={handleInput}
              placeholder="Password"
              className={inputClass}
              required
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full py-2 rounded-lg
              text-sm font-semibold text-white
              bg-gradient-to-r from-orange-500 to-orange-600
              hover:from-orange-600 hover:to-orange-700
              shadow-lg shadow-orange-500/40
              transition
              disabled:opacity-70 disabled:cursor-not-allowed
            "
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-4">
          <p className="text-xs text-gray-700">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-orange-600 font-semibold hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
