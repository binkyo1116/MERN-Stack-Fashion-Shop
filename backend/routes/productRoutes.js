import express from 'express';
import {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
  getLatestProducts,
  getSaleProducts,
  getRelatedProducts,
  getSortByPriceProducts,
} from '../controllers/productController.js';
import { protect, checkAdmin } from '../middlewares/authMiddleware.js';
const router = express.Router();

router.route('/').get(getProducts).post(protect, checkAdmin, createProduct);
router.route('/:id/reviews').post(protect, createProductReview);
router.get('/top', getTopProducts);
router.get('/latest', getLatestProducts);
router.get('/sale', getSaleProducts);
router.get('/related', getRelatedProducts);
router.get('/price', getSortByPriceProducts);
router
  .route('/:id')
  .get(getProductById)
  .delete(protect, checkAdmin, deleteProduct)
  .put(protect, checkAdmin, updateProduct);

export default router;
