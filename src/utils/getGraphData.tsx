import moment from "moment";
import prisma from "./prisma.config";

export default async function GetGraphData() {
  try {
    const startDate = moment().subtract(6, "days").startOf("day");
    const endDate = moment().endOf("day");

    const result = await prisma.order.groupBy({
      by: ["createdDate"],
      where: {
        createdDate: {
          gte: startDate.toISOString(),
          lte: endDate.toISOString(),
        },
        status: "complete",
      },
      _sum: {
        amount: true,
      },
    });

    const aggregateDate: {
      [day: string]: { day: string; date: string; totalAmount: number };
    } = {};

    const currentData = startDate.clone();
    while (currentData <= endDate) {
      const day = currentData.format("dddd");
      aggregateDate[day] = {
        day,
        date: currentData.format("YYYY-MM-DD"),
        totalAmount: 0,
      };

      currentData.add(1, "day");
    }

    result.forEach((entry) => {
      const day = moment(entry.createdDate).format("dddd");
      const amount = entry._sum.amount || 0;
      aggregateDate[day].totalAmount += amount;
    });

    const formattedDate = Object.values(aggregateDate).sort((a, b) =>
      moment(a.date).diff(moment(b.date))
    );
    return formattedDate;
  } catch (error: any) {
    throw new Error(error);
  }
}
