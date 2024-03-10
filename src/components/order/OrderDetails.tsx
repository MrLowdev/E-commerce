"use client";

import { Order } from "@prisma/client";
import { useRouter } from "next/navigation";
import Heading from "../Heading";
import { formatPrice } from "@/utils/formatPrice";
import Status from "../Status";
import { MdAccessTimeFilled, MdDeliveryDining, MdDone } from "react-icons/md";
import moment from "moment";
import OrderItem from "./OrderItem";

interface OrderDetailsProps {
  orders: Order | null;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ orders }) => {
  if (orders === null) {
    throw new Error("Something break");
  }
  return (
    <div className="max-w-[1150px] m-auto  flex flex-col gap-2">
      <div className="">
        <Heading title="Order Details" />
      </div>
      <div className="">Order ID:{orders?.id}d</div>
      <div>
        Total Amount:
        <span className="font-bold">{formatPrice(orders?.amount!)}</span>
      </div>
      <div>
        <div>Payment status:</div>
        <div className="flex gap-2 items-center">
          {orders?.status === "pending" ? (
            <Status
              text="Pending"
              bg="bg-slate-200"
              color="text-slate-700"
              icon={MdAccessTimeFilled}
            />
          ) : orders?.status === "complete" ? (
            <Status
              text="Delivered"
              bg="bg-green-200"
              color="text-green-700"
              icon={MdDone}
            />
          ) : (
            <></>
          )}
        </div>
      </div>
      <div>
        <div>Delivery status:</div>
        <div className="flex gap-2 items-center">
          {orders.deliveryStatus === "pending" ? (
            <Status
              text="Pending"
              bg="bg-slate-200"
              color="text-slate-700"
              icon={MdAccessTimeFilled}
            />
          ) : orders.deliveryStatus === "dispatched" ? (
            <Status
              text="Dispatch"
              bg="bg-purple-200"
              color="text-purple-700"
              icon={MdDeliveryDining}
            />
          ) : orders.deliveryStatus === "delivered" ? (
            <Status
              text="Delivered"
              bg="bg-green-200"
              color="text-green-700"
              icon={MdDone}
            />
          ) : (
            <></>
          )}
        </div>
      </div>
      <div>Date:{moment(orders.createdDate).fromNow()}</div>
      <div>
        <h2 className="font-semibold mt-4 mb-2">Product ordered</h2>
        <div className="grid grid-cols-5 text-xs gap-4 pb-2 items-center">
          <div className="col-span-2 justify-self-start">PRODUCT</div>
          <div className=" justify-self-center">PRICE</div>
          <div className="justify-self-center">QTY</div>
          <div className=" justify-self-end">TOTAL</div>
        </div>
        {orders.products.map((item) => {
          return <OrderItem key={orders.id} item={item} />;
        })}
      </div>
    </div>
  );
};

export default OrderDetails;
