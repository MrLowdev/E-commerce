import { getCurrentUser } from "@/actions/getCurrentUser";
import Container from "@/components/Container";
import FormWrap from "@/components/FormWrap";
import CheckoutClient from "@/components/checkout/CheckoutClient";
import React from "react";

const Checkout = async () => {
  const currentUser = await getCurrentUser();
  return (
    <div className="p-8 ">
      <Container>
        <FormWrap>
          <CheckoutClient
            currentUser={currentUser}
            PublicKey={process.env.STRIPE_PUBLIC_KEY as string}
          />
        </FormWrap>
      </Container>
    </div>
  );
};

export default Checkout;
