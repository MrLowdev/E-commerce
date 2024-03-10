import prisma from "@/utils/prisma.config";

interface IParams {
  productId?: string;
}

export default async function getProductById(params: IParams) {
  try {
    const products = await prisma.product.findUnique({
      where: {
        id: params.productId,
      },
      include: {
        reviews: {
          include: { user: true },
          orderBy: { createdDate: "desc" },
        },
      },
    });

    console.log(products);

    if (!products) {
      return null;
    }
    return products;
  } catch (error: any) {
    throw new Error(error);
  }
}
