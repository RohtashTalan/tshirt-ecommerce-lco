const Product = require('../models/product.schema')
const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customError");
const crypto = require("crypto");
const cloudinary = require("cloudinary").v2;
const WhereClause = require('../utils/whereClause');



exports.getAllProducts = BigPromise(async(req, res, next) => {
    const resultPerPage = 6;

    const productsObj =new WhereClause(Product.find(),req.query).search().filter();

    let products = await productsObj.base;

    const filteredProductNumber = products.length;

    productsObj.pager(resultPerPage);

    products = await productsObj.base.clone();

    res.status(200).json({
        success:true,
        filteredProductNumber,
        products
    })
})


exports.getSingleProduct = BigPromise(async(req, res, next) =>{
    
    const product = await Product.findById(req.params.id)

    if (!product) {
        return next(new CustomError('no product found with this url', 401))
    }

    res.status(200).json({
        success:true,
        product
    })

})

exports.addReview = BigPromise(async(req, res, next) => {
    const {rating, comment, productId} = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }

    const product = await Product.findById(productId);

    const isAlreadyReview = product.reviews.find((rev) => rev.user.toString()===req.user._id.toString())

    if(isAlreadyReview){
        product.reviews.forEach((review)=>{
            if(review.user.toString()===req.user._id.toString()){
                review.comment = comment;
                review.rating = rating
            }
        })

    } else {
        product.reviews.push(review);
        product.numberOfReviews = product.reviews.length;
    }
    
    // adjust rating
    product.rating = product.reviews.reduce((acc, item) => item.rating +acc, 0)/product.reviews.length;

    await product.save({validateBeforeSave:false})

    res.status(200).json({
        success:true,
        message:'review added successfuly'
    })
    
})

exports.deleteReview = BigPromise(async(req, res, next) => {
    const {productId} = req.query;

    const product = await Product.findById(productId);

    const reviews = product.reviews.filter((rev) => rev.user.toString() !== req.user._id.toString())

    const numberOfReviews = reviews.length;
    
    // adjust rating
    product.rating = product.reviews.reduce((acc, item) => item.rating +acc, 0)/product.reviews.length;

   // update the product
     await Product.findByIdAndUpdate(productId,{
        reviews,
        rating,
        numberOfReviews
     },{
        new:true,
        runValidators:true
     })

    res.status(200).json({
        success:true,
        message:'review Deleted successfuly'
    })
    
})

exports.getOnlyReviewsForSingleProduct = BigPromise(async(req, res, next) => {
    const product = await Product.findById(req.query.id);

    res.status(200).json({
        success:true,
        reviews:product.reviews
    })
})

/*
Admin controllers
*/

exports.addProduct = BigPromise(async(req, res, next) => {

    let imageArray = []
    if(!req.files){return next(new CustomError('Images are required', 401))}

    if(req.files){
        for (let i = 0; i < req.files.photos.length; i++) {
            let result = await cloudinary.uploader.upload(req.files.photos[i].tempFilePath, {
                folder: 'products'
            });
            imageArray.push({
                    id: result.public_id,
                    secure_url: result.secure_url
                })
        }
    }

    req.body.photos = imageArray;
    req.body.user = req.user.id;

    const product = await Product.create(req.body);

    res.status(200).json({
        success: true,
        message: 'product added successfully',
        product,
        entered: req.body
    })

})

exports.adminGetAllProducts = BigPromise(async(req, res, next) => {
    const products = await Product.find();

    res.status(200).json({
        success:true,
        products
    })
})

exports.adminUpdateOneProduct = BigPromise(async (req, res, next) => {
    
    let product = await Product.findById(req.params.id)
    
    if (!product) {
        return next(new CustomError('No Product find by this id', 401))
    }

    let imageArray=[];

    if(req.files){
        // destroy the exsiting files
        for (let i = 0; i < product.photos.length; i++) {
            const res = await cloudinary.uploader.destroy(product.photos[i].id)
        }

        // upload the existing files
        for (let i = 0; i < req.files.photos.length; i++) {
            let result = await cloudinary.uploader.upload(req.files.photos[i].tempFilePath,{folder:'products'})

            imageArray.push({
                id:result.public_id,
                secure_url:result.secure_url
            });
        }
        
    req.body.photos = imageArray;
    }


    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new:true,
        runValidators:true
    })

    res.status(200).json({
        success:true,
        product
    })

})

exports.adminDeleteOneProduct = BigPromise(async (req, res, next) => {
    
    let product = await Product.findById(req.params.id)
    
    if (!product) {
        return next(new CustomError('No Product find by this id', 401))
    }
// destroy the exsiting files
for (let i = 0; i < product.photos.length; i++) {
    const res = await cloudinary.uploader.destroy(product.photos[i].id)
}


   await product.remove()

    res.status(200).json({
        success:true,
        message: 'Product was Deleted !'
    })

})