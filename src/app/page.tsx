import getProducts, { IProductsParams } from "@/actions/getProducts";
import Container from "@/components/Container";
import HomeBanner from "@/components/HomeBanner";
import NullData from "@/components/NullData";
import ProductCart from "@/components/products/ProductCart";

export const dynamic = "force-dynamic";

interface HomeProps {
  searchParams: IProductsParams;
}

export default async function Home({ searchParams }: HomeProps) {
  const products = await getProducts(searchParams);

  if (products.length === 0) {
    return <NullData title="Oops! product not found 'clear all filters" />;
  }

  function shuffleArray(array: any) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  const shuffleProducts = shuffleArray(products);
  return (
    <div className="p-8">
      <Container>
        <div>
          <HomeBanner />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
          {shuffleProducts.map((product: any) => (
            <ProductCart key={product.id} data={product} />
          ))}
        </div>
      </Container>
    </div>
  );
}
