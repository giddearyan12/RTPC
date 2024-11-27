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
 

export {studentsList, requestCollaboration, deleteProject};