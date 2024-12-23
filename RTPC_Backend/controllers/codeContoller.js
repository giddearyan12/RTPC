
import Code from "../models/saveCode.js";

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