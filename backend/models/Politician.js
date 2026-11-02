import mongoose from "mongoose";

const politicianSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  role: { type: String, default: "" },
  constituency: { type: String, default: "" },
  party: { type: String, default: "" },
  imageUrl: { type: String, default: "" },
  bio: { type: String, default: "" },
  status: { type: String, enum: ["active", "archived"], default: "active" }
}, { timestamps: true });

export default mongoose.model("Politician", politicianSchema);
