import mongoose from "mongoose";

const codeSchema = new mongoose.Schema({
  code: { type: String },
  language: { type: String},
  username: { type: String },
  // foldername: [{ type: String, required: true }],
  projectId: { type: String, required: true, unique:true },
  timestamp: { type: Date, default: Date.now },
});

const Code = mongoose.model("Code", codeSchema);

export default Code;
