import prisma from "@/utils/prisma.config";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = headers().get("Stripe-Signature");

  const webhookSecret =
    process.env.STRIPE_WEBHOOK_SECRET_LIVE ?? process.env.STRIPE_WEBHOOK_SECRET;
  let event: Stripe.Event;

  try {
    if (!sig || !webhookSecret) return;
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.log(`❌ Error message: ${err.message}`);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case "charge.succeeded":
        const charge: any = event.data.object as Stripe.Charge;
        if (typeof charge.payment_intent === "string") {
          await prisma?.order.updateMany({
            where: { paymentIntentId: charge.payment_intent },
            data: {
              status: "complete",
              address: charge.shipping?.address,
            },
          });
        }
        break;
      default:
        console.log("Unhandled event type" + event.type);
    }
  } catch (error) {
    console.log(error);
    return new NextResponse(
      'Webhook error: "Webhook handler failed. View logs."',
      { status: 400 }
    );
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
