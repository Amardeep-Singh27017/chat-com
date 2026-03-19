import React, { useState } from 'react'
import { toast } from 'react-toastify'
import userConversation from '../../Zustand/useConversation';
import axios from 'axios';

const ChatInput = () => {
    const { messages, selectedConversation, setMessages, setSelectedConversation } = userConversation();
    const [sending, setSending] = useState(false)
    const [sendData, setSendData] = useState("")

    const handleInput = (e) => {
        setSendData(e.target.value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSending(true)
        try {
            const res = await axios.post(`/api/message/send/${selectedConversation?._id}`, { message: sendData });
            const data = res.data
            if (data.success === false) {
                setSending(false)
                toast.info(data.message);
            }
            setMessages([...messages, data])
        } catch (error) {
            toast.error(error.message)
        } finally {
            setSending(false)
            setSendData('')
        }
    }
    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="h-16 w-full absolute bottom-4 flex items-center gap-2 sm:gap-3 px-4 sm:px-6 backdrop-blur-lg">
                    <input
                        required
                        id='message'
                        value={sendData}
                        onChange={handleInput}
                        type="text"
                        autoComplete="off"
                        autoCapitalize="off"
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 rounded-full bg-white/70 text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-300"
                    />
                    <button className="px-4 sm:px-5 py-2 rounded-full bg-purple-400/70 hover:bg-purple-400 text-white shadow-sm transition">
                        {sending ? <span>sending</span> : "Send"}
                    </button>
                </div>
            </form>
        </>
    )
}

export default ChatInput