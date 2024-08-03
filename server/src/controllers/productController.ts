import { Request, Response } from "express";
import Product from "../models/Products";
import { renameSync } from "fs";
import path from "path";
import { validationResult } from "express-validator";

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const addProduct = async (req: Request, res: Response) => {
  const { title, description, price } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const originalFileName = req.file?.originalname || "";
  const fileExtension = path.extname(originalFileName);
  const date = new Date();
  const timestamp = date.getTime();
  const newFileName = `uploads/${timestamp}${fileExtension}`;
  try {
    renameSync(req.file?.path || "", newFileName);
  } catch (error) {
    return res.status(500).json({ error: "Error renaming file" });
  }

  try {
    const product = new Product({
      title,
      description,
      price,
      image: newFileName,
    });
    await product.save();

    res.status(201).json({ message: "Product added successfully" });
  } catch (error) {
    res.status(500).json({ error });
  }
};