import useGetConversations from "../../hooks/useGetConversations";
import "./Sidebar.css";
import Conversation from "./Conversation";

const Conversations = () => {
	const { loading, conversations } = useGetConversations();

	return (
		<div className="custom-conversations-container">
			{Object.values(conversations)
				.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)) 
				.map((conversation, idx, arr) => (
					<Conversation
						key={conversation._id}
						conversation={conversation}
						lastIdx={idx === arr.length - 1}
					/>
				))}

			{loading && <span className="custom-loading-spinner mx-auto"></span>}
		</div>
	);
};

export default Conversations;
