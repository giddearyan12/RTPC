import conversationalModel from "../models/conversationModel.js";
import userModel from "../models/userModel.js";
import messageModel from "../models/messageModel.js";

export const getUsersForSidebar = async (req, res) => {
	try {
		const loggedInUserId = req.user._id;

		// Fetch all users except the logged-in user
		const allUsers = await userModel.find({ _id: { $ne: loggedInUserId } }).select("name profilePic");

		// Fetch conversations where the logged-in user is a participant
		const conversations = await conversationalModel.find({ participants: loggedInUserId });

		// Initialize user map
		const userMap = {};
		allUsers.forEach((user) => {
			userMap[user._id.toString()] = {
				_id: user._id,
				name: user.name,
				profilePic: user.profilePic,
				updatedAt: null, 
				unreadCount: 0, // Default unread count
			};
		});

		// Update last interaction time
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

		// Fetch unread message counts per sender
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

