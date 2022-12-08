const cloudinary = require("cloudinary").v2;
const User = require("../models/user.schema");
const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customError");
const cookieToken = require("../utils/cookieToken");
const mailHelper = require("../utils/emailHelper");
const crypto = require('crypto');


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
exports.forgotPassword = BigPromise(async (req, res, next) => {
   const {email} = req.body;

      if (!email) {
        return next(new CustomError("Email is required", 400));
      }

    const user = await User.findOne({email});
    
    const token = user.getForgotPasswordToken();

    let myResetUrl = `${req.protocol}://${req.hostname}/api/v1/reset/password/${token}`;

    let option = {
      email:user.email,
      subject: 'RohtashTalan.com Reset Password',
      message:`Here is your requested reset password link \n\n\n ${myResetUrl}`
    }

    await user.save({validateBeforeSave:false});

   try {
  await mailHelper(option);
   res.status(200).json({
    success:true,
    message:'Email sent Successfully'
   })

   } catch (error) {
    user.forgotPasswordToken=undefined;
    user.forgotPasswordExpiry=undefined;
    user.save({validateBeforeSave:false});
    return next(new CustomError('email failed'+error.message, 500))
   }


})

// reset password
exports.resetPassword = BigPromise(async (req, res, next) => {
      const {token} = req.params;

      if (!token) {
       return next(new CustomError('Token missing from link',400))
      }

      // encrypt token to match in database
     const encryptToken = crypto.createHash('sha256').update(token).digest('hex');

     const user = await User.findOne({forgotPasswordToken:encryptToken, forgotPasswordExpiry: {$gt: Date.now()}});

     if(!user){return next(new CustomError('Token is invalid or expired', 401))}

     // get user new password
      const {password} = req.body;

      user.password = password;
      user.forgotPasswordToken = undefined;
      user.forgotPasswordExpiry= undefined;

       await user.save();

       res.cookie('token',null,{
        expires:new Date(Date.now()),
        httpOnly:true
       })

       res.status(200).json({
        success:true,
        message:'Password change login again with new password'
       })




})

// get user detail and pass to frontend
exports.getLoggedInUserDetails = BigPromise(async(req, res, next) => {
   const user = await User.findById(req.user.id);

   res.status(200).json({
    success:true,
    user
   })
})

// update password
exports.updatePassword = BigPromise(async(req, res, next) => {
  const {oldPassword, newPassword} = req.body;

  // check if both password field are availabe
  if(!oldPassword || !newPassword){return next(new CustomError('Both New and old password required', 400))}

  const user = await User.findById(req.user.id);

  user.password=newPassword;
  await user.save();

cookieToken(user, res);

})

// update userDashBoard Details
exports.updateUserDetails = BigPromise(async(req, res, next) => {
  const {email, name} = req.body;

  const user = await User.findById(req.user.id);
  if(req.files){
    let file = req.files.photos;
    const deletePhoto = await cloudinary.uploader.destroy(user.photo.id);
    const updatePhoto = await cloudinary.uploader.upload(file.tempFilePath,{folder:'users'});
    user.photo.id=updatePhoto.public_id;
    user.photo.secure_url=updatePhoto.secure_url;

    await user.save({validateBeforeSave:false})
  }

  // check if user
  if(!name || !email){return next(new CustomError('User Email Name is required', 402))}

  user.email=email;
  user.name=name;

  await user.save({validateBeforeSave:false});

  cookieToken(user, res);

})

/***************************************** 
* admin all users
* admin single user
*
*/

exports.adminAllUsers = BigPromise(async(req, res, next) => {
   const users = await User.find();

   res.status(200).json({
    success:true,
    users
   })
})

exports.adminGetSingleUser = BigPromise(async(req, res, next) => {
  const userId = req.params.userId;

  const user = await User.findById(userId);

  if(!user){
   return next(new CustomError('User Not Found',402))
  }

  res.status(200).json({
   success:true,
   user
  })
})

exports.adminUpdateSingleUser = BigPromise(async(req, res, next) => {

  const user = User.findById(req.params.userId);

  const newData = {
    name:req.body.name,
    email:req.body.email
  }

  if(req.files){
    const file = req.files.photos;
    const deletePhoto = await cloudinary.uploader.destroy(user.photo.id);
    const updatePhoto = await cloudinary.uploader.upload(file.tempFilePath, {folder:'users', width:150, crop:'scale'})

   newData.photo = {
    id:updatePhoto.public_id,
    secure_url:updatePhoto.secure_url
   }
  }
  

  if (!req.body.name || !req.body.email) {
    return next(new CustomError('Name and Email Required to update', 401));
  }

  const updateUser = await User.findByIdAndUpdate(req.params.userId,newData,{
    new: true,
    runValidators: true,
    useFindAndModify: false
  })

res.status(200).json({
  success:true,
  message:'User updated Successfully',
  updateUser
})

})

exports.adminDeleteSingleUser = BigPromise(async(req, res, next) => {
  if (!req.params.userId) {
    return next(new CustomError('Url missing user Id', 400));
  }

  const user = await User.findById(req.params.userId);

if (!user) {
  return next(new CustomError('User Not Found',402))
}
 
await cloudinary.uploader.destroy(user.photo.id);
await user.remove();

res.status(200).json({
  success:true,
  message:'User Deleted Successfully',
  user
})

})


// Manger
exports.managerAllUsers = BigPromise(async(req, res, next) => {
  const users = await User.find({role:'USER'});

  res.status(200).json({
   success:true,
   users
  })
})