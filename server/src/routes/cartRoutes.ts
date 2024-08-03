import { Router } from 'express';
import { addToCart, checkoutCart, viewCart } from '../controllers/cartController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.post('/add', authMiddleware, addToCart);
router.get('/view', authMiddleware, viewCart);
router.post('/checkout', authMiddleware, checkoutCart);

export default router;
