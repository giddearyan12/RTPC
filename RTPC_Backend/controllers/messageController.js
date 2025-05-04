import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";
import { getReceiverSocketId} from "../socketExecution.js";
import {io} from '../app.js'
import userModel from "../models/userModel.js";


export const sendMessage = async (req, res) => {
	try {
	  const { message, file, fileType } = req.body; // Accept file and fileType in the request body
	  const { id: receiverId } = req.params;
	  const senderId = req.user._id;
  
	  // Find or create a conversation
	  let conversation = await Conversation.findOne({
		participants: { $all: [senderId, receiverId] },
	  });
  
	  if (!conversation) {
		conversation = await Conversation.create({
		  participants: [senderId, receiverId],
		});
	  }
  
	  // Create a new message
	  const newMessage = new Message({
		senderId,
		receiverId,
		message: message || "", 
		file: file || null,  // Store the file (image, pdf, etc.)
		fileType: fileType || null,  // Store the type of file ("image", "pdf", etc.)
		seen: false,
	  });
  
	  if (newMessage) {
		conversation.messages.push(newMessage._id);
	  }
  
	  // Save conversation and message
	  await Promise.all([conversation.save(), newMessage.save()]);
  
	  // Get sender and receiver names for populated message
	  const sender = await userModel.findById(senderId).select("name");
	  const receiver = await userModel.findById(receiverId).select("name");
  
	  // Populate the new message with sender and receiver info
	  const populatedMessage = {
		...newMessage.toObject(),
		sender: { _id: senderId, name: sender?.name || "Unknown" },
		receiver: { _id: receiverId, name: receiver?.name || "Unknown" },
	  };
  
	  // Emit the new message to the receiver via WebSockets
	  const receiverSocketId = getReceiverSocketId(receiverId);
	  if (receiverSocketId) {
		io.to(receiverSocketId).emit("newMessage", populatedMessage);
	  }
  
	  // Send back the populated message to the sender
	  res.status(201).json(populatedMessage);
	} catch (error) {
	  console.log("Error in sendMessage controller: ", error.message);
	  res.status(500).json({ error: "Internal server error" });
	}
  };
  

export const getMessages = async (req, res) => {
	try {
		const { id: userToChatId } = req.params;
		const senderId = req.user._id;

		const conversation = await Conversation.findOne({
			participants: { $all: [senderId, userToChatId] },
		}).populate("messages");
		if (!conversation) return res.status(200).json([]);

		const messages = conversation.messages;

		res.status(200).json(messages);
	} catch (error) {
		console.log("Error in getMessages controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};
export const getNotification = async (req, res) => {
	try {
		const { receiverId } = req.body;
		

		const messagesNotifications = await Message.find({
			receiverId: receiverId,
			seen: false,
		}); 


		
		const populatedMessages = await Promise.all(
			messagesNotifications.map(async (message) => {
				const sender = await userModel.findById(message.senderId).select("name");
				return {
					...message.toObject(),  
					sender: { id: message.senderId.toString(), name: sender?.name || "Unknown" },
				};
			})
		);

		res.status(200).json(populatedMessages);
	} catch (error) {
		console.error("Error in Notifications:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

