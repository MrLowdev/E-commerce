/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useCart } from "@/hooks/useCart";
import { SafeUser } from "@/types";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { StripeElementsOptions, loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import Button from "../Button";
interface CheckoutClientProps {
  currentUser: SafeUser | null;
  PublicKey: string;
}

const CheckoutClient: React.FC<CheckoutClientProps> = ({
  currentUser,
  PublicKey,
}) => {
  const stripePromise = loadStripe(PublicKey);
  const router = useRouter();
  const { cartProducts, paymentIntent, handleEShopPaymentIntent } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [clientSecret, setClientSecret] = useState<string>("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      router.push("/login");
      router.refresh();
    }
    if (cartProducts) {
      setLoading(true);
      setError(false);
      fetch("/api/create_payment_intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartProducts,
          payment_intent_id: paymentIntent,
        }),
      })
        .then((res) => {
          setLoading(false);
          if (res.status === 401) {
            router.push("/login");
          }
          return res.json();
        })
        .then((data) => {
          setClientSecret(data.paymentIntent.client_secret);
          handleEShopPaymentIntent(data.paymentIntent.id);
        })
        .catch((error) => {
          setError(true);
          toast.error("Something went wrong");
        });
    }
  }, [cartProducts, paymentIntent]);

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: "stripe",
      labels: "floating",
    },
  };
  const handlePaymentSuccess = useCallback((value: boolean) => {
    setPaymentSuccess(value);
  }, []);

  return (
    <div className="w-full">
      {clientSecret && cartProducts && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm
            clientSecret={clientSecret}
            handlePaymentSuccess={handlePaymentSuccess}
          />
        </Elements>
      )}
      {loading && <div className="text-center">Loading checkout</div>}
      {error && (
        <div className="text-center text-rose-500">Something went wrong</div>
      )}
      {paymentSuccess && (
        <div className="flex flex-col items-center gap-4">
          <div className="text-teal-500 text-center">Payment Success</div>
          <div className="max-w-[220px] w-full">
            <Button
              label="View Your Order"
              onClick={() => router.push("/order")}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutClient;
