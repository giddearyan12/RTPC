import userModel from "../models/userModel.js";
import projectModel from "../models/projectModel.js";
import mongoose from "mongoose";
import notificationModel from "../models/notificationModel.js";

const studentsList = async(req, res)=>{
 const students = await userModel.find();
 if(!students){
    return res.json({success:false, message:"Error"});
 }
 else{
    return res.json({success:true, students});
 }
}
const requestCollaboration = async (req, res) => {
  try {
    const { projectId, userId } = req.body;

    // Fetch project and creator details
    const project = await projectModel.findById(projectId).populate("createdBy");
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const sender = await userModel.findById(userId);
    if (!sender) {
      return res.status(404).json({ message: "Requesting user not found" });
    }

    const recipientId = project.createdBy._id;

    // Check if a notification already exists for the same recipient, sender, and project
    const existingNotification = await notificationModel.findOne({
      recipient: recipientId,
      sender: userId,
      projectId: projectId
    });

    if (existingNotification) {
      return res.status(400).json({ message: "Collaboration request already sent." });
    }

    // Create a new notification
    const notification = new notificationModel({
      recipient: recipientId,
      sender: userId,
      projectId,
      message: `${sender.name} has requested to collaborate on your project "${project.name}".`,
    });

    await notification.save();

    res.status(201).json({ message: "Collaboration request sent successfully." });
  } catch (error) {
    console.error("Error handling collaboration request:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};


 const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    
    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    res.status(200).json({ message: "Project deleted successfully." });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ message: "Failed to delete the project." });
  }
};

const getUserProfile = async (req, res) => {
  try {

      const { id } = req.query;
     
      if (!id) {
          return res.status(400).json({ success: false, message: "User ID is required" });
      }
      const user = await userModel.findById(id);

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      res.json({ success: true, user: user });
  } catch (error) {
      res.status(500).json({ message: 'Server error', error });
  }
};



const updateUser = async (req, res) => {
  const { name, email, phone, en, department, gender, college, domain } = req.body;

  try {
      
      const user = await userModel.findById(req.body.id);

      if (!user) {
          return res.status(404).json({ error: "User not found" });
      }

      user.name = name || user.name;
      user.email = email || user.email;
      user.phone = phone || user.phone;
      user.en = en || user.en;
      user.department = department || user.department;
      user.gender = gender || user.gender;
      user.college = college || user.college;
      user.domain = domain || user.domain;

      await user.save();

      res.json({ message: "Profile updated successfully." });
  } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ error: "Server error" });
  }
};

const teamData = async (req, res) => {
  try {
    const id = req.query.id;

    if (!id) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid User ID" });
    }

   
    const projects = await projectModel
    .find({ createdBy: id })
    .populate("createdBy", "name") 
    .populate("collaborators", "name");

    const collaboratedProjects = await projectModel
    .find({ collaborators: id })
    .populate("createdBy", "name")
    .populate("collaborators", "name");

    
    if (projects.length === 0) {
      return res.status(404).json({ error: "No projects found for this user" });
    }

    res.status(200).json({ message: "Success", projects, collaboratedProjects });
  } catch (error) {
    console.error("Error fetching team data:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const notificationFun = async(req,res)=>{
  try {
    
    const userId = req.query.id; // Assume the user is authenticated via middleware
    
    const notifications = await notificationModel.find({ recipient: userId }).populate("sender", "name");
    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

const notificationRespond = async(req, res)=>{
  try {
    const { id } = req.params;
   
    
    const { action } = req.body; // Accept or Reject

    const notification = await notificationModel.findById(id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
  

    // Perform action (accept/reject)
    if (action === "accept") {
      const project = await projectModel.findById(notification.projectId);
      const collaborator = await userModel.findById(notification.sender);
      if (!project.collaborators.includes(notification.sender)) {
        project.collaborators.push(notification.sender);
        await project.save();
        collaborator.projects.push(notification.projectId);
        await collaborator.save();
      } 
    
      
      console.log("Accepted collaboration request for project:", notification.projectId);
    } else if (action === "reject") {
      console.log("Rejected collaboration request for project:", notification.projectId);
    } else {
      return res.status(400).json({ message: "Invalid action" });
    }

    // Remove the notification after handling
    await notificationModel.findByIdAndDelete(id);
    res.status(200).json({ message: `Request ${action}ed successfully.` });
  } catch (error) {
    console.error("Error responding to notification:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

 

export {studentsList, requestCollaboration, deleteProject, getUserProfile, updateUser, teamData, notificationFun, notificationRespond};