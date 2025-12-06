// src/app/api/history/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Analysis from "@/models/Analysis";

export async function GET() {
  try {
    await connectDB();
    const items = await Analysis.find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    return NextResponse.json(
      items.map((i) => ({
        id: i._id,
        inputType: i.inputType,
        text: i.text,
        url: i.url,
        label: i.label,
        score: i.score,
        createdAt: i.createdAt,
      })),
      { status: 200 }
    );
  } catch (err) {
    console.error("HISTORY_API_ERROR", err);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
