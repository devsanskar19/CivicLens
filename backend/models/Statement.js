import mongoose from "mongoose";

const statementSchema = new mongoose.Schema({
  politician: { type: mongoose.Schema.Types.ObjectId, ref: "Politician", required: true },
  statement: { type: String, required: true, trim: true },
  topic: { type: String, default: "General" },
  platform: { type: String, default: "" },
  originalUrl: { type: String, default: "" },
  evidenceUrl: { type: String, default: "" },
  publishedOn: { type: Date, default: null },
  analysis: { type: String, default: "" },
  status: { type: String, enum: ["draft", "published"], default: "draft" }
}, { timestamps: true });

export default mongoose.model("Statement", statementSchema);
