import { getCurrentUser } from "@/actions/getCurrentUser";
import prisma from "@/utils/prisma.config";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser?.role !== "ADMIN") {
      return NextResponse.error();
    }

    const product = await prisma.product.delete({
      where: { id: params.id },
    });

    return NextResponse.json("Delete product successfully", { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json("Internal server issue");
  }
}
