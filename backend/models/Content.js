import mongoose from "mongoose";

const sourceSchema = new mongoose.Schema({
  title: { type: String, trim: true },
  url: { type: String, trim: true }
}, { _id: false });

const contentSchema = new mongoose.Schema({
  type: { type: String, enum: ["factcheck", "media-analysis", "research"], required: true },
  title: { type: String, required: true, trim: true, maxlength: 180 },
  slug: { type: String, required: true, unique: true },
  summary: { type: String, required: true, maxlength: 500 },
  body: { type: String, required: true },
  category: { type: String, default: "General", trim: true },
  imageUrl: { type: String, default: "" },
  verdict: { type: String, enum: ["True", "False", "Misleading", "Unverified", "Satire", ""], default: "" },
  claim: { type: String, default: "" },
  sources: { type: [sourceSchema], default: [] },
  status: { type: String, enum: ["draft", "published"], default: "draft" },
  publishedAt: { type: Date, default: null },
  author: { type: String, default: "CivicLens Editorial Desk" }
}, { timestamps: true });

contentSchema.index({ title: "text", summary: "text", body: "text" });
export default mongoose.model("Content", contentSchema);
