const cloudinary = require('cloudinary').v2;
const User = require("../models/user.schema");
const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customError");
const cookieToken = require('../utils/cookieToken');


exports.signup = BigPromise( async(req, res, next) => {
let result='';
    if(req.files){
        let file = req.files.photos;
     result = await cloudinary.uploader.upload(file.tempFilePath, {
            folder: 'users'
        });
    } 


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
        secure_url: result.secure_url
    }
  });


  cookieToken(user,res);


});
