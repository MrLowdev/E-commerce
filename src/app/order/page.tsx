import { getCurrentUser } from "@/actions/getCurrentUser";
import getOrderByUserId from "@/actions/getOrderByUserId";
import Container from "@/components/Container";
import NullData from "@/components/NullData";
import OrdersClient from "@/components/order/OrdersClient";
import React from "react";

const Orders = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return <NullData title="Oops! Access Denied" />;
  }

  const orders = await getOrderByUserId(currentUser.id);

  if (!orders) {
    return <NullData title="Oops! Not order found" />;
  }
  return (
    <Container>
      <OrdersClient orders={orders} />
    </Container>
  );
};

export default Orders;
