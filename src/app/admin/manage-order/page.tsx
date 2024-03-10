import { getCurrentUser } from "@/actions/getCurrentUser";
import getOrders from "@/actions/getOrder";
import Container from "@/components/Container";
import NullData from "@/components/NullData";
import ManageOrdersClient from "@/components/admin/Manage-order/ManageOrdersClient";

const ManageOrders = async () => {
  const orders = await getOrders();
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "ADMIN") {
    return <NullData title="Oops! Access Denied" />;
  }
  return (
    <Container>
      <ManageOrdersClient orders={orders} />
    </Container>
  );
};

export default ManageOrders;
