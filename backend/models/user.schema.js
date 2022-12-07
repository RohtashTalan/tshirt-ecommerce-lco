const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require('bcryptjs');
const  Jwt  = require("jsonwebtoken");
const crypto = require('crypto');

// custom files import
const config  = require("../config/env");
const authRoles = require("../utils/authRoles");


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Name is required'],
        maxLength:[40, 'Name should be less then 40 Characters']
    },
    email:{
        type:String,
        required:[true, 'Email is required'],
        unique:true,
        validate:[validator.isEmail, 'Please enter email in correct format']
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
    photo:{
        id:{
            type: String,
            required:true
        },
        secure_url:{
            type: String,
            required:true
        }
    },
    forgotPasswordToken:String,
    forgotPasswordExpiry:Date,
},
{timestamps:true}
);

// encrypt password before save-HOOKS
userSchema.pre('save', async function(next){
    if(!this.isModified('password')){return next();}
    this.password = await bcrypt.hash(this.password, 10);
    next()
})

// validate the password with passed on user password
userSchema.methods.isValidatePassword = async function(userEnteredPassword){
  return await bcrypt.compare(userEnteredPassword, this.password)
}

// create and return JwtToken
userSchema.methods.getJwtToken = function() {
   return Jwt.sign({id:this._id}, config.JWT_SECRET,{expiresIn:config.JWT_EXPIRY});
}


// generate forgot password token(String format)
userSchema.methods.getForgotPasswordToken = function(){
   const forgotToken = crypto.randomBytes(24).toString('hex');

   // getting a hash - make sure to get a hash on backend
   this.forgotPasswordToken = crypto.createHash('sha256').update(forgotToken).digest('hex');

   // time of token expiery
   this.forgotPasswordExpiry = Date.now() + 20*60*1000;

   return forgotToken;
}


// export user Model
module.exports = mongoose.model('User',userSchema);