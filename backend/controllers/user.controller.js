const cloudinary = require("cloudinary").v2;
const User = require("../models/user.schema");
const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customError");
const cookieToken = require("../utils/cookieToken");


// signup route
exports.signup = BigPromise(async (req, res, next) => {
    if (!req.files) {
        return next(new CustomError("Photo required", 400));
      }


  let file = req.files.photos;
  let result = await cloudinary.uploader.upload(file.tempFilePath, {
    folder: "users",
  });

  const { name, email, password } = req.body;

  if (!email || !name || !password) {
    return next(new CustomError("Email, Name, Password required", 400));
  }

  const user = await User.create({
    name,
    email,
    password,
    photo: {
      id: result.public_id,
      secure_url: result.secure_url,
    },
  });

  cookieToken(user, res);
});


// login route
exports.login = BigPromise(async (req, res, next) => {
    const {email, password} = req.body;

    // check for email and password
    if(!email || !password){return next(new CustomError('Please provide email and password', 400))}

    // get user from db 
    const user = await User.findOne({email}).select("+password");
    
      // noUser
      if(!user){return next(new CustomError('Email or password is matched', 400))}

      // match the pasword
      const isPasswordCorrect = await user.isValidatePassword(password);

           // wrong password
        if(!isPasswordCorrect){return next(new CustomError('Email or password is matched', 400))}

        // if all goes good we send the token
        cookieToken(user, res);

})

// logout route
exports.logout = BigPromise(async (req, res, next) => {
    res.cookie('token',null,{
        expires:new Date(Date.now()),
        httpOnly:true
    })
    res.status(200).json({
        success:true,
        message:'Logout successful'
    })
})

// forgot password
exports.forgotPassword = BigPromise(async (req, res, next)=>{

})