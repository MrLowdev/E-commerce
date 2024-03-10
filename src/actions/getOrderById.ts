import prisma from "@/utils/prisma.config";

interface IParams {
  id?: string;
}

export default async function getOrderById(params: IParams) {
  try {
    const { id } = params;
    const orders = await prisma.order.findUnique({ where: { id } });

    if (!orders) {
      return null;
    }

    return orders;
  } catch (error: any) {
    throw new Error(error);
  }
}
