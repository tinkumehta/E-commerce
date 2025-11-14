import {Router} from 'express';
import { 
    createOrder, 
    createTestPayment, 
    getOrderById, 
    getOrderDetails, 
    getUserOrders, 
    verifyPayment ,
    createPaymentLink,
    testPaymentVerification,
} from '../controllers/payment.controllers.js';
import {protect} from '../middleware/auth.js'

 const router = Router();

 router.route('/create-order').post(protect, createOrder);
 router.route('/verify').post(protect, verifyPayment);
 router.route('/orders').get(protect, getUserOrders);
 router.route('/orders/:id').get(protect, getOrderById);
 router.route('/order-details/:orderId').get(protect, getOrderDetails);
 router.route('/create-test-payment').post(protect, createTestPayment)

//create-payment-link
 router.route('/create-payment-link').post(protect, createPaymentLink);
 // test-payment-verification
router.route('/v').post(protect, testPaymentVerification);
 export default router;