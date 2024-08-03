import React, { useEffect, useState } from 'react';
import API from '../services/api';

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  image: string;
}

const ProductListPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await API.get('/products/all');
      setProducts(data);
    };
    fetchProducts();
  }, []);

  const addToCart = (product: Product) => {
    setCart([...cart, product]);
  };

  const handleCheckout = async () => {
    const shippingAddress = prompt('Enter your shipping address:');
    if (!shippingAddress) return;

    try {
      await API.post('/cart/checkout', { shippingAddress });
      setCart([]);
      alert('Checkout successful');
    } catch (error) {
      alert('Checkout failed');
    }
  };

  return (
    <div>
      <h2>Products</h2>
      <div>
        {products.map((product) => (
          <div key={product._id}>
            <h3>{product.title}</h3>
            <p>{product.description}</p>
            <p>${product.price}</p>
            <img src={`http://localhost:5000/${product.image}`} alt={product.title} />
            <button onClick={() => addToCart(product)}>Add to Cart</button>
          </div>
        ))}
      </div>
      <div>
        <h2>Cart</h2>
        {cart.map((product) => (
          <div key={product._id}>
            <h3>{product.title}</h3>
            <p>${product.price}</p>
          </div>
        ))}
        {cart.length > 0 && <button onClick={handleCheckout}>Checkout</button>}
      </div>
    </div>
  );
};

export default ProductListPage;
