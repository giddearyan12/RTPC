import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import axios from "axios";

import useConversation from "../zustand/useConversation";
import { useSocketContext } from "../Context/SocketContext";

const useGetConversations = () => {
	const [loading, setLoading] = useState(false);
	const [conversations, setConversations] = useState({});
	const { lastMessages } = useConversation();
	const { socket } = useSocketContext();
		const { messages, setMessages } = useConversation(); 

	// Expose getConversations so it can be called externally
	const getConversations = useCallback(async () => {
		
		setLoading(true);
		try {
			const token = localStorage.getItem('token');

			const res = await axios.get("http://localhost:5000/api/members", {
				headers: { 'Authorization': `Bearer ${token}` }
			});

			const data = res.data;

			if (data.error) {
				throw new Error(data.error);
			}
			setConversations(data);
		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		getConversations();

		socket?.on("newMessage", (message) => {
			
			getConversations();
			setConversations((prevConversations) => {
				const updatedConversations = { ...prevConversations };

				const userId =
					message.senderId === message.loggedInUserId
						? message.receiverId
						: message.senderId;

				if (updatedConversations[userId]) {
					updatedConversations[userId] = {
						...updatedConversations[userId],
						updatedAt: message.createdAt,
					};
				}

				return updatedConversations;
			});
		});

		return () => socket?.off("newMessage");
	}, [lastMessages, socket, getConversations, messages, setMessages]);

	return { loading, conversations, getConversations };
};

export default useGetConversations;
