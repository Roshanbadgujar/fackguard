import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Analysis from "@/models/Analysis";
import { analyzeTextContent, analyzeUrl } from "@/lib/fakeDetector";
import { analyzeWithGemini, hasGemini } from "@/lib/gemini";

export async function POST(req) {
  try {
    const body = await req.json();
    const { mode, text, url, useAi } = body; // <- useAi added

    if (!mode || (mode === "text" && !text) || (mode === "url" && !url)) {
      return NextResponse.json(
        { message: "Invalid payload" },
        { status: 400 }
      );
    }

    await connectDB();

    // 1) Always compute heuristic baseline
    let heuristicResult;
    let inputType;

    if (mode === "text") {
      inputType = "text";
      heuristicResult = analyzeTextContent(text);
    } else {
      inputType = "url";
      heuristicResult = analyzeUrl(url);
    }

    let finalLabel = heuristicResult.label;
    let finalScore = heuristicResult.fakeScore ?? heuristicResult.score;
    let finalReasons = [...heuristicResult.reasons];
    let aiResult = null;

    // 2) Optional: Gemini AI (only for text mode)
    if (mode === "text" && useAi && hasGemini) {
      try {
        aiResult = await analyzeWithGemini(text);

        // Make AI result primary
        finalLabel = aiResult.label;
        finalScore = aiResult.score;

        finalReasons = [
          ...heuristicResult.reasons,
          "--- AI verdict ---",
          ...aiResult.reasons,
        ];
      } catch (err) {
        console.error("GEMINI_ANALYSIS_ERROR", err);
        // keep heuristic only, but mention AI failure
        finalReasons.push(
          "AI analysis failed, showing only heuristic result."
        );
      }
    } else if (mode === "text" && useAi && !hasGemini) {
      finalReasons.push(
        "AI (Gemini) is not configured on this deployment. Using heuristic only."
      );
    }

    // 3) Save to DB
    const doc = await Analysis.create({
      inputType,
      text: inputType === "text" ? text : undefined,
      url: inputType === "url" ? url : undefined,
      label: finalLabel,
      score: finalScore,
      reasons: finalReasons,
      aiLabel: aiResult?.label,
      aiScore: aiResult?.score,
      aiReasons: aiResult?.reasons,
    });

    // 4) Return clear JSON
    return NextResponse.json(
      {
        id: doc._id,
        label: finalLabel,
        score: finalScore,
        reasons: finalReasons,
        heuristic: {
          label: heuristicResult.label,
          score:
            heuristicResult.fakeScore ?? heuristicResult.score ?? finalScore,
          reasons: heuristicResult.reasons,
        },
        ai: aiResult
          ? {
              label: aiResult.label,
              score: aiResult.score,
              reasons: aiResult.reasons,
            }
          : null,
        createdAt: doc.createdAt,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("CHECK_API_ERROR", err);
    return NextResponse.json(
      { message: err.message || "Server error" },
      { status: 500 }
    );
  }
}
