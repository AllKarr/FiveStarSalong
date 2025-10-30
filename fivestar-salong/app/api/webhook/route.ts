/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import Stripe from "stripe";
import clientPromise from "@/lib/db";

// Disable automatic body parsing for this route (Next.js 15+ syntax)
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const preferredRegion = "home";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-10-29.clover",
});

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

    // ✅ Handle successful checkout
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const userId = session.metadata?.userId || "guest";
      const products = JSON.parse(session.metadata?.products || "[]");
      const total = session.amount_total ? session.amount_total / 100 : 0;

      const client = await clientPromise;
      const db = client.db("fivestar");

      await db.collection("orders").insertOne({
        userId,
        products,
        total,
        status: "completed",
        createdAt: new Date(),
      });

      console.log("✅ Order saved for user:", userId);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("❌ Webhook Error:", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }
}
