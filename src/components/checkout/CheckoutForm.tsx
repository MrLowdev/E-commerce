"use client";

import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/utils/formatPrice";
import {
  AddressElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Heading from "../Heading";
import Button from "../Button";
interface CheckoutFormProps {
  clientSecret: string;
  handlePaymentSuccess: (value: boolean) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  clientSecret,
  handlePaymentSuccess,
}) => {
  const { cartTotalAmount, handleClearCart, handleEShopPaymentIntent } =
    useCart();
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setLoading] = useState(false);
  const formattedPrice = formatPrice(cartTotalAmount);

  useEffect(() => {
    if (!stripe) {
      return;
    }
    if (!clientSecret) {
      return;
    }
    handlePaymentSuccess(false);
  }, [clientSecret, handlePaymentSuccess, stripe]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!elements || !stripe) {
      return;
    }
    setLoading(true);
    stripe
      .confirmPayment({
        elements,
        redirect: "if_required",
      })
      .then((result) => {
        console.log(result);
        if (!result.error) {
          toast.success("checkout success");

          handleClearCart();
          handlePaymentSuccess(true);
          handleEShopPaymentIntent(null);
        }
        setLoading(false);
      });
  };
  return (
    <form onSubmit={handleSubmit} id="payment-form">
      <div className="mb-6">
        <Heading title="Enter your details to complete checkout" />
      </div>{" "}
      <h2 className="font-semibold mb-2">Address information</h2>
      <AddressElement
        options={{
          mode: "shipping",
          allowedCountries: ["IN"],
        }}
      />
      <h2 className="font-semibold mt-4 mb-2">Payment Information</h2>
      <PaymentElement id="payment-element" options={{ layout: "tabs" }} />
      <div className="py-4 text-center text-2xl text-slate-700 font-bold">
        Total:{formattedPrice}
      </div>
      <Button
        label={isLoading ? "Processing.." : "Checkout"}
        disabled={!stripe || isLoading || !elements}
        onClick={() => {}}
      />
    </form>
  );
};

export default CheckoutForm;
