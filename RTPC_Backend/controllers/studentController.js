import userModel from "../models/userModel.js";
import projectModel from "../models/projectModel.js";

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
   const { projectId, userId } = req.body;
 
   try {
     const project = await projectModel.findById(projectId);
 
     if (!project) {
       return res.status(404).json({ message: "Project not found" });
     }

     if (project.collaborators.includes(userId)) {
       return res.status(400).json({ message: "User is already a collaborator" });
     }
     await userModel.findByIdAndUpdate(
      userId,
      { $addToSet: { projects: projectId } }, 
      { new: true } 
    );

     await projectModel.findByIdAndUpdate(
       projectId,
       { $addToSet: { collaborators: userId } },
       { new: true } 
     );
    
     res.status(200).json({ message: "User added to collaborators successfully" });
   } catch (error) {
     console.error("Error in requestCollaboration:", error);
     res.status(500).json({ message: "Server error", error: error.message });
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
      const user = await userModel.findById(req.user.id);

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
 

export {studentsList, requestCollaboration, deleteProject, getUserProfile, updateUser};