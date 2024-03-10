import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/prisma.config";
import { getCurrentUser } from "@/actions/getCurrentUser";

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser?.role !== "ADMIN") {
      return NextResponse.error();
    }
    const body = await request.json();
    const { name, description, price, category, brand, images, inStock } = body;

    const product = await prisma.product.create({
      data: {
        description,
        images,
        price,
        brand,
        category,
        inStock,
        name,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json("Internal server issue");
  }
}
