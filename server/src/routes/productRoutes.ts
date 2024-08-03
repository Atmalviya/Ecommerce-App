import { Router } from "express";
import * as expressValidator from "express-validator";
import { addProduct, deleteProduct, getProducts } from "../controllers/productController";
import { authMiddleware } from "../middlewares/authMiddleware";
import multer from "multer";
import { adminAuthMiddleware } from "../middlewares/adminAuthMiddleware";

const { body } = expressValidator;
const router = Router();
const upload = multer({ dest: "uploads/" });

router.post(
    "/add",
    authMiddleware,
    upload.single("image"),
    body("title").notEmpty().withMessage("Title is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("price").isNumeric().withMessage("Price must be a number"),
    addProduct
  );

router.get("/all", getProducts);
router.get("/admin", adminAuthMiddleware, (req, res) => {
  res.status(200).json({ admin: "true" });
});
router.delete("/delete/:productId", authMiddleware, deleteProduct);
export default router;
