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

const registerUser = async(req, res)=>{
 const {name, email, phone, en, password, conpass, department, gender, college, domain} = req.body;

 try{
    const exists = await userModel.findOne({email});
    if(exists){
        return res.json({success: false, message:"User already exists"});
    }
    if(!validator.isEmail(email)){
        return res.json({success: false, message:"Incorrect Email"});
     }
     if(password.length<6){
        return res.json({success: false, message:"Too short password"});
     }
     if(password!=conpass){
        return res.json({success: false, message:"Confirm password incorrect"});
     }
    
    const salt = await bcrypt.genSalt(10);
    const hashedpass = await bcrypt.hash(password, salt);

    const newUser = new userModel({
        name:name,
        email:email,
        phone:phone,
        en:en,
        password:hashedpass,
        department:department,
        gender:gender,
        college:college,
        domain:domain,
 });
 const user = await newUser.save();
 const token = createToken(user._id);
 res.json({success:true, token})
 }
 catch(error){
    console.log(error)
    return res.json({success: false, message:"error"});
 }
}
const createProject = async (req, res) => {
    const { name, description, technology } = req.body;
    
    try {
      
        const exists = await projectModel.findOne({ name });
        if (exists) {
            return res.json({ success: false, message: "Project already exists" });
        }

        
        const token = req.headers.authorization.split(" ")[1]; 
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET); 
        const userId = decodedToken.id; 

       const user = await userModel.findOne({userId});
       

      
        const newProject = new projectModel({
            name,
            description,
            technology,
            createdBy: userId,
        });

        await newProject.save();
        user.projects.push(newProject._id); 
        await user.save();

        
        return res.json({ success: true, message: "Project created successfully"});
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


export {registerUser, loginUser, createProject, myProjects}
