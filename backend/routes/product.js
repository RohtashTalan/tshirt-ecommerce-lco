const express = require('express');
const router = express.Router();
const {isLoggedIn, customRole} = require('../middlewares/user');
const {addProduct, getAllProducts, getSingleProduct, adminGetAllProducts, adminUpdateOneProduct, adminDeleteOneProduct, addReview, deleteReview, getOnlyReviewsForSingleProduct} = require('../controllers/product.controller');

// user Routes
router.route('/products').get(getAllProducts);
router.route('/product/:id').get(getSingleProduct);
router.route('/review').put(isLoggedIn, addReview);
router.route('/review').delete(isLoggedIn, deleteReview);
router.route('/review').get(getOnlyReviewsForSingleProduct);



// admin routes
router.route('/admin/product/add').post(isLoggedIn, customRole('ADMIN'), addProduct);
router.route('/admin/products').get(isLoggedIn, customRole('ADMIN'), adminGetAllProducts);
router.route('/admin/product/:id').put(isLoggedIn, customRole('ADMIN'), adminUpdateOneProduct).delete(isLoggedIn, customRole('ADMIN'), adminDeleteOneProduct);

module.exports = router;