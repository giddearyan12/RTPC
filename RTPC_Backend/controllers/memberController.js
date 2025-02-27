import conversationalModel from "../models/conversationModel.js";
import userModel from "../models/userModel.js";
import messageModel from "../models/messageModel.js";

export const getUsersForSidebar = async (req, res) => {
	try {
		const loggedInUserId = req.user._id;

	
		const allUsers = await userModel.find({ _id: { $ne: loggedInUserId } }).select("name profilePic");

		
		const conversations = await conversationalModel.find({ participants: loggedInUserId });

		
		const userMap = {};
		allUsers.forEach((user) => {
			userMap[user._id.toString()] = {
				_id: user._id,
				name: user.name,
				profilePic: user.profilePic,
				updatedAt: null, 
				unreadCount: 0, 
			};
		});

		
		conversations.forEach((conversation) => {
			const otherParticipants = conversation.participants.filter(
				(user) => user._id.toString() !== loggedInUserId.toString()
			);

			otherParticipants.forEach((otherUser) => {
				if (otherUser && userMap[otherUser._id.toString()]) {
					userMap[otherUser._id.toString()].updatedAt = conversation.updatedAt;
				}
			});
		});

	
		const unreadCounts = await messageModel.aggregate([
			{
				$match: {
					receiverId: loggedInUserId,
					seen: false,
				},
			},
			{
				$group: {
					_id: "$senderId",
					unreadCount: { $sum: 1 },
				},
			},
		]);

		unreadCounts.forEach(({ _id, unreadCount }) => {
			if (userMap[_id.toString()]) {
				userMap[_id.toString()].unreadCount = unreadCount;
			}
		});
		
		res.status(200).json(userMap);
	} catch (error) {
		console.error("Error in getUsersForSidebar: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const markRead = async(req, res)=>{
	try {
	const {receiverId, senderId} = req.body;
	await messageModel.updateMany(
		{ receiverId: receiverId, senderId:senderId, seen: false }, 
		{ $set: { seen: true } }
	  );
	  res.status(200).json({success:true, message:"Marked read"});
	} catch (error) {
		res.status(500).json({error:"Error"});
	}

}
export const markNotification = async(req, res)=>{
	try {
	const {receiverId, senderId, message} = req.body;
	
	const abc = await messageModel.updateOne(
		{ receiverId: receiverId, senderId:senderId, message:message, seen: false }, 
		{ $set: { seen: true } }
	  );
	  
	  res.status(200).json({success:true, message:"Marked read"});
	} catch (error) {
		res.status(500).json({error:"Error"});
	}

}

