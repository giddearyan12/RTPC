import projectModel from "../models/projectModel.js";
import Code from '../models/saveCode.js'
import verifyModel from "../models/verifyModel.js";
import userModel from "../models/userModel.js";
import verifyCode from "../models/verifyCodeModel.js";

export const verifyProject = async (req, res) => {
    const { name} = req.body;
  
    try {
      const proj = await verifyModel.findOne({ name });
      if (!proj) {
        return res.json({ success: false, message: "Project already exists" });
      }
      const user = await userModel.findById(proj.createdBy);


      const newProject = new projectModel({
        name:proj.name,
        description:proj.description,
        technology:proj.technology,
        createdBy: proj.createdBy,
        status:"Ongoing"
      });
  
      const newCode = new Code({
        code:"",
        language:"",
        username:"",
        projectId:newProject._id,
      })
      const newVerifyCode = new verifyCode({
        
        projectId: newProject._id, 
        codeHistory: [
          {
            username: "", 
            code: "",  
          },
        ],
      });
      
      // Save the new document to the database
      await newVerifyCode.save();
       
      
  
      await newProject.save();
      await newCode.save();
  
      user.projects.push(newProject._id);
      await user.save();

      await verifyModel.findOneAndDelete({name});
  
      return res.json({
        success: true,
        message: "Project created successfully",
        project: newProject,
      });
    } catch (error) {
      console.error(error);
      return res.json({
        success: false,
        message: "An error occurred",
        error: error.message,
      });
    }
  }; 
export const rejectProject = async (req, res) => {
    const { name} = req.body;
  
    try {
      const proj = await verifyModel.findOne({ name });
      if (!proj) {
        return res.json({ success: false, message: "Project already exists" });
      }
      await verifyModel.findOneAndDelete({name});
  
      return res.json({
        success: true,
        message: "Project Rejected successfully",
      });
    } catch (error) {
      console.error(error);
      return res.json({
        success: false,
        message: "An error occurred",
        error: error.message,
      });
    }
  }; 

  export const getNewProjects = async (req, res) => {
    try {
      
      const projects = await verifyModel.find().populate("createdBy", "name");
     
  
      return res.json({
        success: true,
        message: "Projects retrieved successfully",
        project: projects,
      });
    } catch (error) {
      console.error("Error fetching projects:", error.message);
      return res.status(500).json({
        success: false,
        message: "An error occurred while retrieving projects.",
        error: error.message,
      });
    }
  };
  export const getAllProjects = async (req, res) => {
    try {
      
      const projects = await projectModel.find().populate("createdBy", "name");
     
  
      return res.json({
        success: true,
        message: "Projects retrieved successfully",
        project: projects,
      });
    } catch (error) {
      console.error("Error fetching projects:", error.message);
      return res.status(500).json({
        success: false,
        message: "An error occurred while retrieving projects.",
        error: error.message,
      });
    }
  };
 
export const removeMember = async (req, res) => {
  try {
    const { studentId } = req.params;
    const user = await userModel.findById(studentId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    await userModel.findByIdAndDelete(studentId);
    await projectModel.updateMany(
      { createdBy: studentId },
      { $set: { createdBy: null } }
    );
    return res.json({
      success: true,
      message: "Student removed successfully",
    });
  } catch (error) {
    console.error("Error: ", error.message);
    return res.status(500).json({
      success: false,
      message: "An error occurred while removing the student",
      error: error.message,
    });
  }
};




export const removeProject = async (req, res) => {
  try {
    const { id } = req.body;
    console.log(id);

   

    const project = await projectModel.findById(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }


    await projectModel.findByIdAndDelete(id);

    
    await Code.deleteMany({ projectId: id });

   
    await userModel.updateMany(
      { projects: id },
      { $pull: { projects: id } }
    );

    return res.json({
      success: true,
      message: "Project removed successfully",
    });
  } catch (err) {
    console.error(err.message || "Error occurred while removing project");
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
