const express = require('express');
const router = express.Router();
const {isLoggedIn, customRole} = require('../middlewares/user');
const {addProduct, getAllProducts, getSingleProduct, adminGetAllProducts} = require('../controllers/product.controller');

// user Routes
router.route('/products').get(getAllProducts)
router.route('/product/:id').get(getSingleProduct)


// admin routes
router.route('/admin/product/add').post(isLoggedIn, customRole('ADMIN'), addProduct);
router.route('/admin/products').post(isLoggedIn, customRole('ADMIN'), adminGetAllProducts);

module.exports = router;