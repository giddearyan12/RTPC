import { useEffect } from "react";
import axios from "axios";
import { useSocketContext } from "../Context/SocketContext";
import useConversation from "../zustand/useConversation";

import notificationSound from "../sounds/notification.mp3";
const markAsRead = async (senderId, receiverId) => {
	try {
		
		await axios.post("http://localhost:5000/api/members/mark", {
			receiverId: receiverId,
			senderId: senderId,
		});
	} catch (error) {
		console.log(error);
	}
};

const useListenMessages = () => {
	const { socket } = useSocketContext();
	const { messages, setMessages } = useConversation(); 
	const { selectedConversation, setSelectedConversation } = useConversation();
	

	useEffect(() => {
		socket?.on("newMessage", (newMessage) => {
			
			newMessage.shouldShake = true;
			const sound = new Audio(notificationSound);
			sound.play();
			if(newMessage.senderId === selectedConversation._id){
				markAsRead(newMessage.senderId, newMessage.receiverId)
				setMessages([...messages, newMessage]);
			}
		});

		return () => socket?.off("newMessage");
	}, [socket, setMessages, messages]);
};
export default useListenMessages;