import { getCurrentUser } from "@/actions/getCurrentUser";
import prisma from "@/utils/prisma.config";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser?.role !== "ADMIN") {
      return NextResponse.error();
    }
    const body = await request.json();
    const { id, deliveryStatus } = body;

    const order = await prisma.order.update({
      where: { id },
      data: { deliveryStatus },
    });

    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json("Internal server issue");
  }
}
