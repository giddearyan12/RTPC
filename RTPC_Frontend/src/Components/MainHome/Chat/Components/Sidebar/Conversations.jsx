import useGetConversations from "../../hooks/useGetConversations";
import { getRandomEmoji } from "../../utils/emojis";
import './Sidebar.css'
import Conversation from "./Conversation";

const Conversations = () => {
	const { loading, conversations } = useGetConversations();
	// console.log(conversations)

	return (
		<div className="custom-conversations-container">
			 {conversations.map((conversation, idx) => (
				<Conversation
					key={conversation._id}
					conversation={conversation}
					emoji={getRandomEmoji()}
					lastIdx={idx === conversations.length - 1}
				/>
			))} 

			{loading ? <span className="custom-loading-spinner mx-auto"></span> : null}
		</div>
	);
};
export default Conversations;
