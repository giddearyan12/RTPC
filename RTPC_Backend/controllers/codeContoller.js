import { getReceiverSocketId} from "../socketExecution.js";
import {io} from '../app.js'
import Code from "../models/saveCode.js";
import verifyCode from "../models/verifyCodeModel.js";
import projectModel from "../models/projectModel.js";

export const saveCode = async (req, res) => {
  try {
    const { code, language, username, projectId } = req.body;
    
    

    if (!code || !language || !username || !projectId) {
      return res.status(400).json({
        error: "Code Editor is empty",
      });
    }
    
    const projectcode = await Code.findOne({projectId: projectId.projectId});
   
    projectcode.code = code || projectcode.code;
    projectcode.language = language || projectcode.language;
    projectcode.username = username || projectcode.username;
     await projectcode.save();

    res.status(201).json({ message: "Code saved successfully" });
  } catch (error) {
    console.error("Error in saveCode:", error.stack);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const submitCode = async (req, res) => {
  try {
    const { code, username, projectId } = req.body;
    
    
    if (!code || !username || !projectId) {
      return res.status(400).json({
        error: "Code Editor is empty",
      });
    }
    const projectCode = await verifyCode.findOne({ projectId: projectId.projectId });
    if (projectCode) {
      const newCodeHistory = {
        username: username,
        code: code,
        timestamp: new Date(),
        seen:false,
      };
     
      projectCode.codeHistory.push(newCodeHistory);
      await projectCode.save();
      
    
      const projectOwner = await projectModel.findById(projectId.projectId)
  
      const receiverSocketId = getReceiverSocketId(projectOwner.createdBy);
      
		if (receiverSocketId) {
			io.to(receiverSocketId).emit("newLog", newCodeHistory);
		}
      res.status(200).json({ message: "Code submitted successfully" });
    } else {
      
      const newProjectCode = new verifyCode({
        projectId: projectId.projectId,
        codeHistory: [
          {
            username: username,
            code: code,
            timestamp: new Date(),
          },
        ],
      });
  

      await newProjectCode.save();

      res.status(201).json({ message: "Code saved successfully for new project" });
    }
  } catch (error) {
    console.error("Error in submitCode:", error.stack);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const getCodeByProjectId = async (req, res) => {
  try {
    const { projectId } = req.body;
    if (!projectId) {
      return res.status(400).json({ error: "Project ID is required" });
    }
    const projectCode = await Code.findOne({ projectId });



    res.status(200).json(projectCode);
  } catch (error) {
    console.error("Error fetching saved code: ", error.stack);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const getLogs = async (req, res) => {
  try {
    const { projectId } = req.body;
 

    if (!projectId) {
      return res.status(400).json({ error: "Project ID is required" });
    }

    const projectData = await verifyCode.findOne({ projectId: projectId });

    if (!projectData) {
      return res.status(404).json({ error: "No project found with this ID" });
    }

    res.status(200).json(projectData.codeHistory);
  } catch (error) {
    console.error("Error fetching Logs", error.stack);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const handleLogSelection = async (req, res) => {
  try {
    const { selectedLog } = req.body;


    if (!selectedLog) {
      return res.status(400).json({ error: "Log is required" });
    }

    await verifyCode.findOneAndUpdate(
      { 
        "codeHistory": { 
          $elemMatch: { username: selectedLog.username, timestamp: selectedLog.timestamp } 
        } 
      }, 
      { $set: { "codeHistory.$.seen": true } }, 
      { new: true }  
    );
    
    
  

    res.status(200).json({success:true});
  } catch (error) {
    console.error("Error fetching Logs", error.stack);
    res.status(500).json({ error: "Internal server error" });
  }
};
