import mongoose,{Schema} from 'mongoose'
import bcrypt from 'bcrypt';

const userSchema = new Schema(
    {
        name : {
            type : String,
            required : true,
        },
        username : {
            type : String,
            required : true,
            unique : true,
            index : true,
            trim : true,
        },
        email : {
            type : String,
            required : true,
            lowercase : true,
            unique : true
        },
        role :{
            type : String,
            enum : ['user', 'admin'],
            default : 'user'
        },
        password : {
            type: String,
            required : true,
            minlength: 6
        },
        avatar: {
            public_id: String,
            url : String
        },
        resetPasswordToken: String,
        resetPasswordExpire: Date
    }, 
    {timestamps : true}
)

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

export default mongoose.model('User', userSchema);