import { Router } from "express";
import {
    createReview,
    getProductReviews,
    getTopRatedProducts
} from '../controllers/review.controller.js'
import {protect} from '../middleware/auth.js'

const router = Router();

router.get('/top-rated', getTopRatedProducts)
router.route('/:productId')
      .get(getProductReviews)
      .post(protect, createReview);

export default router;