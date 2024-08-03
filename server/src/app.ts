import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {connectDB} from "./DB/dbConn";
import authRoutes from "./routes/authRoutes";
import cartRoutes from './routes/cartRoutes';
import productRoutes from './routes/productRoutes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
connectDB();
const PORT = process.env.PORT || 5000;

app.use('/uploads', express.static('uploads'));
app.use("/api/auth", authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/products', productRoutes);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



