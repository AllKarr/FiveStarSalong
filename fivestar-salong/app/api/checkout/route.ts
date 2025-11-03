/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { auth } from "@/app/api/auth/[...nextauth]/route";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-10-29.clover",
});

export async function POST(req: Request) {
  try {
    // Get the authenticated user
    const session = await auth();
    const { items } = await req.json();

    // Always use consistent key name
    const userId = session?.user?.id || "guest";

    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ error: "Invalid cart items" }, { status: 400 });
    }

    // Format Stripe line items
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    // Create a Stripe Checkout session
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      success_url: `${process.env.NEXTAUTH_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/cancel`,
      metadata: {
        userId, // matches your webhook now
        products: JSON.stringify(
          items.map((i: any) => ({
            productId: i.id,
            quantity: i.quantity,
          }))
        ),
      },
    });

    console.log("✅ Stripe session created for user:", userId);

    return NextResponse.json({ url: stripeSession.url });
  } catch (err: any) {
    console.error(" Stripe Checkout Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
