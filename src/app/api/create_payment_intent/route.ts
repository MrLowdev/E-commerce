import { getCurrentUser } from "@/actions/getCurrentUser";
import { CartProductType } from "@/components/products/ProductDetails";
import prisma from "@/utils/prisma.config";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

const calculateOrderAmount = (items: CartProductType[]) => {
  const totalPrice = items.reduce((acc, item) => {
    const totalItem = item.price * item.Quantity;
    return acc + totalItem;
  }, 0);

  const price: any = Math.floor(totalPrice);

  return price;
};

export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorize" }, { status: 401 });
    }
    const body = await req.json();

    const { items, payment_intent_id } = body;

    const total = calculateOrderAmount(items) * 100;

    const orderDetails = {
      user: { connect: { id: currentUser.id } },
      amount: total,
      currency: "USD",
      status: "pending",
      deliveryStatus: "pending",
      paymentIntentId: payment_intent_id,
      products: items,
    };

    if (payment_intent_id) {
      const current_intent = await stripe.paymentIntents.retrieve(
        payment_intent_id
      );
      if (current_intent) {
        const update_intent = await stripe.paymentIntents.update(
          payment_intent_id,
          { amount: total }
        );

        const [existing_order, update_order] = await Promise.all([
          prisma.order.findFirst({
            where: {
              paymentIntentId: payment_intent_id,
            },
          }),
          prisma.order.update({
            where: { paymentIntentId: payment_intent_id },
            data: { amount: total, products: items },
          }),
        ]);

        if (!existing_order) {
          return NextResponse.json(
            { error: "Invalid PaymentIntent" },
            { status: 400 }
          );
        }
        return NextResponse.json(
          { paymentIntent: update_intent },
          { status: 201 }
        );
      }
    } else {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: total,
        currency: "USD",
        automatic_payment_methods: { enabled: true },
      });
      //create order
      orderDetails.paymentIntentId = paymentIntent.id;
      await prisma.order.create({ data: orderDetails });
      return NextResponse.json({ paymentIntent }, { status: 201 });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json("Internal server issue", { status: 500 });
  }
}
