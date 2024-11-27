import { useAuthContext } from "../../Context/AuthContext";
import { extractTime } from "../../utils/extractTime";
import useConversation from "../../zustand/useConversation";
import './Messages.css'

const Message = ({ message }) => {
	const { authUser } = useAuthContext();
	const { selectedConversation } = useConversation();
	const fromMe = message.senderId === authUser._id;
	const formattedTime = extractTime(message.createdAt);
	const chatClassName = fromMe ? "custom-chat-end" : "custom-chat-start";
	const profilePic = fromMe ? authUser.profilePic : selectedConversation?.profilePic;
	const bubbleBgColor = fromMe ? "from-me" : "from-other";
	const shakeClass = message.shouldShake ? "custom-shake" : "";
	

	return (
		<div className={`custom-chat-wrapper ${chatClassName}`}>
			<div className="custom-chat-image-wrapper">
				<img alt="User avatar" className="custom-chat-image" src={profilePic} />
			</div>
			<div className={`custom-chat-bubble ${bubbleBgColor} ${shakeClass}`}>
				{message.message}
			</div>
			<div className="custom-chat-footer">
				{formattedTime}
			</div>
		</div>
	);
};
export default Message;
