import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export const hasGemini = !!GEMINI_API_KEY;

let ai = null;
if (hasGemini) {
  ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
}

export async function analyzeWithGemini(text) {
  if (!hasGemini) {
    throw new Error("Gemini API key not configured.");
  }

  const prompt = `
You are an advanced misinformation detection AI.

Return ONLY this JSON format:
{
  "label": "FAKE" | "SUSPECT" | "LIKELY_REAL",
  "score": number,
  "reasons": ["reason 1", "reason 2"]
}

Analyze the news:
"""${text}"""
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ text: prompt }],
    });

    // ✔ CORRECT WAY TO GET GEMINI 2.5 FLASH OUTPUT
    const output =
      response?.candidates?.[0]?.content.parts?.[0].text || null;

    if (!output) {
      throw new Error("Gemini returned empty output");
    }

    let parsed;

    try {
      parsed = JSON.parse(output);
    } catch {
      const clean = output.replace(/```json|```/g, "").trim();
      parsed = JSON.parse(clean);
    }

    const label =
      ["FAKE", "SUSPECT", "LIKELY_REAL"].includes(parsed.label)
        ? parsed.label
        : "SUSPECT";

    let score = Number(parsed.score);
    if (isNaN(score)) score = 50;
    score = Math.max(0, Math.min(100, score));

    const reasons =
      Array.isArray(parsed.reasons) && parsed.reasons.length
        ? parsed.reasons
        : ["AI did not provide clear reasons"];

    return { label, score, reasons, raw: output };
  } catch (err) {
    console.error("Gemini API Error:", err);
    throw new Error("Gemini AI analysis failed.");
  }
}
