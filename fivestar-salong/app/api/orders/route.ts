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

  const orders = await db
    .collection("orders")
    .find({ user: session.user.id })
    .sort({ purchasedAt: -1 })
    .toArray();

  return NextResponse.json(orders);
}

// POST — Create new order
export async function POST(req: Request) {
  const session = await auth();
  const client = await clientPromise;
  const db = client.db("fivestar");

  try {
    const { product, quantity, totalPrice, paymentMethod, deliveryMethod } = await req.json();

    const user = session?.user?.id || "guest"; // same field name
    const order = {
      user,
      product,
      quantity,
      totalPrice,
      paymentMethod,
      deliveryMethod,
      status: "pending",
      purchasedAt: new Date(),
    };

    await db.collection("orders").insertOne(order);
    return NextResponse.json(order, { status: 201 });
  } catch (err: any) {
    console.error("❌ Order creation failed:", err);
    return NextResponse.json({ message: "Error creating order" }, { status: 500 });
  }
}

// PUT — Update user's own order
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
  if (!order || order.user !== session.user.id) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  await db
    .collection("orders")
    .updateOne({ _id: new ObjectId(orderId) }, { $set: parsed.data });

  return NextResponse.json({ message: "Order updated successfully" });
}
