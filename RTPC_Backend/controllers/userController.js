import userModel from "../models/userModel.js";
import projectModel from "../models/projectModel.js";
import jwt from "jsonwebtoken";

import validator from "validator";
import bcrypt from "bcrypt";
import generateTokenAndSetCookie from "../utils/generateToken.js";

import verifyModel from "../models/verifyModel.js";

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "Incorrect Credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Wrong Password" });
    }
    const token = generateTokenAndSetCookie(user._id, res);

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.fullName,
        profilePic: user.profilePic,
        token: token,
      },
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Error" });
  }
};

const registerUser = async (req, res) => {
  const {
    name,
    email,
    phone,
    en,
    password,
    conpass,
    department,
    gender,
    college,
    domain,
  } = req.body;

  try {

    const phoneExists = await userModel.findOne({ phone });
    if (phoneExists) {
      return res.json({ success: false, message: "Phone number already exists" });
    }

    const enExists = await userModel.findOne({ en });
    if (enExists) {
      return res.json({ success: false, message: "Enrollment number already exists" });
    }
    const emailExists = await userModel.findOne({ email });
    if (emailExists) {
      return res.json({ success: false, message: "Email already exists" });
    }

    if (!password || !conpass) {
      return res.json({
        success: false,
        message: "Password fields cannot be empty",
      });
    }

    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Incorrect Email" });
    }

    if (password.length < 6) {
      return res.json({ success: false, message: "Too short password" });
    }

    if (password !== conpass) {
      return res.json({
        success: false,
        message: "Confirm password doesn't match Password",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedpass = await bcrypt.hash(password, salt);

    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${name}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${name}`;

    const newUser = new userModel({
      name: name,
      email: email,
      phone: phone,
      en: en,
      password: hashedpass,
      department: department,
      gender: gender,
      college: college,
      domain: domain,
      profilePic: gender === "Male" ? boyProfilePic : girlProfilePic,
    });

    const user = await newUser.save();
    const token = generateTokenAndSetCookie(user._id, res);
    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.fullName,
        profilePic: user.profilePic,
        token: token,
      },
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Error" });
  }
};

const createProject = async (req, res) => {
  const { name, description, technology } = req.body;

  try {
    const exists = await projectModel.findOne({ name });
    if (exists) {
      return res.json({ success: false, message: "Project already exists" });
    }

    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const newProject = new verifyModel({
      name,
      description,
      technology,
      createdBy: userId,
    });

  

    await newProject.save();
   

   

    return res.json({
      success: true,
      message: "Wait for Verification...",
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

const myProjects = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res
        .status(401)
        .json({ success: false, message: "Authorization token required" });
    }

    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const userProjects = await projectModel.find({
      _id: { $in: user.projects },

    });

    if (!userProjects.length) {
      return res
        .status(404)
        .json({ success: false, message: "No projects found for this user" });
    }
    

    return res.json({ success: true, projects: userProjects });
  } catch (error) {
    console.error("Error retrieving user projects:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const getName = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    const user = await userModel.findById(id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.json({ success: true, user: user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const ListProjects = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    const user = await userModel.findById(id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (!user.domain) {
      return res
        .status(400)
        .json({ success: false, message: "User domain is not specified" });
    }

    const userProjects = await projectModel.find({
      technology: user.domain,
      createdBy: { $ne: id },
      _id: { $nin: user.projects },
    }).populate('createdBy', 'name').populate('collaborators','name');

    if (!userProjects.length) {
      return res
        .status(404)
        .json({
          success: false,
          message: "No available projects for this user",
        });
    }

    return res.json({ success: true, projects: userProjects });
  } catch (error) {
    console.error("Error retrieving user projects:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const getUser = async (req, res) => {

    const { name } = req.params; 
    try {
  
      const student = await userModel.findOne({name});
  
      if (!student) {
        return res.status(404).json({ success: false, message: "Student not found." });
      }
  
    
      const projects = await projectModel.find({
        _id: { $in: student.projects },
      });
  
   
      const projectNames = projects.map((project) => project.name);
  
     
      const updatedStudent = {
        ...student._doc, 
        projects: projectNames, 
      };
  
     
      return res.json({
        success: true,
        message: "Student retrieved successfully.",
        student: updatedStudent,
      });
    } catch (error) {
      console.error("Error fetching student:", error.message);
      return res.status(500).json({
        success: false,
        message: "An error occurred while fetching the student.",
        error: error.message,
      });
    }
  };

  const updateProject = async(req,res)=>{
    const {data} = req.body;
    try {
      const project = await projectModel.findById(data._id);
      if(!project){
        return res.status(404).json({ success: false, message: "Project not found." });
      }
      project.name = data.name || project.name;
      project.technology = data.technology || project.technology;
      project.description = data.description || project.description;
      project.status = data.status || project.status;

      await project.save();
      res.json({ success: true, message: "Profile updated successfully." });
    } catch (error) {
      console.error("Error updating project:", error.message);
      return res.status(500).json({
        success: false,
        message: "An error occurred while updating the project.",
        error: error.message,
      });
    }
  
  }
  


export {
  registerUser,
  loginUser,
  createProject,
  myProjects,
  getName,
  ListProjects,
  getUser,
  updateProject,
};
