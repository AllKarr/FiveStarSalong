import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { reviewSchema } from "@/lib/validations/review";

export async function GET() {
  const client = await clientPromise;
  const db = client.db("fivestar");

  // Only return approved reviews
  const reviews = await db
    .collection("reviews")
    .find({ approved: true })
    .sort({ createdAt: -1 })
    .toArray();

  return NextResponse.json(reviews);
}

export async function POST(req: Request) {
  const data = await req.json();
  const parsed = reviewSchema.safeParse(data);

  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const client = await clientPromise;
  const db = client.db("fivestar");

  await db.collection("reviews").insertOne({
    ...parsed.data,
    approved: false, // 🚫 default: pending review
    createdAt: new Date(),
  });

  return NextResponse.json({ message: "Review submitted for approval" });
}
