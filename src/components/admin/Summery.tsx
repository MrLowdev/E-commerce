"use client";

import { Order, Product, User } from "@prisma/client";
import { useEffect, useState } from "react";
import Heading from "../Heading";
import { formatPrice } from "@/utils/formatPrice";
import { formatNumber } from "@/utils/formatNumber";

interface SummeryProps {
  orders: Order[];
  products: Product[];
  users: User[];
}

type SummeryDataType = {
  [key: string]: {
    label: string;
    digit: number;
  };
};

const Summery: React.FC<SummeryProps> = ({ orders, products, users }) => {
  const [SummeryData, setSummeryDate] = useState<SummeryDataType>({
    sale: {
      label: "Total Sale",
      digit: 0,
    },
    products: {
      label: "Total Products",
      digit: 0,
    },
    orders: {
      label: "Total Orders",
      digit: 0,
    },
    paidOrders: {
      label: "Paid Orders",
      digit: 0,
    },
    unpaidOrder: {
      label: "Unpaid Orders",
      digit: 0,
    },
    users: { label: "Total User", digit: 0 },
  });

  useEffect(() => {
    setSummeryDate((prev) => {
      let tempData = { ...prev };

      const totalSale = orders.reduce((acc, item) => {
        if (item.status === "complete") {
          return acc + item.amount;
        } else {
          return acc;
        }
      }, 0);

      const paidOrder = orders.filter((item) => {
        return item.status === "complete";
      });

      const unpaidOrder = orders.filter((item) => {
        return item.status === "pending";
      });

      tempData.sale.digit = totalSale;
      tempData.orders.digit = orders.length;
      tempData.paidOrders.digit = paidOrder.length;
      tempData.unpaidOrder.digit = unpaidOrder.length;
      tempData.products.digit = products.length;
      tempData.users.digit = users.length;

      return tempData;
    });
  }, [orders, products, users]);

  const summeryKeys = Object.keys(SummeryData);
  return (
    <div className="max-w-[1150px] m-auto">
      <div className="mb-4 mt-8">
        <Heading title="Stats" center />
      </div>
      <div className="grid grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto">
        {summeryKeys &&
          summeryKeys.map((key) => (
            <div
              key={key}
              className="rounded-xl border-2 p-4 flex flex-col items-center gap-2 transition"
            >
              <div className="text-xl md:text-4xl font-bold">
                {SummeryData[key].label === "Total Sale" ? (
                  <>{formatPrice(SummeryData[key].digit)}</>
                ) : (
                  <>{formatNumber(SummeryData[key].digit)}</>
                )}
              </div>
              <div>{SummeryData[key].label}</div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Summery;
