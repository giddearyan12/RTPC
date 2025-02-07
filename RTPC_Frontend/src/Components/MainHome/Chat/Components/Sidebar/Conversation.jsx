import { useSocketContext } from "../../Context/SocketContext";
import useConversation from "../../zustand/useConversation";

const Conversation = ({ conversation, lastIdx}) => {
	const { selectedConversation, setSelectedConversation } = useConversation();

	const isSelected = selectedConversation?._id === conversation._id;
	const { onlineUsers } = useSocketContext();
	const isOnline = onlineUsers.includes(conversation._id);
	

	return (
		<>
			<div
				className={`custom-conversation-container ${isSelected ? "selected" : ""}`}
				onClick={() => setSelectedConversation(conversation)}
			>
				<div className={`custom-avatar ${isOnline ? "online" : ""}`}>
					<img src={conversation.profilePic} alt='user avatar' />
				</div>

				<div className="custom-flex-column">
					<div className="custom-name-header">
						<p>{conversation.name}</p>
					</div>
				</div>
			</div>

			{!lastIdx && <div className="custom-divider"></div>}
		</>
	);
};

export default Conversation;
