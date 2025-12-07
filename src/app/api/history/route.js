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

    // YAHAN se hamesha array ja raha hai
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
    // Error me bhi array de sakte, taaki front-end simple rahe:
    return NextResponse.json([], { status: 500 });
    // ya {message: "..."} bhi de sakte ho, par tab front-end guard zaruri hai
  }
}
