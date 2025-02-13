import { create } from "zustand";

const useConversation = create((set) => ({
	selectedConversation: null,
	setSelectedConversation: (selectedConversation) => set({ selectedConversation }),

	messages: [],
	setMessages: (messages) => set({ messages }),
	
	lastMessages: {}, // Stores latest message timestamps for sorting
	setLastMessages: (update) => set((state) => ({
		lastMessages: { ...state.lastMessages, ...update }
	})),
}));

export default useConversation; 