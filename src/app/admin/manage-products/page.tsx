import { getCurrentUser } from "@/actions/getCurrentUser";
import getProducts from "@/actions/getProducts";
import Container from "@/components/Container";
import NullData from "@/components/NullData";
import ManageProductsClient from "@/components/admin/Manage-products/ManageProductsClient";

const ManageProducts = async () => {
  const products = await getProducts({ category: null });
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "ADMIN") {
    return <NullData title="Oops! Access Denied" />;
  }
  return (
    <Container>
      <ManageProductsClient products={products} />
    </Container>
  );
};

export default ManageProducts;
