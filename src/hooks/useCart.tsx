import { CartProductType } from "@/components/products/ProductDetails";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type cartContextType = {
  cartTotalQty: number;
  cartTotalAmount: number;
  cartProducts: CartProductType[] | null;
  handleAddProductToCart: (product: CartProductType) => void;
  handleRemoveProductToCart: (product: CartProductType) => void;
  handleQtyDecrease: (product: CartProductType) => void;
  handleQtyIncrease: (product: CartProductType) => void;
  handleClearCart: () => void;
};

export const CartContext = createContext<cartContextType | null>(null);

interface Props {
  [propName: string]: any;
}

export const CartContextProvider = (props: Props) => {
  const [cartTotalQty, setCartTotalQty] = useState(0);
  const [cartProducts, setCartProducts] = useState<CartProductType[] | null>(
    null
  );
  const [cartTotalAmount, setCartTotalAmount] = useState(0);

  useEffect(() => {
    const cartItem: any = localStorage.getItem("eShopCartItem");
    const cProducts: CartProductType[] | null = JSON.parse(cartItem);
    setCartProducts(cProducts);
  }, []);

  useEffect(() => {
    const getTotal = () => {
      if (cartProducts) {
        const { qty, total } = cartProducts?.reduce(
          (acc, item) => {
            const itemTotal = item.price * item.Quantity;
            acc.total += itemTotal;
            acc.qty += item.Quantity;
            return acc;
          },
          { total: 0, qty: 0 }
        );
        setCartTotalQty(qty);
        setCartTotalAmount(total);
      }
    };
    getTotal();
  }, [cartProducts]);

  const handleAddProductToCart = useCallback((product: CartProductType) => {
    setCartProducts((prev) => {
      let updateCart;
      if (prev) {
        updateCart = [...prev, product];
      } else {
        updateCart = [product];
      }
      localStorage.setItem("eShopCartItem", JSON.stringify(updateCart));

      return updateCart;
    });
  }, []);

  const handleRemoveProductToCart = useCallback(
    (product: CartProductType) => {
      if (cartProducts) {
        const filteredProducts = cartProducts?.filter((item) => {
          return item.id !== product.id;
        });

        setCartProducts(filteredProducts);

        localStorage.setItem("eShopCartItem", JSON.stringify(filteredProducts));
      }
    },
    [cartProducts]
  );

  const handleQtyIncrease = useCallback((product: CartProductType) => {
    setCartProducts((prev) => {
      if (!prev) return prev;
      const updatedCart = prev.map((item) =>
        item.id === product.id && item.Quantity < 20
          ? { ...item, Quantity: item.Quantity + 1 }
          : item
      );
      localStorage.setItem("eShopCartItem", JSON.stringify(updatedCart));
      return updatedCart;
    });
  }, []);

  const handleQtyDecrease = useCallback((product: CartProductType) => {
    setCartProducts((prev) => {
      if (!prev) return prev;
      const updatedCart = prev.map((item) =>
        item.id === product.id && item.Quantity > 1
          ? { ...item, Quantity: item.Quantity - 1 }
          : item
      );
      localStorage.setItem("eShopCartItem", JSON.stringify(updatedCart));
      return updatedCart;
    });
  }, []);

  const handleClearCart = useCallback(() => {
    setCartProducts(null);
    setCartTotalQty(0);
    localStorage.setItem("eShopCartItem", JSON.stringify(null));
  }, []);

  const value = {
    cartTotalQty,
    cartProducts,
    handleAddProductToCart,
    handleRemoveProductToCart,
    handleQtyDecrease,
    handleQtyIncrease,
    handleClearCart,
    cartTotalAmount,
  };
  return <CartContext.Provider value={value} {...props} />;
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (context === null) {
    throw new Error("useContext must be used in a CartContextProvider");
  }

  return context;
};
