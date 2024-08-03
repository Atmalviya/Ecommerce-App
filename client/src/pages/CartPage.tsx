import React, { useEffect, useState } from 'react';
import {API} from '../services/api';
import { Button } from '@/components/ui/button';

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  image: string;
}

interface Cart {
  products: { product: Product; quantity: number }[];
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
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Cart</h2>
      {cart.products.map(({ product, quantity }) => (
        <div key={product._id} className="border p-2 mb-2">
          <h3 className="text-lg font-semibold">{product.title}</h3>
          <p>Price: ${product.price}</p>
          <p>Quantity: {quantity}</p>
        </div>
      ))}
      {cart.products.length > 0 && (
        <Button className="mt-4" onClick={handleCheckout}>
          Checkout
        </Button>
      )}
    </div>
  );
};

export default CartPage;
