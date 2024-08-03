import { Router } from "express";
import * as expressValidator from "express-validator";
import { getProducts } from "../controllers/productController";

const { body } = expressValidator;
const router = Router();

router.get("/all", getProducts);

export default router;
