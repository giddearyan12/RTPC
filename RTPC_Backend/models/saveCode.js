import mongoose from "mongoose";

const codeSchema = new mongoose.Schema({
  code: { type: String, required: true },
  language: { type: String, required: true },
  username: { type: String, required: true },
  // foldername: [{ type: String, required: true }],
  projectId: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Code = mongoose.model("Code", codeSchema);

export default Code;
