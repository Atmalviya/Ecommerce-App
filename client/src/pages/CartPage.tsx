import React, { useEffect, useState } from "react";
import { API } from "../services/api";
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

const CartPage: React.FC = () => {
  const [shippingAddress, setShippingAddress] = useState<string>("");
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const { data } = await API.get("/cart/view");
        setCart(data);
      } catch (error) {
        toast.error("Failed to fetch cart items.");
      }
    };
    fetchCart();
  }, []);

  const handleCheckout = async () => {
    if (!shippingAddress) {
      toast.error("Please enter a shipping address.");
      return;
    }

    try {
      setIsLoading(true);
      const { data } = await API.post("/cart/checkout", { shippingAddress });
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
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Your Shopping Cart</h2>
        <div className="flex gap-4">
          <Link to="/products">
            <Button variant="outline">
              View All Products <CiShoppingCart size={20} className="ml-2" />
            </Button>
          </Link>
        </div>
      </div>
      {cart?.products.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="flex flex-wrap md:flex-nowrap justify-between">
          <div className="w-full md:w-2/3">
            {cart?.products.map(({ product, quantity }) => (
              <Card
                key={product._id}
                className="border border-gray-300 rounded-lg shadow-lg mb-4 p-4"
              >
                <div className="flex justify-between">
                  <div className="flex">
                    <img
                      src={`http://localhost:5000/${product.image}`}
                      alt={product.title}
                      className="w-32 h-32 object-cover mr-4"
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
                      <CardContent>
                        <div className="flex items-center mt-2">
                          <span>Quantity: </span>
                          <Button className="mr-2 bg-[#00071387] h-7 w-7">
                            -
                          </Button>
                          {quantity}
                          <Button className="ml-2 bg-[#00071387] h-7 w-7">
                            +
                          </Button>
                        </div>
                      </CardContent>
                      <CardFooter className="mt-4 flex gap-5">
                        <p className="text-lg font-bold">
                          Per item: ${product.price}
                        </p>
                        <p className="text-lg font-bold">
                          Total: ${product.price * quantity}
                        </p>
                      </CardFooter>
                    </div>
                  </div>
                  <button className="text-red-500 hover:text-red-700 transition duration-200">
                    <FaTrash size={20} />
                  </button>
                </div>
              </Card>
            ))}
          </div>
          <div className="w-full md:w-1/3 mt-4 md:mt-0 md:pl-4">
            <div className="p-4 border border-gray-300 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-2">Order Summary</h3>
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
              <p className="text-lg font-bold border-t py-2">
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
                className="mb-4"
              />
              <Button
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200 w-full"
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
