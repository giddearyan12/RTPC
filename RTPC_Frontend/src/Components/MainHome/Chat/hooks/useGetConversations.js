import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

import useConversation from "../zustand/useConversation";
import { useSocketContext } from "../Context/SocketContext";

const useGetConversations = () => {
	const [loading, setLoading] = useState(false);
	const [conversations, setConversations] = useState({});
	const { lastMessages } = useConversation();
	const { socket } = useSocketContext();

	useEffect(() => {
		const getConversations = async () => {
			setLoading(true);
			try {
				const token = localStorage.getItem('token');

				const res = await axios.get("http://localhost:5000/api/members", {
					headers: {
						'Authorization': `Bearer ${token}`
					}
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
		};

		getConversations();

		
		socket?.on("newMessage", (message) => {
			setConversations((prevConversations) => {
				getConversations();
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
	}, [lastMessages, socket]);

	return { loading, conversations };
};

export default useGetConversations;
