import { useEffect } from "react";
import useConversation from "../../zustand/useConversation";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
import './Messages.css'
import { TiMessages } from "react-icons/ti";
import { useAuthContext } from "../../Context/AuthContext";

const MessageContainer = () => {
	const { selectedConversation, setSelectedConversation } = useConversation();

	useEffect(() => {
	
		return () => setSelectedConversation(null);
	}, [setSelectedConversation]);

	return (
		<div className="message-container">
			{!selectedConversation ? (
				<NoChatSelected />
			) : (
				<>
					
					<div className="custom-header">
						<span className="label-text">To:</span>{" "}
						<span className="custom-header-text">{selectedConversation.name}</span>
					</div>
					<Messages />
					<MessageInput />
				</>
			)}
		</div>
	);
};
export default MessageContainer;

const NoChatSelected = () => {
	const { authUser } = useAuthContext();
	return (
		<div className="custom-no-chat-selected">
			<div className="custom-no-chat-selected-text">
				<p>Welcome 👋 {authUser.name} </p>
				<p>Select a chat to start messaging</p>
				<TiMessages className="custom-message-icon" />
			</div>
		</div>
	);
};
