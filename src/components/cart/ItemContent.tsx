"use client";

import { formatPrice } from "@/utils/formatPrice";
import { CartProductType } from "../products/ProductDetails";
import Link from "next/link";
import { truncateText } from "@/utils/truncateText";
import Image from "next/image";
import SetQuantity from "../products/SetQuantity";
import { useCart } from "@/hooks/useCart";

interface ItemContentProps {
  cartProduct: CartProductType;
}

const ItemContent: React.FC<ItemContentProps> = ({ cartProduct }) => {
  const { handleRemoveProductToCart, handleQtyDecrease, handleQtyIncrease } =
    useCart();
  return (
    <div className="grid grid-cols-5 text-xs md:text-sm border-t-[1.5px] border-slate-200 py-4 items-center">
      <div className="col-span-2 justify-self-start flex gap-2 md:gap-4">
        <Link href={`/product/${cartProduct.id}`}>
          <div className="relative w-[70px] aspect-square">
            <Image
              fill
              className="object-contain"
              alt={cartProduct.name}
              src={cartProduct.selectedImg.image}
            />
          </div>
        </Link>
        <div className="flex flex-col justify-between">
          <Link href={`/product/${cartProduct.id}`}>
            {truncateText(cartProduct.name)}
          </Link>
          <div>{cartProduct.selectedImg.color}</div>
          <div className="w-[70px]">
            <button
              className="text-slate-500 underline"
              onClick={() => {
                handleRemoveProductToCart(cartProduct);
              }}
            >
              Remove
            </button>
          </div>
        </div>
      </div>
      <div className="justify-self-center">
        {formatPrice(cartProduct.price)}
      </div>
      <div className="justify-self-center">
        <SetQuantity
          cartProduct={cartProduct}
          cartCounter={true}
          handleQtyDecrease={() => {
            handleQtyDecrease(cartProduct);
          }}
          handleQtyIncrease={() => {
            handleQtyIncrease(cartProduct);
          }}
        />
      </div>
      <div className="justify-self-end font-semibold">
        {formatPrice(cartProduct.price * cartProduct.Quantity)}
      </div>
    </div>
  );
};

export default ItemContent;
