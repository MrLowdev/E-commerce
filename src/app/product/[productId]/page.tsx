import getProductById from "@/actions/getProductById";
import Container from "@/components/Container";
import NullData from "@/components/NullData";
import ListRating from "@/components/products/ListRating";
import ProductDetails from "@/components/products/ProductDetails";
import { products } from "@/utils/products";

interface IParams {
  productId?: string;
}

const Product = async ({ params }: { params: IParams }) => {
  console.log(params);
  const product = await getProductById(params);

  if (!product) {
    <NullData title="Oops Product not found" />;
  }

  return (
    <div className="p-8">
      <Container>
        {product && <ProductDetails product={product} />}
        <div className="flex flex-col mt-20 gap-4">
          <div>Add Rating</div>
          {product && <ListRating product={product} />}
        </div>
      </Container>
    </div>
  );
};

export default Product;
