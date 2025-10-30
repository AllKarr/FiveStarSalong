import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";
import { orderSchema } from "@/lib/validations/order";

export async function GET() {
  const client = await clientPromise;
  const db = client.db("fivestar");
  const orders = await db.collection("orders").find({}).toArray();
  return NextResponse.json(orders);
}

export async function POST(req: Request) {
  const { orderId, action } = await req.json();

  const client = await clientPromise;
  const db = client.db("fivestar");

  if (action === "complete") {
    await db.collection("orders").updateOne(
      { _id: new ObjectId(orderId) },
      { $set: { status: "completed" } }
    );
  } else if (action === "incomplete") {
    await db.collection("orders").updateOne(
      { _id: new ObjectId(orderId) },
      { $set: { status: "pending" } }
    );
  } else if (action === "refund") {
    await db.collection("orders").updateOne(
      { _id: new ObjectId(orderId) },
      { $set: { status: "refunded" } }
    );
  } else {
    return NextResponse.json({ message: "Invalid action" }, { status: 400 });
  }

  return NextResponse.json({ message: "Order updated successfully" });
}

export async function PUT(req: Request) {
  const { orderId, updates } = await req.json();
  const parsed = orderSchema.partial().safeParse(updates);

  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const client = await clientPromise;
  const db = client.db("fivestar");

  await db.collection("orders").updateOne(
    { _id: new ObjectId(orderId) },
    { $set: parsed.data }
  );

  return NextResponse.json({ message: "Order updated successfully" });
}
