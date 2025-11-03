/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import Stripe from "stripe";
import clientPromise from "@/lib/db";

export const config = {
  api: {
    bodyParser: false, // ✅ Required for Stripe signature verification
  },
};

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const preferredRegion = "auto";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    console.error("❌ No Stripe signature header found.");
    return new NextResponse("Missing Stripe signature", { status: 400 });
  }

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    console.log(`📦 Received event: ${event.type}`);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const userId = session.metadata?.userId || "guest";
      const rawProducts = session.metadata?.products || "[]";

      let products: any[] = [];
      try {
        products = JSON.parse(rawProducts);
      } catch {
        console.warn("⚠️ Could not parse products metadata:", rawProducts);
      }

      const totalPrice = session.amount_total ? session.amount_total / 100 : 0;

      const client = await clientPromise;
      const db = client.db("fivestar");

      const orderDoc = {
        user: userId,
        product: products.map((p) => p.productId).join(", "),
        quantity: products.reduce((sum, p) => sum + (p.quantity || 0), 0),
        totalPrice,
        paymentMethod: "card",
        deliveryMethod: "standard",
        status: "completed",
        purchasedAt: new Date(),
      };

      await db.collection("orders").insertOne(orderDoc);
      console.log("✅ Order saved for user:", userId);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("❌ Webhook Error:", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }
}
