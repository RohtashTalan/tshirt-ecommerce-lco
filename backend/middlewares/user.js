const User = require('../models/user.schema');
const BigPromise = require('./bigPromise');
const CustomError = require('../utils/customError');
const config = require('../config/env');
const Jwt = require('jsonwebtoken');


exports.isLoggedIn = BigPromise(async(req, res, next)=>{
    let token = req.cookies.token || req.header("Authorization");

    if (!token){ return next(new CustomError('Login first to access this page', 401))}

    // check whether token is from header
    if(token.slice(0,6)=='Bearer'){
      token = token.replace('Bearer ','')
    }

    const decoded = Jwt.verify(token,config.JWT_SECRET);
    req.user =await User.findById(decoded.id);
    next();
})

exports.customRole = (...roles) => {
  return(req, res, next) => {
    if(!roles.includes(req.user.role)){
      return next(new CustomError('You are not allowed for this resource'))
    }
    next();
  }
}