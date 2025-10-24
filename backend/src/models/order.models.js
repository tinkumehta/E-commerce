import mongoose, {Schema} from "mongoose";

 const orderSchema = new Schema(
    {
        user: {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : true
        },
        orderItems : [
            {
                name: {
                    type: String,
                    required: true
                },
                quantity: {
                    type: Number,
                    default: 1,
                    required : true
                },
                image: {
                    type : String,
                    required : true
                },
                price: {
                    type: Number,
                    required: true
                },
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref : 'Product',
                    required : true
                }
            }
        ],
        shippingAddress : {
            address: {
                type: String,
                required: true
            },
            city: {
                type: String,
                required: true
            },
            PostalCode: {
                type: String,
                required: true
            },
            state: {
                type: String,
                required: true
            },
            paymentMethod: {
                type: String,
                required : true,
                default: 'Razorpay'
            },
            paymentResult: {
                razorpayOrderId: String,
                razorpayPaymentId : String,
                razorpaySignature: String,
                status: String,
                update_time:Date,
                email_address: String
            },
            itemsPrice: {
                type: Number, 
                required : true,
                default: 0.0
            },
            taxPrice: {
                type: Number,
                required: true,
                default : 0.0
            },
            shippingPrice: {
                type: Number,
                required: true,
                default : 0.0
            },
            totalPrice: {
                type: Number,
                required: true,
                default : 0.0
            },
            isPaid: {
                type : Boolean,
                required: true,
                default: false
            },
            paidAt: Date,
            isDelivered: {
                type : Boolean,
                required : true,
                default: false
            },
            deliveredAt: Date
        }
    },{timestamps : true}
 )

 export default mongoose.model('Order', orderSchema);