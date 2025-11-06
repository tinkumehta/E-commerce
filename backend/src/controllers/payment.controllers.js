import Order from '../models/order.models.js'
import razorpay from '../config/razorpay.js'
import Product from '../models/product.models.js'
import crypto from 'crypto'


export const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, itemsPrice, taxPrice, shippingPrice, totalAmount, currency } = req.body;
    
    const calculatedTotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const finalTotal = totalAmount || calculatedTotal + (taxPrice || 0) + (shippingPrice || 0);
    
    const options = {
      amount: Math.round(finalTotal * 100), // Amount in paise
      currency: currency || 'INR',
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1 // Auto capture payment
    };
    
    const razorpayOrder = await razorpay.orders.create(options);
    
    // Save order to database
    const order = new Order({
      user: req.user._id,
      orderItems: items,
      shippingAddress,
      itemsPrice: itemsPrice || calculatedTotal,
      taxPrice: taxPrice || 0,
      shippingPrice: shippingPrice || 0,
      totalPrice: finalTotal,
      paymentResult: {
        razorpayOrderId: razorpayOrder.id,
        status: 'created'
      }
    });
    
    const createdOrder = await order.save();
    
    res.status(201).json({
      success: true,
      order: createdOrder,
      razorpayOrder: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key: process.env.RAZORPAY_KEY_ID // Send key ID to frontend
      }
    });
    
  } catch (error) {
    console.error('Create order error:', error);
    next(error);
  }
};

// verify payment signature
export const verifyPayment = async (req, res, next) => {
    try {
        const {razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            orderId,
        } = req.body;

        // check signature
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
                .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
                .update(body.toString())
                .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({success :false, message :"Invalid signature"});
        }

        // find order and mark paid
        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({message : 'Order not found'});

        order.isPaid = true;
        order.paidAt = new Date();
        order.paymentResult = {
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
            razorpaySignature: razorpay_signature,
            status : "paid",
        };

        const updatedOrder = await order.save();

        // decrease stock
        for (const item of order.orderItems){
            await Product.findByIdAndUpdate(item.product, {$inc: {stock : -item.quantity}});
        }

        res.status(200).json({
            success: true,
            message: "Payment verified successfully",
            order: updatedOrder,
        });
    } catch (error) {
        next(error);
    }
};

// Get payment order details
export const getOrderDetails = async (req, res, next) => {
    try {
        const {orderId} = req.params;

        const order = await Order.findOne({
            'paymentResult.razorpayOrderId' : orderId
        }).populate('user', 'name email');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            })
        }

        res.json({
            success: true,
            order
        });

    } catch (error) {
        next(error);
    }
};

// create test payment 
export const createTestPayment = async (req, res, next) => {
    try {
        const {order_id, amount} = req.body;

        const mockPaymentId = `pay_${Math.random().toString(36).substring(2, 15)}`;

        // Generate signature
        const signature = generateSignature(order_id, mockPaymentId);

        // In a real scenario, the payment would be created by Razorpay
    // when the user completes the payment on their interface
    
    console.log('Mock payment created:', {
        order_id,
        payment_id : mockPaymentId,
        signature
    });

    res.json({
        success: true,
        message : 'Test payment simulation created successfully',
        payment: {
            id : mockPaymentId,
            order_id : order_id,
            signature: signature,
             amount : amount,
             status: 'captured'
        },
        note: 'This is a simulated payment for testing. In production, use real razorpay payments'
    })
    
    } catch (error) {
        console.error('Test payment creation error : ', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create test payment',
            error: error.message
        });
    }
}

// helperfunction to generate signature
const generateSignature = (orderId, paymentId) => {
    const body = `${orderId}|${paymentId}`;
    return crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest('hex');
};

// create payment link
export const createPaymentLink = async (req, res, next) => {
    try {
        const {order_id, amount, description, customer} = req.body;

        // validate required fields
        if (!order_id || !amount) {
            return res.status(400).json({
                success: false,
                message: 'Order Id and amount are required'
            });
        }

        const customerData = customer || generateTestCustomer();

           // Ensure contact number is valid (10 digits, no repeating patterns)
    if (!/^[6-9]\d{9}$/.test(customerData.contact)) {
      // Generate a valid phone number if provided one is invalid
      customerData.contact = `9${Math.floor(Math.random() * 900000000) + 100000000}`;
    }

     console.log('Creating payment link with:', {
        order_id,
        amount,
        customer: customerData
     });

     const paymentLink = await razorpay.paymentLink.create({
        amount: Math.round(amount *100), // converted to paise
        currency: 'INR',
        accept_partial: false,
        description: description || `Payment for order ${order_id}`,
        customer : customerData,
        notify: {
            sms: false,
            email: false
        },
        reminder_enable: false,
        notes: {
            order_id: order_id,
            created_at: new Date().toISOString()
        }
     });

     res.json({
        success: true,
        message: 'Payment link created successfully',
        payment_link: paymentLink.short_url,
        payment_link_id: paymentLink.id,
        order_id: order_id
     });


    } catch (error) {
     console.error('Payment link creation error details ', error)   ;
      // More detailed error response
    res.status(error.statusCode || 500).json({
      success: false,
      message: 'Failed to create payment link',
      error: error.error?.description || error.message,
      details: error.error
    });
    }
};

// Simple test payment verification 
export const testPaymentVerification = async (req, res, next) => {
    try {
        const {order_id} = req.body;

        // create mock payment data
        const mockPaymentId = `pay_test_${Date.now()}`;
        const signature = generateSignature(order_id, mockPaymentId);

        // find the order
        const order = await Order.findOne({
            'paymentResult.razorpayOrderId': order_id
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        if (order.isPaid) {
             return res.status(400).json({
        success: false,
        message: 'Order is already paid'
      });
        }

        // update order payment staus
        order.isPaid = true,
        order.paidAt = new Date();
        order.paymentResult = {
            razorpayOrderId: order_id,
            razorpayPaymentId: mockPaymentId,
            razorpaySignature: signature,
            status: 'completed',
            update_time: new Date()
        };

        const updatedOrder = await order.save();

        // update of stock
        for (const item of order.orderItems){
            await Product.findByIdAndUpdate(
                item.product,
                {$inc: {stock: -item.quantity}}
            );
        }

        res.json({
            success: true,
            message : 'Test payment verified successfully',
            order: updatedOrder,
            payment_data: {
                razorpay_order_id: order_id,
                razorpay_payment_id: mockPaymentId,
                razorpay_signature: signature
            }
        });

    } catch (error) {
         console.error('Test payment verification error:', error);
    next(error);
    }
}