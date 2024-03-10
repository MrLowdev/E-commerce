"use client";

import { SafeUser } from "@/types";
import { Order, Product, Review } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Heading from "../Heading";
import { Rating } from "@mui/material";
import Input from "../inputs/Input";
import Button from "../Button";
import toast from "react-hot-toast";
import axios from "axios";

interface AddRatingProps {
  product: Product & {
    reviews: Review[];
  };
  user:
    | (SafeUser & {
        orders: Order[];
      })
    | null;
}

const AddRating: React.FC<AddRatingProps> = ({ product, user }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    reset,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm<FieldValues>({
    defaultValues: { rating: 0, comment: "" },
  });

  const SetCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const onSubmitHandle: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);

    if (data.rating === 0) {
      setIsLoading(false);
      return toast.error("Please add rating");
    }

    const ratingData = { ...data, userId: user?.id, product };
    axios
      .post("/api/rating", ratingData)
      .then(() => {
        toast.success("Success");
        router.refresh();
        reset();
      })
      .catch((error) => toast.error("Some thing went wrong"))
      .finally(() => setIsLoading(false));
  };

  if (!user || !product) return null;

  const deliveredOrder = user.orders.some(
    (order) =>
      order.products.find((item) => item.id === product.id) &&
      order.deliveryStatus === "delivered"
  );

  const userReview = product?.reviews.find((review: Review) => {
    return review.userId === user.id;
  });

  if (userReview || !deliveredOrder) {
    return null;
  }
  return (
    <div className="flex flex-col gap-2 max-w-[500px]">
      <Heading title="Rate this product" />
      <Rating
        onChange={(event, newValue) => SetCustomValue("rating", newValue)}
      />
      <Input
        id="comment"
        label="Comment"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />

      <Button
        label={isLoading ? `Loading..` : `Add Rating`}
        onClick={handleSubmit(onSubmitHandle)}
      />
    </div>
  );
};

export default AddRating;
