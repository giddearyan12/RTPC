import { useRef, useState } from "react";
import { BsSend, BsImage, BsX, BsFileEarmarkPdf } from "react-icons/bs";
import useSendMessage from "../../hooks/useSendMessages";
import toast from "react-hot-toast";
import './Messages.css';

const MessageInput = () => {
	const [message, setMessage] = useState("");
	const [filePreview, setFilePreview] = useState(null); // base64
	const [fileType, setFileType] = useState(null); // "image" | "pdf"
	const [fileName, setFileName] = useState(null); // for PDF name
	const fileInputRef = useRef(null);
	const { loading, sendMessage } = useSendMessage();

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (!file) return;

		if (!["application/pdf", "image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
			toast.error("Please select an image or PDF file");
			return;
		}

		const reader = new FileReader();
		reader.onloadend = () => {
			setFilePreview(reader.result);
			setFileType(file.type.startsWith("image") ? "image" : "pdf");
			setFileName(file.name);
		};
		reader.readAsDataURL(file);
	};

	const removeFile = () => {
		setFilePreview(null);
		setFileType(null);
		setFileName(null);
		if (fileInputRef.current) fileInputRef.current.value = "";
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!message.trim() && !filePreview) return;

		await sendMessage({
			text: message,
			file: filePreview, // used for both image and pdf
		});

		setMessage("");
		removeFile();
	};

	return (
		<form className="custom-message-input-wrapper" onSubmit={handleSubmit}>
			{filePreview && (
				<div className="mb-2 flex items-center gap-2">
					<div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '10px' }}>
						{fileType === "image" ? (
							<img
								src={filePreview}
								alt="Preview"
								style={{
									width: '70px',
									height: '70px',
									objectFit: 'cover',
									borderRadius: '0.5rem',
									border: '1px solid #ccc'
								}}
							/>
						) : (
							<div className="flex items-center gap-2 text-red-600 font-medium">
								<BsFileEarmarkPdf size={40} />
								<span>{fileName}</span>
							</div>
						)}

						<button
							type="button"
							onClick={removeFile}
							style={{
								position: 'absolute',
								top: '-8px',
								right: '-8px',
								background: 'white',
								borderRadius: '9999px',
								width: '20px',
								height: '20px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								border: '1px solid #999'
							}}
						>
							<BsX size={12} />
						</button>
					</div>
				</div>
			)}

			<div className="custom-input-container">
				<input
					type="text"
					className="custom-input"
					placeholder="Send a message"
					value={message}
					onChange={(e) => setMessage(e.target.value)}
				/>

				<input
					type="file"
					accept="image/*,application/pdf"
					ref={fileInputRef}
					onChange={handleFileChange}
					style={{ display: "none" }}
				/>

				<button
					type="button"
					className="custom-send-button"
					onClick={() => fileInputRef.current?.click()}
					style={{ right: "3.5rem" }}
				>
					<BsImage />
				</button>

				<button type="submit" className="custom-send-button" disabled={loading}>
					{loading ? <div className="loading loading-spinner"></div> : <BsSend />}
				</button>
			</div>
		</form>
	);
};

export default MessageInput;
