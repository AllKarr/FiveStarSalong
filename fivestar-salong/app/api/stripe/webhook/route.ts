/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import Stripe from "stripe";
import clientPromise from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ⚠️ Important: Remove `config = { api: { bodyParser: false } }` — it’s deprecated
// The App Router automatically allows raw body reading via req.text().

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20" as any,
});

export async function POST(req: Request) {
  let event: Stripe.Event;

  try {
    // ✅ Read raw body as text
    const body = await req.text();
    const sig = req.headers.get("stripe-signature");

    if (!sig) {
      console.error("❌ No Stripe signature header found.");
      return new NextResponse("Missing Stripe signature", { status: 400 });
    }

    // ✅ Verify event using the raw body
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // ✅ Handle successful checkout
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

    try {
      const client = await clientPromise;
      const db = client.db("fivestar");

      await db.collection("orders").insertOne({
        user: userId,
        product: products.map((p) => p.productId).join(", "),
        quantity: products.reduce((sum, p) => sum + (p.quantity || 0), 0),
        totalPrice,
        paymentMethod: "card",
        deliveryMethod: "standard",
        status: "completed",
        purchasedAt: new Date(),
      });

      console.log("✅ Order saved for user:", userId);
    } catch (err) {
      console.error("❌ Error saving order:", err);
    }
  }

  return NextResponse.json({ received: true });
}
