import { useState } from "react";
import { useAuthContext } from "../../Context/AuthContext";
import { extractTime } from "../../utils/extractTime";
import useConversation from "../../zustand/useConversation";
import './Messages.css';

const Message = ({ message }) => {
	const { authUser } = useAuthContext();
	const { selectedConversation } = useConversation();
	const fromMe = message.senderId === authUser._id;
	const formattedTime = extractTime(message.createdAt);
	const chatClassName = fromMe ? "custom-chat-end" : "custom-chat-start";
	const profilePic = fromMe ? authUser.profilePic : selectedConversation?.profilePic;
	const bubbleBgColor = fromMe ? "from-me" : "from-other";
	const shakeClass = message.shouldShake ? "custom-shake" : "";

	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleFileClick = () => {
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
	};

	const isImage = message.fileType === 'image';
	const isPDF = message.fileType === 'pdf';

	return (
		<>
			<div className={`custom-chat-wrapper ${chatClassName}`}>
				<div className="custom-chat-image-wrapper">
					<img alt="User avatar" className="custom-chat-image" src={profilePic} />
				</div>

				<div className={`custom-chat-bubble ${bubbleBgColor} ${shakeClass}`}>
					{message.message && <p className="custom-chat-text">{message.message}</p>}

					{isImage && (
						<img
							src={message.file}
							alt="Sent content"
							className="custom-chat-sent-image"
							onClick={handleFileClick}
						/>
					)}

					{isPDF && (
						<div
							className="custom-chat-sent-pdf"
							onClick={handleFileClick}
						>
							<p>📄 PDF</p>
						</div>
					)}
				</div>

				<div className="custom-chat-footer">{formattedTime}</div>
			</div>

			{isModalOpen && (
				<div className="custom-image-modal-overlay" onClick={closeModal}>
					<div className="custom-image-modal" onClick={(e) => e.stopPropagation()}>
						{isImage && <img src={message.file} alt="Zoomed" className="custom-image-modal-content" />}
						
						{isPDF && (
							<embed src={message.file} type="application/pdf" width="100%" height="500px" />
						)}

						<a href={message.file} download className="custom-image-download-btn">
							Download
						</a>
						
						<button onClick={closeModal} className="custom-image-close-btn">X</button>
					</div>
				</div>
			)}
		</>
	);
};

export default Message;
