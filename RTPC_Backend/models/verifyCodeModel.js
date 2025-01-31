import mongoose from "mongoose";

const verifyCodeSchema = new mongoose.Schema({
    codeHistory: [
        {
          username: { type: String },
          code: { type: String },
          timestamp: { type: Date, default: Date.now },
        },
    ],
   projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required:true },
  
});

const verifyCode = mongoose.model("verifyCode", verifyCodeSchema);

export default verifyCode;
