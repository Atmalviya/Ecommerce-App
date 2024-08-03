import { Router } from 'express';
import { addToCart, checkoutCart, removeProductFromCart, updateProductQuantity, viewCart } from '../controllers/cartController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.post('/add', authMiddleware, addToCart);
router.get('/view', authMiddleware, viewCart);
router.post('/checkout', authMiddleware, checkoutCart);
router.post('/update-quantity', authMiddleware, updateProductQuantity);
router.post('/remove', authMiddleware, removeProductFromCart);

export default router;
