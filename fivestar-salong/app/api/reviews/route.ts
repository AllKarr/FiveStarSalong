import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";
import { reviewSchema } from "@/lib/validations/review";

export async function GET() {
  const client = await clientPromise;
  const db = client.db("fivestar");
  const reviews = await db.collection("reviews").find({}).toArray();
  return NextResponse.json(reviews);
}

export async function POST(req: Request) {
  const { action, reviewId, data } = await req.json();
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

  if (action === "add") {
    const parsed = reviewSchema.safeParse(data);
    if (!parsed.success)
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

    await db.collection("reviews").insertOne(parsed.data);
    return NextResponse.json({ message: "Review added" });
  }

  return NextResponse.json({ message: "Invalid action" }, { status: 400 });
}

export async function PUT(req: Request) {
  const { reviewId, updates } = await req.json();
  const parsed = reviewSchema.partial().safeParse(updates);
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const client = await clientPromise;
  const db = client.db("fivestar");
  await db.collection("reviews").updateOne(
    { _id: new ObjectId(reviewId) },
    { $set: parsed.data }
  );

  return NextResponse.json({ message: "Review updated" });
}
