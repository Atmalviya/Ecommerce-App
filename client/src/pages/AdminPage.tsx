import React, { useState, useEffect } from "react";
import { API } from "../services/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { CiShoppingCart } from "react-icons/ci";
import { FaTrash } from "react-icons/fa";

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  image: string;
}

const AdminPage: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await API.get("/products/all");
        setProducts(data);
      } catch (error) {
        toast.error("Failed to fetch products.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price.toString());
    if (image) formData.append("image", image);

    try {
      const res = await API.post("/products/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(res.data.message);
      setTitle("");
      setDescription("");
      setPrice(0);
      setImage(null);
      setImagePreview(null);
      // Refresh the product list after adding a new product
      const { data } = await API.get("/products/all");
      setProducts(data);
    } catch (error) {
      toast.error("Failed to add product.");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };



  return (
    <div className="container mx-auto p-4 flex">
      <div className="w-full md:w-1/4 p-4 border border-gray-300 rounded-lg shadow-lg">
        <h3 className="text-xl font-bold mb-4">All Products</h3>
        {loading ? (
          <p>Loading...</p>
        ) : products.length === 0 ? (
          <p>No products available.</p>
        ) : (
          <ul>
            {products.map((product) => (
              <li key={product._id} className="flex items-center justify-between mb-4">
                <span>{product.title}</span>
                <button
                  className="text-red-500 hover:text-red-700 transition duration-200"
                >
                  <FaTrash size={20} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="w-full md:w-3/4 p-4">
        <div className="flex justify-between mb-4">
          <h2 className="text-2xl font-bold">Admin Page</h2>
          <div className="flex gap-5">
            <Link to="/products">
              <Button variant="outline">
                View All Products <CiShoppingCart size={20} className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
        <form onSubmit={handleAddProduct} className="w-full md:w-1/2 p-4 border border-gray-300 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Product Title:</label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter Product Title"
              className="w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Description:</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter Product Description"
              className="w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Price:</label>
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value))}
              placeholder="Enter Product Price"
              className="w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Image:</label>
            <Input
              type="file"
              onChange={handleImageChange}
              className="w-full"
              required
              name="image"
            />
          </div>
          <Button type="submit" className="mt-4 bg-blue-500 text-white">
            Add Product
          </Button>
        </form>
        <div className="mt-8 w-full md:w-1/2 p-4 border border-gray-300 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-4">Product Preview</h3>
          <div className="mb-4 w-full h-64 flex justify-center items-center">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Product Preview"
                className="object-cover w-full h-full max-w-xs max-h-64"
              />
            ) : (
              <p>No image selected</p>
            )}
          </div>
          <div className="mb-4">
            <p className="font-semibold">Title:</p>
            <p>{title || "No title provided"}</p>
          </div>
          <div className="mb-4">
            <p className="font-semibold">Description:</p>
            <p>{description || "No description provided"}</p>
          </div>
          <div className="mb-4">
            <p className="font-semibold">Price:</p>
            <p>${price.toFixed(2) || "0.00"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
