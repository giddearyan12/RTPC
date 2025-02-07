import { useEffect, useRef } from "react";
import useGetMessages from "../../hooks/useGetMessages";
import MessageSkeleton from "../Skeletons/MessageSkeleton";
import Message from "./Message";
import useListenMessages from "../../hooks/useListenMessages";
import './Messages.css'

const Messages = () => {
	const { messages, loading } = useGetMessages();
	
	useListenMessages();
	const lastMessageRef = useRef();

	useEffect(() => {
		setTimeout(() => {
			lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
		}, 100);
	}, [messages]);

	return (
		<div className="custom-messages-container">
			
			{!loading &&
				messages.length > 0 &&
				messages.map((message) => (
					<div key={message._id} className="custom-message-wrapper" ref={lastMessageRef}>
						<Message message={message} />
					</div>
				))}

			
			{/* {loading &&
				[...Array(3)].map((_, idx) => (
					<MessageSkeleton key={idx} className="custom-message-skeleton" />
				))} */}

			
			{!loading && messages.length === 0 && (
				<p className="custom-empty-message">Send a message to start the conversation</p>
			)}
		</div>
	);
};
export default Messages;
