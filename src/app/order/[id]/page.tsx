import getOrderById from "@/actions/getOrderById";
import Container from "@/components/Container";
import OrderDetails from "@/components/order/OrderDetails";
import ListRating from "@/components/products/ListRating";

interface IParams {
  id?: string;
}

const Order = async ({ params }: { params: IParams }) => {
  const orders = await getOrderById(params);
  return (
    <div className="p-8">
      <Container>
        <OrderDetails orders={orders} />
      </Container>
    </div>
  );
};

export default Order;
