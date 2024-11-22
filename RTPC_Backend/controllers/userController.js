import userModel from "../models/userModel.js";
import projectModel from "../models/projectModel.js";
import jwt from 'jsonwebtoken'

import validator from "validator";
import bcrypt from 'bcrypt';
import generateTokenAndSetCookie from "../utils/generateToken.js";

const loginUser = async(req, res)=>{
    const {email, password} = req.body;
    try{
        const user = await userModel.findOne({email});
        if(!user){
        return res.json({success:false, message:"Incorrect Credentials"})
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
        return  res.json({success:false, message:"Wrong Password"});
        }
        //const token  = createToken(user._id)
        const token = generateTokenAndSetCookie(user._id, res);
        
        res.json({success:true, data:{  _id: user._id,
            name: user.fullName,
            profilePic: user.profilePic,
            token:token, }});
    }
    catch(error){
        console.log(error)
        return res.json({success:false, message:"Error"})
    }

}

const createToken = (id)=>{
    return jwt.sign({id}, process.env.JWT_SECRET);
}
const registerUser = async(req, res) => {
    const { name, email, phone, en, password, conpass, department, gender, college, domain } = req.body;

    try {
        if (!password || !conpass) {
            return res.json({ success: false, message: "Password fields cannot be empty" });
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
            return res.json({ success: false, message: "Confirm password incorrect" });
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
        //const token = createToken(user._id);
        const token = generateTokenAndSetCookie(user._id, res)
        res.json({success:true, data:{  _id: user._id,
            name: user.fullName,
            profilePic: user.profilePic,
            token:token, }});
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Error" });
    }
};

const createProject = async (req, res) => {
    const { name, description, technology } = req.body;
    
    try {
        // Check if the project already exists
        const exists = await projectModel.findOne({ name });
        if (exists) {
            return res.json({ success: false, message: "Project already exists" });
        }

        // Extract and verify JWT token
        const token = req.headers.authorization.split(" ")[1]; 
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET); 
        const userId = decodedToken.userId; 

        // Fetch the user object
        const user = await userModel.findById(userId); 
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        // Create a new project
        const newProject = new projectModel({
            name,
            description,
            technology,
            createdBy: userId,
        });

        // Save the project in the database
        await newProject.save();

        // Add the project ID to the user's `projects` array
        user.projects.push(newProject._id); 
        await user.save();

        // Send a success response
        return res.json({ success: true, message: "Project created successfully", project: newProject });
    } catch (error) {
        console.error(error);
        return res.json({ success: false, message: "An error occurred", error: error.message });
    }
};


const myProjects = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ success: false, message: "Authorization token required" });
        }

        const token = authHeader.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.userId;

        // Fix: Use findById correctly without object wrapping
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Get projects for the user using the projects array in user model
        const userProjects = await projectModel.find({
            _id: { $in: user.projects }
        });

        if (!userProjects.length) {
            return res.status(404).json({ success: false, message: "No projects found for this user" });
        }

        return res.json({ success: true, projects: userProjects });
    } catch (error) {
        console.error("Error retrieving user projects:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};


const getName = async (req, res) => {
    try {
        const { id } = req.query; // Destructure `id` from `req.body`
        
        if (!id) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }
        
        const user = await userModel.findById(id); 
        
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        
        return res.json({ success: true, user:user });
    } catch (error) {
        console.error("Error fetching user:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

const ListProjects = async (req, res) => {
    try {
        const { id } = req.query; 
        
        if (!id) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        // Fetch user data by userId
        const user = await userModel.findById(id);
        
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // If domain is not specified in the user model
        if (!user.domain) {
            return res.status(400).json({ success: false, message: "User domain is not specified" });
        }

        // Query projects that match the user's domain and are not already in the user's projects array
        const userProjects = await projectModel.find({
            technology: user.domain,                // Filter by user's domain
            createdBy: { $ne: id },                 // Exclude projects created by the current user
            _id: { $nin: user.projects }            // Exclude projects that are already in the user's projects array
        });

        // If no projects are found that meet the criteria
        if (!userProjects.length) {
            return res.status(404).json({ success: false, message: "No available projects for this user" });
        }

        // Return the filtered list of projects
        return res.json({ success: true, projects: userProjects });
    } catch (error) {
        console.error("Error retrieving user projects:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};


  const getUser = async(req,res)=>{
    const { name } = req.params;
    try {
      const student = await userModel.findOne({ name }); 
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
      res.json(student);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  }
  





export {registerUser, loginUser, createProject, myProjects, getName, ListProjects, getUser}
