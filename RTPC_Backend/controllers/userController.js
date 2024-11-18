import userModel from "../models/userModel.js";
import projectModel from "../models/projectModel.js";
import jwt from 'jsonwebtoken'

import validator from "validator";
import bcrypt from 'bcrypt';

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
        const token  = createToken(user._id)
        console.log(user._id);
        res.json({success:true, token});
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
        });

        const user = await newUser.save();
        const token = createToken(user._id);
        res.json({ success: true, token, name });
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
        const userId = decodedToken.id; 

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
            console.log('header problem')
            return res.status(401).json({ success: false, message: "Authorization token required" });
        }

       
        const token = authHeader.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);


        const userId = decodedToken.id;
      
        const userProjects = await projectModel.find({ createdBy: userId });

    
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
        
        const user = await userModel.findById(id); // Use `findById` to fetch a single user by `_id`
        
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
        console.log(id)
        
        if (!id) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }
  
      
      const user = await userModel.findById(id);
      
      
  
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      if (!user.domain) {
        return res.status(400).json({ success: false, message: "User domain is not specified" });
      }
  
      const userProjects = await projectModel.find({ technology: user.domain });
      console.log(userProjects)
  
      if (!userProjects.length) {
        return res.status(404).json({ success: false, message: "No projects found for this user" });
      }
  
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
