import { create } from 'zustand'

const userConversation = create((set) => ({
    selectedConversation: null,
    setSelectedConversation: (selectedConversation) => set({ selectedConversation }),
    messages: [],
    // Fix: Allow messages to be a function OR an array
    setMessages: (nextMessages) =>
        set((state) => ({
            messages: typeof nextMessages === 'function' 
                ? nextMessages(state.messages) 
                : (Array.isArray(nextMessages) ? nextMessages : [])
        })),
}))

export default userConversation