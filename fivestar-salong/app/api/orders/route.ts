/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";
import { orderSchema } from "@/lib/validations/order";
import { auth } from "@/app/api/auth/[...nextauth]/route";

// GET — Return only the logged-in user's orders
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const client = await clientPromise;
  const db = client.db("fivestar");

  // Use `userId` to match what’s stored in the database
  const orders = await db
    .collection("orders")
    .find({ userId: session.user.id })
    .sort({ createdAt: -1 })
    .toArray();

  return NextResponse.json(orders);
}

// POST — Create new order (for fallback cases, not Stripe)
export async function POST(req: Request) {
  const session = await auth();
  const client = await clientPromise;
  const db = client.db("fivestar");

  try {
    const { products, totalPrice, paymentMethod, deliveryMethod } = await req.json();

    const userId = session?.user?.id || "guest";
    const order = {
      userId,
      products,
      total: totalPrice,
      paymentMethod,
      deliveryMethod,
      status: "pending",
      createdAt: new Date(),
    };

    await db.collection("orders").insertOne(order);
    return NextResponse.json(order, { status: 201 });
  } catch (err: any) {
    console.error("❌ Order creation failed:", err);
    return NextResponse.json({ message: "Error creating order" }, { status: 500 });
  }
}

// PUT — Update user's own order (for example, refund or mark as completed)
export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { orderId, updates } = await req.json();
  const parsed = orderSchema.partial().safeParse(updates);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db("fivestar");

  const order = await db.collection("orders").findOne({ _id: new ObjectId(orderId) });
  if (!order || order.userId !== session.user.id) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  await db
    .collection("orders")
    .updateOne({ _id: new ObjectId(orderId) }, { $set: parsed.data });

  return NextResponse.json({ message: "Order updated successfully" });
}
