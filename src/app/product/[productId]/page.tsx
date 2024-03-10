import { getCurrentUser } from "@/actions/getCurrentUser";
import getProductById from "@/actions/getProductById";
import Container from "@/components/Container";
import NullData from "@/components/NullData";
import AddRating from "@/components/products/AddRating";
import ListRating from "@/components/products/ListRating";
import ProductDetails from "@/components/products/ProductDetails";

interface IParams {
  productId?: string;
}

const Product = async ({ params }: { params: IParams }) => {
  const product = await getProductById(params);
  const user = await getCurrentUser();
  if (!product) {
    return <NullData title="Oops Product not found" />;
  }

  return (
    <div className="p-8">
      <Container>
        <ProductDetails product={product} />
        <div className="flex flex-col mt-20 gap-4">
          <AddRating product={product} user={user} />
          <ListRating product={product} />
        </div>
      </Container>
    </div>
  );
};

export default Product;
