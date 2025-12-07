// src/models/Analysis.js
import mongoose from "mongoose";

const AnalysisSchema = new mongoose.Schema(
  {
    inputType: { type: String, enum: ["text", "url"], required: true },
    text: { type: String },
    url: { type: String },

    // Final label/score saved for card
    label: {
      type: String,
      enum: ["FAKE", "SUSPECT", "LIKELY_REAL"],
      required: true,
    },
    score: { type: Number, required: true },

    reasons: [{ type: String }],

    // --- NEW: Gemini details (optional) ---
    aiLabel: {
      type: String,
      enum: ["FAKE", "SUSPECT", "LIKELY_REAL"],
      required: false,
    },
    aiScore: { type: Number, required: false },
    aiReasons: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.models.Analysis ||
  mongoose.model("Analysis", AnalysisSchema);
