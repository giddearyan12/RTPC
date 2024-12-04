
import Code from "../models/saveCode.js";

export const saveCode = async (req, res) => {
  try {
    const { code, language, username, projectId } = req.body;
    console.log("Request Body:", req.body);

    if (!code || !language || !username || !projectId) {
      return res.status(400).json({
        error: "Code Editor is empty",
      });
    }

    const existingCode = await Code.findOne({
      code,
      language,
      username,
      projectId,
    });

    if (existingCode) {
      return res.status(400).json({
        error: "Project already exists with the same code",
      });
    }

    const newCode = new Code({
      code,
      language,
      username,
      projectId,
    });

    await newCode.save();

    res.status(201).json({ message: "Code saved successfully" });
  } catch (error) {
    console.error("Error in saveCode:", error.stack);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getCodeByProjectId = async (req, res) => {
  try {
    const { projectId } = req.query;

    if (!projectId) {
      return res.status(400).json({ error: "Project ID is required" });
    }

    if (typeof projectId !== "string" || projectId.trim() === "") {
      return res.status(400).json({ error: "Invalid projectId format" });
    }

    const savedCode = await Code.find({ projectId });

    if (!savedCode.length) {
      return res
        .status(404)
        .json({ message: "No code found for this project" });
    }

    res.status(200).json(savedCode);
  } catch (error) {
    console.error("Error fetching saved code: ", error.stack);
    res.status(500).json({ error: "Internal server error" });
  }
};