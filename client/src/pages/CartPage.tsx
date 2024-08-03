import React, { useEffect, useState } from "react";
import { API, Logout, HOST } from "../services/api";
import { FaTrash } from "react-icons/fa";
import { CiShoppingCart } from "react-icons/ci";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  image: string;
}

interface CartProduct {
  product: Product;
  quantity: number;
  price: number;
}

interface Cart {
  products: CartProduct[];
}
interface CartResponse {
  products: CartProduct[];
}
interface CheckoutResponse {
  message: string;
  // Add other properties as needed based on the API response
}

const CartPage: React.FC = () => {
  const [shippingAddress, setShippingAddress] = useState<string>("");
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const { data } = await API.get<CartResponse>("/cart/view");
        setCart(data);
      } catch (error) {
        toast.error("Failed to fetch cart items.");
      }
    };
    fetchCart();
  }, []);

  const handleQuantityChange = async (
    productId: string,
    increment: boolean
  ) => {
    try {
      const product = cart?.products.find((p) => p.product._id === productId);
      if (!product) return;

      const newQuantity = increment
        ? product.quantity + 1
        : Math.max(1, product.quantity - 1);
      await API.post("/cart/update-quantity", { productId, quantity: newQuantity });

      setCart((prevCart) => ({
        ...prevCart!,
        products: prevCart!.products.map((p) =>
          p.product._id === productId ? { ...p, quantity: newQuantity } : p
        ),
      }));
    } catch (error) {
      toast.error("Failed to update quantity.");
    }
  };

  const handleRemoveProduct = async (productId: string) => {
    try {
      await API.post("/cart/remove", { productId });

      setCart((prevCart) => ({
        ...prevCart!,
        products: prevCart!.products.filter((p) => p.product._id !== productId),
      }));

      toast.success("Product removed from cart.");
    } catch (error) {
      toast.error("Failed to remove product.");
    }
  };

  const handleCheckout = async () => {
    if (!shippingAddress) {
      toast.error("Please enter a shipping address.");
      return;
    }

    try {
      setIsLoading(true);
      const { data } = await API.post<CheckoutResponse>("/cart/checkout", { shippingAddress });
      toast.success(data.message);
      setCart(null);
      setShippingAddress("");
    } catch (error) {
      toast.error("Failed to place order.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Your Shopping Cart</h2>
        <div className="flex gap-4">
          <Link to="/products">
            <Button variant="outline" className="flex items-center">
              View Products <CiShoppingCart size={20} className="ml-2" />
            </Button>
          </Link>
          <Button variant="outline" className="flex items-center" onClick={Logout}>
            Logout <RiLogoutBoxRLine size={20} className="ml-2" />
          </Button>
        </div>
      </div>

      {cart?.products.length === 0 ? (
        <p className="text-xl">Your cart is empty.</p>
      ) : (
        <div className="flex flex-col md:flex-row justify-between">
          <div className="w-full md:w-2/3">
            {cart?.products.map(({ product, quantity }) => (
              <Card key={product._id} className="mb-4">
                <div className="flex justify-between items-center p-4">
                  <div className="flex items-center">
                    <img
                      src={`${HOST}/${product.image}`}
                      alt={product.title}
                      className="w-32 h-32 object-cover rounded mr-4"
                    />
                    <div className="flex-1">
                      <CardHeader>
                        <CardTitle className="text-lg font-semibold">
                          {product.title}
                        </CardTitle>
                        <CardDescription className="text-sm text-gray-500">
                          {product.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex items-center mt-2">
                        <span className="mr-2">Quantity: </span>
                        <Button
                          variant="outline"
                          className="h-7 w-7 flex items-center justify-center"
                          onClick={() => handleQuantityChange(product._id, false)}
                        >
                          -
                        </Button>
                        <span className="mx-2">{quantity}</span>
                        <Button
                          variant="outline"
                          className="h-7 w-7 flex items-center justify-center"
                          onClick={() => handleQuantityChange(product._id, true)}
                        >
                          +
                        </Button>
                      </CardContent>
                      <CardFooter className="flex justify-between items-center mt-4">
                        <p className="text-lg font-bold">
                          Per item: ${product.price}
                        </p>
                        <p className="text-lg font-bold">
                          Total: ${product.price * quantity}
                        </p>
                      </CardFooter>
                    </div>
                  </div>
                  <button
                    className="text-red-500 hover:text-red-700 transition duration-200"
                    onClick={() => handleRemoveProduct(product._id)}
                  >
                    <FaTrash size={20} />
                  </button>
                </div>
              </Card>
            ))}
          </div>

          <div className="w-full md:w-1/3 mt-6 md:mt-0 md:ml-4">
            <div className="p-4 bg-white border border-gray-300 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-4">Order Summary</h3>
              <ul className="mb-4">
                {cart?.products.map(({ product, quantity }) => (
                  <li key={product._id} className="flex justify-between mb-2">
                    <span>
                      {product.title} x {quantity}
                    </span>
                    <span>${(product.price * quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <p className="text-lg font-bold border-t pt-2">
                Total: $
                {cart?.products
                  .reduce(
                    (total, { product, quantity }) =>
                      total + product.price * quantity,
                    0
                  )
                  .toFixed(2)}
              </p>
              <Input
                placeholder="Enter your shipping address"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                className="my-4"
              />
              <Button
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200 w-full"
                onClick={handleCheckout}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Checkout"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
