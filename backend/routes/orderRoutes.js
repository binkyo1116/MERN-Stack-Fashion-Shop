import express from 'express';
const router = express.Router();
import {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getOrders,
  updateOrderToDelivered,
} from '../controllers/orderControllers.js';
import { protect, checkAdmin } from '../middlewares/authMiddleware.js';

router.route('/myorders').get(protect, getMyOrders);
router
  .route('/')
  .post(protect, addOrderItems)
  .get(protect, checkAdmin, getOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/deliver').put(protect, checkAdmin, updateOrderToDelivered);

export default router;
