import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
  token: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, required: true, default: Date.now, expires: 3600 },
});

export default mongoose.model("VerifyToken", tokenSchema);
