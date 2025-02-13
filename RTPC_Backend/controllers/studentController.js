import userModel from "../models/userModel.js";
import projectModel from "../models/projectModel.js";
import mongoose from "mongoose";
import notificationModel from "../models/notificationModel.js";
const studentsList = async (req, res) => {
  try {
    
    const students = await userModel.find();

    if (!students || students.length === 0) {
      return res.json({ success: false, message: "No students found." });
    }

    const updatedStudents = await Promise.all(
      students.map(async (student) => {
     
        const projects = await projectModel.find({
          _id: { $in: student.projects },
        });

       
        const projectNames = projects.map((project) => project.name);

        return {
          ...student._doc, 
          projects: projectNames,
        };
      })
    );

    return res.json({
      success: true,
      message: "Students retrieved successfully.",
      students: updatedStudents,
    });
  } catch (error) {
    console.error("Error fetching students:", error.message);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching students.",
      error: error.message,
    });
  }
};


const requestCollaboration = async (req, res) => {
  try {
    const { projectId, userId } = req.body;


    const project = await projectModel.findById(projectId).populate("createdBy");
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
   
    const sender = await userModel.findById(userId);
    if (!sender) {
      return res.status(404).json({ message: "Requesting user not found" });
    }

    const recipientId = project.createdBy._id;
   


    const existingNotification = await notificationModel.findOne({
      recipient: recipientId,
      sender: userId,
      projectId: projectId
    });
  

    

    if (existingNotification) {
      return res.status(200).json({ message: "Collaboration request already sent." });
    }

  
    const notification = new notificationModel({
      recipient: recipientId,
      sender: userId,
      projectId,
      message: `${sender.name} has requested to collaborate on your project "${project.name}".`,
    });

   

    await notification.save();

    res.status(201).json({ message: "Collaboration request sent" });
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

      
      const projects = await projectModel.find({
          '_id': { $in: user.projects }
      });

      res.json({
          success: true,
          user: {
              ...user.toObject(), 
              projects 
          }
      });
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
      const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${name}`;
      const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${name}`;

      user.name = name || user.name;
      user.email = email || user.email;
      user.phone = phone || user.phone;
      user.en = en || user.en;
      user.department = department || user.department;
      user.gender = gender || user.gender;
      user.college = college || user.college;
      user.domain = domain || user.domain;
      user.profilePic = user.gender === "Male"? boyProfilePic : girlProfilePic;

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
    if (!id) return res.status(400).json({ error: "User ID is required" });

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid User ID" });
    }

    const projectsPromise = projectModel
      .find({ createdBy: id })
      // Remove .select() to get all fields
      .populate("createdBy", "name") 
      .populate("collaborators", "name")
      .lean(); 

    const collaboratedProjectsPromise = projectModel
      .find({ collaborators: id })
      // Remove .select() to get all fields
      .populate("createdBy", "name")
      .populate("collaborators", "name")
      .lean();

    const [projects, collaboratedProjects] = await Promise.all([
      projectsPromise,
      collaboratedProjectsPromise,
    ]);

    res.status(200).json({ message: "Success", projects, collaboratedProjects });
  } catch (error) {
    console.error("Error fetching team data:", error);
    res.status(500).json({ error: "Server error" });
  }
};



const notificationFun = async(req,res)=>{
  try {
    
    const userId = req.query.id; 
    
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
    const { action } = req.body;
    const notification = await notificationModel.findById(id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
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
    await notificationModel.findByIdAndDelete(id);
    res.status(200).json({ message: `Request ${action}ed successfully.` });
  } catch (error) {
    console.error("Error responding to notification:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

const removeCollaborator = async(req, res)=>{
  try {
    const { projectId, collaboratorId } = req.body.data;
    await projectModel.updateOne(
      { _id: projectId },
      { $pull: { collaborators: collaboratorId } } 
    );

    await userModel.updateOne(
      { _id: collaboratorId },
      { $pull: { projects: projectId  } }
    );


    res.status(200).json({ success: true, message: "Collaborator removed successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error removing collaborator." });
  }
}



 

export {studentsList, requestCollaboration, deleteProject, getUserProfile, updateUser, teamData, notificationFun, notificationRespond, removeCollaborator};