import React, { useEffect, useRef, useState } from 'react'
import ChatHeader from './ChatHeader'
import ChatInput from './ChatInput'
import userConversation from '../../Zustand/useConversation';
import { useAuth } from '../../context/AuthContext'
import axios from 'axios';
import { toast } from 'react-toastify';
import Spinner from './Spinner';
import notifySound from '../../assets/sound/notificationSound.mp3'
import { useSocketContext } from '../../context/SocketContext';
import useUIStore from '../../Zustand/openCloseSidebar';


const MessageContainer = () => {
    const { messages, selectedConversation, setMessages, setSelectedConversation } = userConversation();
    const { socket } = useSocketContext();
    const { authUser } = useAuth();
    const [loading, setLoading] = useState(false)
    const lastMessage = useRef()
    const { openSidebar } = useUIStore();

    // socket io 

    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (newMessage) => {
            if (
                newMessage.senderId === selectedConversation?._id ||
                newMessage.receiverId === selectedConversation?._id
            ) {
                const sound = new Audio(notifySound);
                sound.play();
                console.log("new messages", messages)
                setMessages((prev) => {
                    if (!prev) return [newMessage];

                    // prevent duplicate messages
                    if (prev.some((msg) => msg._id === newMessage._id)) {
                        return prev;
                    }
                    return [...prev, newMessage];
                });
            }
        };

        socket.on("newMessage", handleNewMessage);
        return () => socket.off("newMessage", handleNewMessage);
    }, [socket, messages, setMessages]);

    // get messages 

    useEffect(() => {
        const getMessages = async () => {
            setLoading(true)
            try {
                const res = await axios.get(`/api/message/${selectedConversation?._id}`);
                const data = res.data
                if (data.success === false) {
                    toast.info(data.message);
                }
                if (Array.isArray(data)) {
                    setMessages(data);
                }
            } catch (error) {
                toast.error(error.message)
            } finally {
                setLoading(false)
            }
        }
        if (selectedConversation?._id) {
            getMessages()
        }
    }, [selectedConversation?._id])


    // auto scroll to last messages 
    useEffect(() => {
        setTimeout(() => {
            lastMessage.current?.scrollIntoView({ behavior: "smooth" });
        }, 100)
    }, [messages]);



    return (

        <div className="flex-1 flex flex-col relative w-full">

            {/* Messages */}
            {selectedConversation === null ? (
                <>
                    <div className="flex relative flex-1 flex-col items-center justify-center text-center px-4 sm:px-6 select-none">
                        {/* ✅ Mobile Button */}
                        <button
                            onClick={openSidebar}
                            className="lg:hidden text-xl text-black absolute top-2 left-4"
                        >
                            ☰
                        </button>
                        {/* Icon */}
                        <div className="w-16 h-16 sm:w-20 sm:h-20 mb-4 sm:mb-5 rounded-full 
                bg-gradient-to-br from-purple-300 to-indigo-400 
                flex items-center justify-center shadow-lg">
                            <span className="text-2xl sm:text-3xl font-bold text-white">💬</span>
                        </div>

                        {/* First Name */}
                        <h2 className="text-xl sm:text-3xl font-extrabold text-transparent bg-clip-text 
                bg-gradient-to-r from-purple-600 to-indigo-600">
                            Hii, {authUser?.fullname?.trim().split(" ")[0]}!
                        </h2>

                        {/* Subtitle */}
                        <p className="mt-1 text-xs sm:text-base text-gray-600 font-medium">
                            No chat selected
                        </p>

                        {/* Helper text */}
                        <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-xs">
                            Select a conversation from the sidebar to start chatting
                        </p>

                    </div>
                </>
            ) : (
                <>
                    {/* Chat Header */}
                    <ChatHeader userdata={selectedConversation} />

                    <div className="h-[calc(100vh-120px)] sm:h-[calc(100vh-130px)] flex flex-col overflow-hidden">

                        {loading && <Spinner />}

                        {/* No messages */}
                        {!loading && messages?.length === 0 && (
                            <div className="w-full h-[calc(100vh-150px)] flex flex-col items-center justify-center text-center px-4 select-none">

                                <div className="w-16 h-16 sm:w-20 sm:h-20 mb-4 sm:mb-5 rounded-full 
                            bg-gradient-to-br from-purple-200 to-indigo-300 
                            flex items-center justify-center shadow-md">
                                    <span className="text-2xl sm:text-3xl">💭</span>
                                </div>

                                <h2 className="text-lg sm:text-2xl font-bold text-purple-800">
                                    No messages yet
                                </h2>

                                <p className="mt-1 text-xs sm:text-base text-gray-600">
                                    Start a conversation with{" "}
                                    <span className="font-semibold text-purple-700">
                                        {selectedConversation?.fullname?.trim().split(" ")[0]}
                                    </span>
                                </p>

                                <p className="text-xs sm:text-sm text-gray-500 mt-2 max-w-xs">
                                    Say hi 👋 or send your first message
                                </p>

                            </div>
                        )}

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-3 sm:py-4 space-y-2">

                            {!loading && Array.isArray(messages) && messages.length > 0 && messages.map((message) => (

                                <div
                                    key={message?._id}
                                    className={`flex ${message.senderId === authUser._id ? "justify-end" : "justify-start"}`}
                                >

                                    <div
                                        className={`
                                relative px-3 sm:px-4 py-2
                                max-w-[85%] sm:max-w-xs md:max-w-sm
                                text-xs sm:text-sm shadow-md
                                break-words
                                
                                ${message.senderId === authUser._id
                                                ? "bg-purple-400/80 text-white rounded-2xl rounded-br-sm after:content-[''] after:absolute after:right-[-6px] after:bottom-2 after:border-l-[8px] after:border-l-purple-400/80 after:border-y-[6px] after:border-y-transparent"
                                                : "bg-white/80 backdrop-blur text-gray-800 rounded-2xl rounded-bl-sm after:content-[''] after:absolute after:left-[-6px] after:bottom-2 after:border-r-[8px] after:border-r-white/80 after:border-y-[6px] after:border-y-transparent"
                                            }
                                `}
                                    >

                                        <p className="leading-relaxed tracking-wide select-none">
                                            {message?.message}
                                        </p>

                                        <span className="block text-[9px] sm:text-[10px] opacity-70 text-right mt-1">
                                            {new Date(message.createdAt).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                hour12: true
                                            })}
                                        </span>

                                    </div>

                                </div>

                            ))}

                            <div ref={lastMessage} />

                        </div>
                        {/* Input */}
                        <ChatInput />
                    </div>
                </>
            )}

        </div>
    )
}

export default MessageContainer 