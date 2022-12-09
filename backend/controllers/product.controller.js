const Product = require('../models/product.schema')
const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customError");
const crypto = require("crypto");
const cloudinary = require("cloudinary").v2;
const WhereClause = require('../utils/whereClause');


exports.addProduct= BigPromise(async(req, res, next) => {

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

exports.getAllProduct = BigPromise(async(req, res, next) => {
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

exports.adminGetAllProducts = BigPromise(async(req, res, next) => {
    const products = await Product.find();

    res.status(200).json({
        success:true,
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