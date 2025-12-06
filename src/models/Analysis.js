// src/models/Analysis.js
import mongoose from "mongoose";

const AnalysisSchema = new mongoose.Schema(
  {
    inputType: { type: String, enum: ["text", "url"], required: true },
    text: { type: String },
    url: { type: String },
    label: { type: String, enum: ["FAKE", "SUSPECT", "LIKELY_REAL"], required: true },
    score: { type: Number, required: true }, // 0-100 (fake score)
    reasons: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.models.Analysis ||
  mongoose.model("Analysis", AnalysisSchema);
