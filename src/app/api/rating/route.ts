import { getCurrentUser } from "@/actions/getCurrentUser";
import prisma from "@/utils/prisma.config";
import { Review } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.error();
    }

    const body = await req.json();

    const { comment, rating, product, userId } = body;

    const deliveredOrder = currentUser.orders.some(
      (order) =>
        order.products.find((item) => item.id === product.id) &&
        order.deliveryStatus === "delivered"
    );

    const userReview = product?.reviews.find((review: Review) => {
      return review.userId === currentUser.id;
    });

    if (userReview || !deliveredOrder) {
      return NextResponse.error();
    }

    const review = await prisma.review.create({
      data: {
        comment,
        productId: product.id,
        rating,
        userId,
      },
    });
    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json("Internal sever issue", { status: 400 });
  }
}
