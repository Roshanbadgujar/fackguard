// src/app/api/check/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Analysis from "@/models/Analysis";
import { analyzeTextContent, analyzeUrl } from "@/lib/fakeDetector";

export async function POST(req) {
  try {
    const body = await req.json();
    const { mode, text, url } = body; // mode: "text" | "url"

    if (!mode || (mode === "text" && !text) || (mode === "url" && !url)) {
      return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
    }

    await connectDB();

    let result;
    let inputType;

    if (mode === "text") {
      inputType = "text";
      result = analyzeTextContent(text);
    } else {
      inputType = "url";
      result = analyzeUrl(url);
    }

    const { fakeScore, label, reasons } = result;

    const doc = await Analysis.create({
      inputType,
      text: inputType === "text" ? text : undefined,
      url: inputType === "url" ? url : undefined,
      label,
      score: fakeScore,
      reasons,
    });

    return NextResponse.json(
      {
        id: doc._id,
        label,
        score: fakeScore,
        reasons,
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
