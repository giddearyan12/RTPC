import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true }, // Project creator's ID
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },    // Requester's ID
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "project", required: true }, // Associated project
  message: { type: String, required: true },    // Notification message
  isRead: { type: Boolean, default: false },    // Whether the notification is read or not
  createdAt: { type: Date, default: Date.now }, // Timestamp
}, { 
  minimize: false,
  timestamps: true // Automatically add createdAt and updatedAt fields
});

// Compound index to prevent duplicate notifications
notificationSchema.index(
  { recipient: 1, sender: 1, projectId: 1 }, 
  { unique: true }
);

const notificationModel = 
  mongoose.models.notification || mongoose.model("notification", notificationSchema);

export default notificationModel;
