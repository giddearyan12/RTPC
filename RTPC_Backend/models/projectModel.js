import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    name:{type:String, required:true, unique:true},
    description:{type:String, required:true},
    technology:{type:String, required:true},
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user',required:true },
    collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    createdAt: { type: Date, default: Date.now }
    
},{minimize:false});

const projectModel = mongoose.models.project || mongoose.model("project", projectSchema)
export default projectModel;