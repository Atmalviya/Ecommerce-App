import { Request, Response } from 'express';
import Cart from '../models/Cart';
import Product from '../models/Products';

export const addToCart = async (req: Request, res: Response) => {
  const { productId, quantity } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    let cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) {
      cart = new Cart({ user: req.user.userId, products: [], shippingAddress: 'New Market' });
    }

    const existingProduct = cart.products.find(p => p.product.equals(productId));

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }

    await cart.save();
    res.json({ message: 'Product added to cart' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const viewCart = async (req: Request, res: Response) => {
  try {
    const cart = await Cart.findOne({ user: req.user.userId }).populate('products.product');
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const checkoutCart = async (req: Request, res: Response) => {
  const { shippingAddress } = req.body;

  try {
    const cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    cart.shippingAddress = shippingAddress;
    await cart.save();

    cart.products = [];
    await cart.save();


    res.json({ message: 'Checkout successful' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};