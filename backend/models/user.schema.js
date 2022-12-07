import mongoose from "mongoose";
import validator from "validator";
import authRoles from "../utils/authRoles";


const userSchema = mongoose.Schema({
    name:{
        type:String,
        require:[true,'Name is required'],
        maxLength:[40, 'Name should be less then 40 Characters']
    },
    email:{
        type:String,
        require:[true, 'Email is required'],
        unique:true,
        validate:validator.isEmail
    },
    password:{
        type:String,
        required: [true, 'Password is required'],
        minLength: [8, 'Password should be atleast 8 char long']
    },
    role:{
        type:String,
        enum:Object.keys(authRoles),
        default:authRoles.USER
    },
    forgotPasswordToken:String,
    forgotPasswordExpiry:Date,
})


// methods
userSchema.method.get




module.exports = mongoose.model('User',userSchema);