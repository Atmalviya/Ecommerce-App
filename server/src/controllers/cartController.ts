import { Request, Response } from "express";
import Cart from "../models/Cart";
import Product from "../models/Products";
import { sendEmail } from "../controllers/mailController";
import User from "../models/User";

export const addToCart = async (req: Request, res: Response) => {
  const { productId, quantity } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: "Product not found" });

    let cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) {
      cart = new Cart({
        user: req.user.userId,
        products: [],
        shippingAddress: "New Market",
      });
    }

    const existingProduct = cart.products.find((p) =>
      p.product.equals(productId)
    );

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }

    await cart.save();
    res.json({ message: "Product added to cart" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const viewCart = async (req: Request, res: Response) => {
  try {
    const cart = await Cart.findOne({ user: req.user.userId }).populate(
      "products.product"
    );
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const checkoutCart = async (req: Request, res: Response) => {
  const { shippingAddress } = req.body;

  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.shippingAddress = shippingAddress;
    await cart.save();

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (!user.email) {
      return res.status(400).json({ error: "User email not found" });
    }
    cart.products = [];
    await cart.save();

    const mailer = await sendEmail({
      to: user.email,
      subject: "Order Confirmation",
      text: `Your order has been placed successfully. Your order will be delivered soon to ${shippingAddress}. Thank you for shopping with us.`,
    });


    res.json({ message: "Checkout successful" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const updateProductQuantity = async (req: Request, res: Response) => {
  const { productId, quantity } = req.body;

  try {
    console.log(req.user)
    const cart = await Cart.findOne({ user: req.user.userId });
    console.log(cart)
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    const product = cart.products.find((p) => p.product.equals(productId));
    if (!product)
      return res.status(404).json({ error: "Product not found in cart" });

    product.quantity = quantity;
    await cart.save();

    res.json({ message: "Product quantity updated" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const removeProductFromCart = async (req: Request, res: Response) => {
  const { productId } = req.body;

  try {
    const cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.products = cart.products.filter((p) => !p.product.equals(productId));
    await cart.save();

    res.json({ message: "Product removed from cart" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
