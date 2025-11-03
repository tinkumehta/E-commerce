import { Router } from "express";
import {
    createOrder,
    createPaymentLink,
    createTestPayment,
    getOrderDetails,
    testPaymentVerification,
    verifyPayment,
    
} from '../controllers/payment.controllers.js'
import { protect } from "../middleware/auth.js";

 const router = Router();

 router.route('/create-order').post(protect, createOrder);
 router.route('/verify').post(protect, verifyPayment);
 
 router.route('/create-test-payment').post(protect, createTestPayment);
 router.route('/create-payment-link').post(protect, createPaymentLink);

 router.route("/v").post(protect, testPaymentVerification);

 export default router;