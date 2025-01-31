import mongoose from "mongoose";

const codeSchema = new mongoose.Schema({
  code: { type: String },
  language: { type: String},
  username: { type: String },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  timestamp: { type: Date, default: Date.now },
});

const Code = mongoose.model("Code", codeSchema);

export default Code;
