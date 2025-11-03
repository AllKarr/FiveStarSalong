/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import Stripe from "stripe";
import clientPromise from "@/lib/db";

export const runtime = "nodejs"; // Must run on Node, not edge
export const dynamic = "force-dynamic";

// Disable Next.js body parsing for this route
export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20" as any,
});

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    console.error("❌ No Stripe signature header found.");
    return new NextResponse("Missing Stripe signature", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    // Get raw body (required for signature verification)
    const rawBody = await req.text();

    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Handle successful checkout sessions
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      const userId = session.metadata?.userId || "guest";
      const rawProducts = session.metadata?.products || "[]";
      const products = JSON.parse(rawProducts);
      const totalPrice = (session.amount_total || 0) / 100;

      const client = await clientPromise;
      const db = client.db("fivestar");

      const order = {
        user: userId,
        products,
        totalPrice,
        paymentMethod: "card",
        status: "completed",
        purchasedAt: new Date(),
      };

      await db.collection("orders").insertOne(order);
      console.log("✅ Order saved for user:", userId);
    } catch (err: any) {
      console.error("❌ Failed to save order:", err.message);
    }
  }

  return NextResponse.json({ received: true });
}
