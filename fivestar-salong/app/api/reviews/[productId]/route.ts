import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";

// Get all reviews for a specific product
export async function GET(
  req: Request,
  context: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await context.params;
    const client = await clientPromise;
    const db = client.db("fivestar");

    // Filter by productId AND only approved reviews
    const query = ObjectId.isValid(productId)
      ? { productId: new ObjectId(productId), approved: true }
      : { productId, approved: true };

    const reviews = await db
      .collection("reviews")
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("GET /api/reviews/[productId] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

//  Add a review for a specific product
export async function POST(
  req: Request,
  context: { params: Promise<{ productId: string }> } // 👈 same here
) {
  try {
    const { productId } = await context.params; // 👈 FIXED
    const client = await clientPromise;
    const db = client.db("fivestar");

    const body = await req.json();

    if (!body.text?.trim()) {
      return NextResponse.json(
        { error: "Review text is required" },
        { status: 400 }
      );
    }

    if (!body.rating || body.rating < 1 || body.rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    const review = {
      productId: ObjectId.isValid(productId)
        ? new ObjectId(productId)
        : productId,
      text: body.text.trim(),
      rating: body.rating,
      approved: false, // 👈 stays pending for admin
      createdAt: new Date(),
    };

    await db.collection("reviews").insertOne(review);

    return NextResponse.json({
      message: "Review submitted for approval",
    });
  } catch (error) {
    console.error("POST /api/reviews/[productId] error:", error);
    return NextResponse.json(
      { error: "Failed to add review" },
      { status: 500 }
    );
  }
}
