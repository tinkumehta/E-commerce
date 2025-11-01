import Order from '../models/order.models.js'
import razorpay from '../config/razorpay.js'
import Product from '../models/product.models.js'
import crypto from 'crypto'
import razorpay from '../config/razorpay.js'

export const createOrder = async (req, res, next) => {
    try {
        const {item, shippingAddress, itemPrice, taxPrice, shippingPrice, totalAmount, currency} = req.body;

        const calculatedTotal = item.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        const finalTotal = totalAmount || calculatedTotal + (taxPrice || 0) + (shippingPrice || 0);

        const options = {
            amount: Math.round(finalTotal * 100), // Amount in paise
            currency: currency || 'INR',
            receipt: `receipt_${Date.now()}`,
            payment_capture: 1 // Auto capture payment
        };

        const razorpay = await razorpay.orders.create(options);

        // save order to database
        const order = new Order({
            user: req.user._id,
            orderItems: item,
            shippingAddress,
            itemPrice : itemPrice || calculatedTotal,
            taxPrice : taxPrice || 0,
            shippingPrice : shippingPrice ||0,
            totalPrice: finalTotal,
            paymentResult : {
                razorpayOrderId: razorpay.id,
                status: 'created'
            }
        });

        const createdOrder = await order.save();

        res.status(201).json({
            success: true,
            order: createdOrder,
            razorpayOrder: {
                id: razorpay.id,
                amount: razorpay.amount,
                currency  : razorpay.currency,
                key : process.env.RAZORPAY_KEY_ID // send key id to fronted
            }
        });
    } catch (error) {
        console.error('Create order error:', error)
        next(error);
    }
}