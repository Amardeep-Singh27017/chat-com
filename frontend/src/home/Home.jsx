import React from "react";
import Sidebar from "./components/Sidebar";
import MessageContainer from "./components/MessageContainer";
import useUIStore from "../Zustand/openCloseSidebar";

const ChatHome = () => {

  const { showSidebar, closeSidebar } = useUIStore();

  return (
    <div className="w-full h-screen bg-gradient-to-br from-purple-200 via-pink-200 to-indigo-200 flex overflow-hidden">

      {/* 🔹 Overlay (mobile only) */}
      {showSidebar && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-black/30 sm:hidden z-40"
        />
      )}

      {/* 🔹 Sidebar */}
      <div
        className={`
          fixed sm:relative   /* ✅ FIXED HERE */
          top-0 left-0 h-full z-50
          
          w-3/4 sm:w-1/3 lg:w-1/4
          bg-white

          transition-transform duration-300

          ${showSidebar ? "translate-x-0" : "-translate-x-full"}
          sm:translate-x-0
        `}
      >
        <Sidebar />
      </div>

      {/* 🔹 Chat Area */}
      <div className="flex-1 flex flex-col w-full">
        <MessageContainer />
      </div>

    </div>
  );
};

export default ChatHome;