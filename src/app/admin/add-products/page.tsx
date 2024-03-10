import { getCurrentUser } from "@/actions/getCurrentUser";
import Container from "@/components/Container";
import FormWrap from "@/components/FormWrap";
import NullData from "@/components/NullData";
import AddProductForm from "@/components/admin/AddProductForm";
import React from "react";

const AddProducts = async () => {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== "ADMIN") {
    return <NullData title="Oops! Access Denied" />;
  }
  return (
    <div className="p-8">
      <Container>
        <FormWrap>
          <AddProductForm />
        </FormWrap>
      </Container>
    </div>
  );
};

export default AddProducts;
