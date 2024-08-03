import React, { useEffect, useState } from 'react';
import API from '../services/api';

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  image: string;
}

interface Cart {
  products: { product: Product, quantity: number }[];
}

const CartPage: React.FC = () => {
  const [cart, setCart] = useState<Cart | null>(null);

  useEffect(() => {
    const fetchCart = async () => {
      const { data } = await API.get('/cart/view');
      setCart(data);
    };
    fetchCart();
  }, []);

  const handleCheckout = async () => {
    const shippingAddress = prompt('Enter your shipping address:');
    if (!shippingAddress) return;

    try {
      await API.post('/cart/checkout', { shippingAddress });
      setCart(null);
      alert('Checkout successful');
    } catch (error) {
      alert('Checkout failed');
    }
  };

  if (!cart) return <div>Loading...</div>;

  return (
    <div>
      <h2>Cart</h2>
      {cart.products.map(({ product, quantity }) => (
        <div key={product._id}>
          <h3>{product.title}</h3>
          <p>${product.price}</p>
          <p>Quantity: {quantity}</p>
        </div>
      ))}
      {cart.products.length > 0 && <button onClick={handleCheckout}>Checkout</button>}
    </div>
  );
};

export default CartPage;
