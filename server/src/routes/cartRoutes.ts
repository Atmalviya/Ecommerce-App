import { Router } from 'express';
import { addToCart, viewCart } from '../controllers/cartController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.post('/add', authMiddleware, addToCart);
router.get('/view', authMiddleware, viewCart);

export default router;
