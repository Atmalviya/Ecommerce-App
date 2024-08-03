import { useEffect, useState } from "react";
import { API, Logout, HOST } from "../services/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { CiShoppingCart } from "react-icons/ci";
import { RiLogoutBoxRLine } from "react-icons/ri";

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await API.get("/products/all");
        setProducts(data);
        const initialQuantities = {};
        data.forEach((product) => {
          initialQuantities[product._id] = 1;
        });
        setQuantities(initialQuantities);
      } catch (error) {
        toast.error("Failed to fetch products.");
      }
    };

    fetchProducts();
  }, []);

  const handleQuantityChange = (productId, increment) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: Math.max(
        1,
        (prevQuantities[productId] || 1) + (increment ? 1 : -1)
      ),
    }));
  };

  const addToCart = async (product) => {
    const quantity = quantities[product._id] || 1;
    try {
      const res = await API.post("/cart/add", {
        productId: product._id,
        quantity,
      });
      toast.success(res.data.message);
    } catch (error) {
      toast.error("Failed to add item to cart.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold mb-4">Products</h2>
        <div className="flex gap-5">
          <Link to="/cart">
            <Button variant="outline">
              Go to Cart <CiShoppingCart size={20} className="ml-2" />
            </Button>
          </Link>
          <Button variant="outline" onClick={Logout}>
            <RiLogoutBoxRLine />
          </Button>
        </div>
      </div>
      <div className="flex flex-wrap -mx-4">
        {products.map((product) => (
          <div key={product._id} className="w-full sm:w-1/2 lg:w-1/4 px-4 mb-8">
            <Card className="border border-gray-300 rounded-lg shadow-lg h-full flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  {product.title}
                </CardTitle>
                <CardDescription className="text-sm text-gray-500">
                  {product.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="h-48 overflow-hidden">
                  <img
                    src={`${HOST}/${product.image}`}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </div>
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
              <CardFooter className="flex justify-between items-center mt-auto">
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
