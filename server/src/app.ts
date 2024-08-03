import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {connectDB} from "./DB/dbConn";
import authRoutes from "./routes/authRoutes";
import cartRoutes from './routes/cartRoutes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
connectDB();
const PORT = process.env.PORT || 5000;

app.use("/api/auth", authRoutes);
app.use('/api/cart', cartRoutes);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



