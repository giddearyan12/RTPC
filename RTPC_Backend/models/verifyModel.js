import mongoose from "mongoose";

const verifySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    technology: { type: String, required: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    createdAt: { type: Date, default: Date.now },
  },
  { minimize: false }
);

const verifyModel =
  mongoose.models.verify || mongoose.model("verify", verifySchema);
export default verifyModel;
