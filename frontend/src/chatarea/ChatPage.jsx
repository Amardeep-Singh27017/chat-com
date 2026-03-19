import React from "react";

export default function ChatPage() {
  return (
    <div className="h-screen w-full flex bg-[#f0f2f5]">
      
      {/* ================= LEFT SIDEBAR ================= */}
      <div className="w-[30%] min-w-[320px] max-w-[420px] bg-white flex flex-col border-r">

        {/* Sidebar Header */}
        <div className="h-16 px-4 flex items-center justify-between bg-[#f0f2f5] border-b">
          <img
            src="https://avatar.iran.liara.run/public/boy"
            alt="me"
            className="w-10 h-10 rounded-full"
          />
          <div className="flex gap-4 text-gray-600 text-xl">
            <span>⟳</span>
            <span>⋮</span>
          </div>
        </div>

        {/* Search */}
        <div className="p-3 bg-white border-b">
          <input
            type="text"
            placeholder="Search or start new chat"
            className="w-full px-4 py-2 rounded-lg bg-[#f0f2f5] text-sm outline-none"
          />
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {[1,2,3,4,5,6].map((item) => (
            <div
              key={item}
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer border-b"
            >
              <img
                src="https://avatar.iran.liara.run/public/boy"
                className="w-12 h-12 rounded-full"
                alt="user"
              />
              <div className="flex-1">
                <div className="flex justify-between">
                  <p className="font-medium text-sm">John Doe</p>
                  <span className="text-xs text-gray-500">12:30</span>
                </div>
                <p className="text-xs text-gray-500 truncate">
                  Last message preview goes here...
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= RIGHT CHAT AREA ================= */}
      <div className="flex-1 flex flex-col">

        {/* Chat Header */}
        <div className="h-16 px-4 flex items-center justify-between bg-[#f0f2f5] border-b">
          <div className="flex items-center gap-3">
            <img
              src="https://avatar.iran.liara.run/public/boy"
              className="w-10 h-10 rounded-full"
              alt="chat-user"
            />
            <div>
              <p className="font-medium text-sm">John Doe</p>
              <p className="text-xs text-gray-500">online</p>
            </div>
          </div>
          <div className="flex gap-4 text-gray-600 text-xl">
            <span>🔍</span>
            <span>⋮</span>
          </div>
        </div>

        {/* Messages */}
        <div
          className="flex-1 overflow-y-auto px-10 py-6 space-y-3"
          style={{ backgroundColor: "#efeae2" }}
        >
          {/* Incoming */}
          <div className="flex">
            <div className="max-w-md bg-white px-3 py-2 rounded-lg text-sm shadow">
              Hello 👋
            </div>
          </div>

          {/* Outgoing */}
          <div className="flex justify-end">
            <div className="max-w-md bg-[#d9fdd3] px-3 py-2 rounded-lg text-sm shadow">
              Hi, how are you?
            </div>
          </div>

          <div className="flex">
            <div className="max-w-md bg-white px-3 py-2 rounded-lg text-sm shadow">
              All good. Working on the project 🙂
            </div>
          </div>
        </div>

        {/* Input */}
        <div className="h-16 px-4 flex items-center gap-3 bg-[#f0f2f5] border-t">
          <span className="text-xl text-gray-600">😊</span>
          <input
            type="text"
            placeholder="Type a message"
            className="flex-1 px-4 py-2 rounded-full text-sm outline-none"
          />
          <span className="text-xl text-gray-600">🎤</span>
        </div>
      </div>
    </div>
  );
}
