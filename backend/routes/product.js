const express = require('express');
const router = express.Router();
const {isLoggedIn, customRole} = require('../middlewares/user');
const {addProduct} = require('../controllers/product.controller');


router.route('/addproduct').post(isLoggedIn, addProduct);

module.exports = router;