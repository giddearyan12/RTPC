import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true }, 
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },   
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "project", required: true }, 
  message: { type: String, required: true },    
  isRead: { type: Boolean, default: false },    
  createdAt: { type: Date, default: Date.now }, 
}, { 
  minimize: false,
  timestamps: true 
});


notificationSchema.index(
  { recipient: 1, sender: 1, projectId: 1 }, 
  { unique: true }
);

const notificationModel = 
  mongoose.models.notification || mongoose.model("notification", notificationSchema);

export default notificationModel;
