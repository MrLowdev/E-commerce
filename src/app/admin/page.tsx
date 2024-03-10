import getOrders from "@/actions/getOrder";
import getProducts from "@/actions/getProducts";
import getUsers from "@/actions/getUsers";
import Container from "@/components/Container";
import BarGraph from "@/components/admin/BarGraph";
import Summery from "@/components/admin/Summery";
import GetGraphData from "@/utils/getGraphData";
import React from "react";

const Admin = async () => {
  const products = await getProducts({ category: null });
  const user = await getUsers();
  const orders = await getOrders();

  const graphData = await GetGraphData();

  return (
    <div className="pt-8">
      <Container>
        <Summery orders={orders} products={products} users={user} />
        <div className="mt-4 mx-auto max-w-[1150px]">
          <BarGraph data={graphData} />
        </div>
      </Container>
    </div>
  );
};

export default Admin;
