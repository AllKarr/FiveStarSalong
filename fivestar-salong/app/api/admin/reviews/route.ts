import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";

export async function GET() {
  const client = await clientPromise;
  const db = client.db("fivestar");

  const reviews = await db.collection("reviews").find({}).toArray();
  return NextResponse.json(reviews);
}

export async function POST(req: Request) {
  const { action, reviewId } = await req.json();
  const client = await clientPromise;
  const db = client.db("fivestar");

  if (action === "approve") {
    await db.collection("reviews").updateOne(
      { _id: new ObjectId(reviewId) },
      { $set: { approved: true } }
    );
    return NextResponse.json({ message: "Review approved" });
  }

  if (action === "delete") {
    await db.collection("reviews").deleteOne({ _id: new ObjectId(reviewId) });
    return NextResponse.json({ message: "Review deleted" });
  }

  return NextResponse.json({ message: "Invalid action" }, { status: 400 });
}
