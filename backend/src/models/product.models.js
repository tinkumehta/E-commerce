import mongoose,{Schema} from "mongoose";

const productSchema = new Schema(
    {
        name: {
            type: String,
             required: true,
             trim : true
        },
        description: {
            type: String,
            required: true
        },
        price: {
            type : Number,
            required: true,
            min : 0
        },
        category: {
            type : String,
            required: true
        },
        stock: {
            type : Number,
            required : true,
            min : 0,
            default: 0
        },
        images : [{
            public_id : {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        }],
        ratings : {
            type : Number,
            default : 0,
        },
        numofReviews: {
            type: Number,
            default: 0
        },
        reviews: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }],
        createdBy : {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required : true
        },
    }, 
    {
        timestamps : true
    }
)

export default mongoose.model('Product', productSchema)