import { useEffect } from "react";
import axios from "axios";
import { useSocketContext } from "../Context/SocketContext";
import useConversation from "../zustand/useConversation";

import notificationSound from "../sounds/notification.mp3";
const markAsRead = async (senderId, receiverId) => {
	try {
		console.log('hello')
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

	useEffect(() => {
		socket?.on("newMessage", (newMessage) => {
			console.log("new message",newMessage)
			markAsRead(newMessage.senderId, newMessage.receiverId)
			newMessage.shouldShake = true;
			const sound = new Audio(notificationSound);
			sound.play();
			setMessages([...messages, newMessage]);
		});

		return () => socket?.off("newMessage");
	}, [socket, setMessages, messages]);
};
export default useListenMessages;