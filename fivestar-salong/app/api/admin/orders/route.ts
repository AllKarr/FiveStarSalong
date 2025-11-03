import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";
import { orderSchema } from "@/lib/validations/order";
import { auth } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const client = await clientPromise;
  const db = client.db("fivestar");

  const filter =
    session.user.role === "admin"
      ? {}
      : { user: session.user.id }; // ✅ matches user field from webhook

  const orders = await db.collection("orders").find(filter).toArray();
  return NextResponse.json(orders);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { orderId, action } = await req.json();

  const client = await clientPromise;
  const db = client.db("fivestar");

  let update;
  if (action === "complete") update = { status: "completed" };
  else if (action === "incomplete") update = { status: "pending" };
  else if (action === "refund") update = { status: "refunded" };
  else return NextResponse.json({ message: "Invalid action" }, { status: 400 });

  await db.collection("orders").updateOne(
    { _id: new ObjectId(orderId) },
    { $set: update }
  );

  return NextResponse.json({ message: "Order updated successfully" });
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

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
