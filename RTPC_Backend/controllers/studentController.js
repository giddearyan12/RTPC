import userModel from "../models/userModel.js";

const studentsList = async(req, res)=>{
 const students = await userModel.find();
 if(!students){
    return res.json({success:false, message:"Error"});
 }
 else{
    return res.json({success:true, students});
 }
}
export {studentsList};