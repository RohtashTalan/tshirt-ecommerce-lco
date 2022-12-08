const express = require('express');
const router = express.Router();
const {isLoggedIn, customRole} = require('../middlewares/user');
const {addProduct, getAllProduct} = require('../controllers/product.controller');

// user Routes
router.route('/products').get(getAllProduct)


// admin routes
router.route('/admin/product/add').post(isLoggedIn, customRole('ADMIN'), addProduct);

module.exports = router;