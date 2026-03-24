import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { BiLogOut } from "react-icons/bi";
import userConversation from "../../Zustand/useConversation.jsx";

import { useNavigate } from "react-router-dom";
import { useSocketContext } from "../../context/SocketContext.jsx";
import useUIStore from "../../Zustand/openCloseSidebar.jsx";

const Sidebar = () => {
    const [searchInput, setSearchInput] = useState("");
    const [searchUser, setSetsearchUser] = useState([]);
    const [chatUser, setChatuser] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedUserId, setselectedUserId] = useState(null);
    const { authUser, setAuthUser } = useAuth();
    const { messages, selectedConversation, setSelectedConversation } =
        userConversation();
    const navigate = useNavigate();
    const { onlineUser, socket } = useSocketContext();
    const [newMessagesUsers, setNewMessagesUsers] = useState([]);
    const { closeSidebar } = useUIStore();

    // unread message tracker for +1 badge
    useEffect(() => {
        if (!socket) return;
        const handleNewMessage = (newMessage) => {
            if (!newMessage || !newMessage.senderId) return;

            const receiverId = newMessage.receiverId || newMessage.recieverId;
            if (!receiverId) return;

            // mark sender as having unread messages for current user
            if (receiverId === authUser?._id) {
                setNewMessagesUsers((prev) => {
                    const exists = prev.includes(newMessage.senderId);
                    return exists ? prev : [...prev, newMessage.senderId];
                });
            }
        };
        socket.on("newMessage", handleNewMessage);
        return () => socket.off("newMessage", handleNewMessage);
    }, [socket, messages]);

    // online function and code
    const nowOnline = chatUser.map((user) => user._id);

    const isOnline = nowOnline.map((userId) => onlineUser.includes(userId));

    useEffect(() => {
        const chatUserHandler = async () => {
            setLoading(true);
            try {
                const chatters = await axios.get("/api/user/currentChatters");
                const data = chatters.data;
                if (data.success === false) {
                    setLoading(false);
                    toast.error(data.message);
                }
                setLoading(false);
                setChatuser(data);
            } catch (error) {
                setLoading(false);
                toast.error(error.message);
            }
        };
        chatUserHandler();
    }, []);


    useEffect(() => {
        const delay = setTimeout(async () => {
            setLoading(true);
            if (!searchInput.trim()) {
                setSetsearchUser([]);
                return;
            }
            try {
                const res = await axios.get(`/api/user/search?search=${searchInput.trim()}`);
                const data = res.data;
                if (data.success === false) {
                    setLoading(false);
                    toast.info(data.message);
                }
                if (data.length === 0) {
                    toast.info("User not Found!");
                } else {
                    setSetsearchUser(data);
                }
            } catch (error) {
                setLoading(false);
                toast.error(error.message);
            }
        }, 300);

        return () => clearTimeout(delay);

    }, [searchInput]);


    const handleUserClick = (user) => {
        setSelectedConversation(user);
        setselectedUserId(user._id);
        setNewMessagesUsers((prev) => prev.filter((senderId) => senderId !== user._id));
    };

    const backSearch = () => {
        setSetsearchUser([]);
        setSearchInput("");
    };

    const handleLogOut = async () => {
        setLoading(true);
        try {
            const res = await axios.post("/api/auth/logout");
            const { success, message } = res.data;
            if (!success) {
                toast.error(error.message);
                return;
            }
            toast.info(message);
            localStorage.removeItem("chatapp");
            setAuthUser(null);
            setLoading(false);
            navigate("/login");
        } catch (error) {
            setLoading(false);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div
                className="
          w-full
    h-full
    bg-white/40
    backdrop-blur-lg
    flex flex-col
        "
            >
                <h1 className="flex justify-center text-xl sm:text-2xl my-4 font-bold text-purple-900">
                    Chats
                </h1>

                <div className="flex justify-between gap-2 px-2">
                    <form className="w-full flex items-center pl-3 pr-2 py-1 bg-white/50 backdrop-blur-md rounded-full shadow-sm border border-white/30"
                    >
                        <input
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            type="text"
                            placeholder="Search user..."
                            className="flex-1 bg-transparent text-xs sm:text-sm text-gray-700 placeholder-gray-400 outline-none"
                        />

                        <button
                            type="submit"
                            className="p-2 rounded-full bg-purple-400/70 hover:bg-purple-400 text-white text-xs shadow-sm transition cursor-pointer"
                        >
                            <FaSearch className="text-gray-500 text-sm" />
                        </button>
                    </form>

                    <div
                        onClick={() => navigate(`profile/${authUser._id}`)}
                        className="
                                 flex-shrink-0
                                 w-8 h-8 sm:w-10 sm:h-10
                                 rounded-full
                                 overflow-hidden
                                 cursor-pointer
                                 transition
                              
                                 "
                    >
                        {authUser.profilepic ? (
                            <img
                                src={authUser.profilepic}
                                alt="user"
                                className="w-full h-full object-cover ring-2 ring-purple-300"
                            />
                        ) : (
                            <span
                                className="
                                 flex items-center justify-center
                                 w-full h-full
                                 bg-gradient-to-br from-purple-400 to-indigo-500
                                 text-white font-bold
                                 text-lg sm:text-xl
                                 uppercase
                                 select-none
                                "
                            >
                                {authUser?.fullname?.trim().charAt(0)}
                            </span>
                        )}
                    </div>
                </div>

                {/* HR — KEPT */}
                <hr className="w-[95%] m-auto mt-2 mb-4 border-t-2 text-purple-900 rounded-full" />

                {/* Chat item */}
                {searchUser.length > 0 ? (
                    <>
                        <div className="ml-2 mb-2 flex items-center">
                            {/* Back */}
                            <button
                                onClick={backSearch}
                                className="p-2 rounded-full bg-white/60 hover:bg-white shadow-sm transition cursor-pointer"
                            >
                                <FaArrowLeft className="text-gray-700" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto max-h-[calc(100vh-160px)] px-1">
                            {searchUser.map((user, index) => (
                                <div
                                    onClick={() => {
                                        handleUserClick(user);
                                        closeSidebar();
                                    }}
                                    key={user._id}
                                    className={`flex relative items-center gap-3 p-3 mx-1 mt-1 border-b
                                         border-white/30 shadow-sm backdrop-blur-md cursor-pointer rounded-b-xl
                                         transition-colors
                                         ${selectedUserId === user._id
                                            ? "bg-purple-200"
                                            : "bg-white/50 hover:bg-white/70"
                                        }`}
                                >
                                    <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-purple-300/60">
                                        {user.profilepic ? (
                                            <img
                                                src={user.profilepic}
                                                alt="user"
                                                className="w-full h-full rounded-full object-cover ring-2 ring-purple-300"
                                            />
                                        ) : (
                                            <span
                                                className="
                                                 flex items-center justify-center
                                                 w-full h-full
                                                 rounded-full
                                                 bg-gradient-to-br from-purple-400 to-indigo-500
                                                 text-white
                                                 font-bold
                                                 text-lg sm:text-xl
                                                 uppercase
                                                 select-none
                                                "
                                            >
                                                {user?.fullname?.trim().charAt(0)}
                                            </span>
                                        )}
                                        {/* Online Dot */}
                                        {isOnline[index] && (
                                            <span className="absolute top-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full animate-pulse" />
                                        )}
                                    </div>

                                    <div className="flex-1 overflow-hidden">
                                        <h2 className="text-xs sm:text-sm font-semibold text-gray-800 truncate">
                                            {user.fullname}
                                        </h2>
                                        <p className="text-[10px] sm:text-xs text-gray-600 truncate">
                                            Hey! How are you doing?
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <>
                        {chatUser.length === 0 ? (
                            <>
                                {/* we have not any chaters  */}
                                <div className="flex flex-col items-center justify-center py-10 text-center text-gray-500">
                                    <span className="text-sm font-medium">No chats yet</span>
                                    <span className="text-xs mt-1">
                                        Start a conversation to see it here
                                    </span>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* when chatters present and i also chated with him */}
                                <div className="flex-1 overflow-y-auto max-h-[calc(100vh-160px)] px-1">
                                    {chatUser.map((user, index) => (
                                        <div
                                            onClick={() => {
                                                handleUserClick(user, isOnline);
                                                closeSidebar();
                                            }}
                                            key={user._id}
                                            className={`flex relative items-center gap-3 p-3 mx-1 mt-1 border-b
                                         border-white/30 shadow-sm backdrop-blur-md cursor-pointer rounded-b-xl
                                         transition-colors
                                         ${selectedUserId === user._id
                                                    ? "bg-purple-200"
                                                    : "bg-white/50 hover:bg-white/70"
                                                }`}
                                        >
                                            <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-purple-300/60">
                                                {user.profilepic ? (
                                                    <img
                                                        src={user.profilepic}
                                                        alt="user"
                                                        className="w-full h-full rounded-full object-cover ring-2 ring-purple-300"
                                                    />
                                                ) : (
                                                    <span
                                                        className="
                                                               flex items-center justify-center
                                                               w-full h-full
                                                               rounded-full
                                                               bg-gradient-to-br from-purple-400 to-indigo-500
                                                               text-white
                                                               font-bold
                                                               text-lg sm:text-xl
                                                               uppercase
                                                               select-none
                                                              "
                                                    >
                                                        {user?.fullname?.trim().charAt(0)}
                                                    </span>
                                                )}

                                                {/* Online Dot */}
                                                {isOnline[index] && (
                                                    <span className="absolute top-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full animate-pulse" />
                                                )}
                                            </div>

                                            <div className="flex-1 overflow-hidden">
                                                <h2 className="text-xs sm:text-sm font-semibold text-gray-800 truncate">
                                                    {user.fullname}
                                                </h2>
                                                <p className="text-[10px] sm:text-xs text-gray-600 truncate">
                                                    Hey! How are you doing?
                                                </p>
                                            </div>

                                            {/* notification badge  */}
                                            <div>
                                                {newMessagesUsers.includes(user._id) && (
                                                    <div className="rounded-full bg-green-500 text-white px-[4px] text-sm">
                                                        +1
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                )}

                <div className="flex items-center justify-end mt-3 mx-2">
                    <button
                        onClick={handleLogOut}
                        title="Logout"
                        className="
                                 flex items-center justify-center
                                 cursor-pointer
                                 w-10 h-10
                                 rounded-full
                                 bg-red-500/10
                                 text-red-300
                                 hover:bg-red-400
                                 hover:text-white
                                 transition
                                 shadow-sm
                               "
                    >
                        <BiLogOut className="text-xl" />
                    </button>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
