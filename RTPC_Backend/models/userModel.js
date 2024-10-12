import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{type:String, required:true},
    email:{type:String, required:true, unique:true},
    phone:{type:String, required:true, unique:true},
    en:{type:String, required:true, unique:true},
    password:{type:String, required:true},
    department:{type:String, required:true},
    gender:{type:String, required:true},
    college:{type:String, required:true},
    domain:{type:String, required:true},
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }]
},{minimize:false});

const userModel = mongoose.models.user || mongoose.model("user", userSchema)
export default userModel;