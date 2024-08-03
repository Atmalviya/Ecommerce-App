import React, { useEffect, useState } from "react";
import { API} from "../services/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { CiShoppingCart } from "react-icons/ci";
import { RiLogoutBoxRLine } from "react-icons/ri";

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  image: string;
}

const ProductListPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await API.get("/products/all");
      setProducts(data);
      const initialQuantities: { [key: string]: number } = {};
      data.forEach((product: Product) => {
        initialQuantities[product._id] = 1;
      });
      setQuantities(initialQuantities);
    };

    fetchProducts();
  }, []);

  const handleQuantityChange = (productId: string, increment: boolean) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: Math.max(
        1,
        (prevQuantities[productId] || 1) + (increment ? 1 : -1)
      ),
    }));
  };

  const addToCart = async (product: Product) => {
    const quantity = quantities[product._id] || 1;
    try {
      const res = await API.post("/cart/add", {
        productId: product._id,
        quantity,
      });
      //   setCart([...cart, { product, quantity }]);
      toast.success(res.data.message);
    } catch (error) {
      alert("Failed to add item to cart");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold mb-4">Products</h2>
        <div className="flex gap-5">
          <Link to="/cart">
            <Button variant="outline">
              Got to Cart <CiShoppingCart size={20} className="ml-2" />
            </Button>
          </Link>
        </div>
      </div>
      <div className="flex flex-wrap -mx-4">
        {products.map((product) => (
          <div key={product._id} className="w-full sm:w-1/2 lg:w-1/4 px-4 mb-8">
            <Card className="border border-gray-300 rounded-lg shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  {product.title}
                </CardTitle>
                <CardDescription className="text-sm text-gray-500">
                  {product.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <img
                  src={`http://localhost:5000/${product.image}`}
                  alt={product.title}
                  className="w-full h-auto"
                />
                <div className="flex items-center mt-2">
                  <span>Quantity: </span>
                  <Button
                    className="mr-2 bg-[#00071387] h-7 w-7"
                    onClick={() => handleQuantityChange(product._id, false)}
                  >
                    -
                  </Button>
                  {quantities[product._id]}
                  <Button
                    className="ml-2 bg-[#00071387] h-7 w-7"
                    onClick={() => handleQuantityChange(product._id, true)}
                  >
                    +
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <p className="text-lg font-bold">${product.price}</p>
                <Button onClick={() => addToCart(product)}>Add to Cart</Button>
              </CardFooter>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductListPage;
