import { useEffect } from "react";
import axios from "axios";
import { useSocketContext } from "../../Context/SocketContext";
import useConversation from "../../zustand/useConversation";
import "./Sidebar.css";
import jwtDecode from "jwt-decode";

const Conversation = ({ conversation, lastIdx }) => {
	const { selectedConversation, setSelectedConversation } = useConversation();
	const isSelected = selectedConversation?._id === conversation._id;
	const { onlineUsers } = useSocketContext();
	const isOnline = onlineUsers.includes(conversation._id);
	const token = localStorage.getItem("token");
	const decodedToken = jwtDecode(token);


	const markAsRead = async (id) => {
		try {
			await axios.post("http://localhost:5000/api/members/mark", {
				receiverId: decodedToken.userId,
				senderId: id,
			});
		} catch (error) {
			console.log(error);
		}
	};

	const handleSelectConversation = (id) => {
		setSelectedConversation(conversation);

		conversation.unreadCount = 0;
		markAsRead(id);
	};
	return (
		<>
			<div
				className={`custom-conversation-container ${isSelected ? "selected" : ""}`}
				onClick={() => handleSelectConversation(conversation._id)}
			>
				<div className={`custom-avatar ${isOnline ? "online" : ""}`}>
					<img src={conversation.profilePic} alt="user avatar" />
				</div>

				<div className="custom-flex-column">
					<div className="custom-name-header">
						<p>{conversation.name}</p>
						<span className={conversation.unreadCount === 0 ? "" : "green-dot"}></span>
					</div>
				</div>
			</div>

			{!lastIdx && <div className="custom-divider"></div>}
		</>
	);
};

export default Conversation;