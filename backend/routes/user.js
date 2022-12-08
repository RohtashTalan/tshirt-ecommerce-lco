const express = require('express')
const router = express.Router();
const {isLoggedIn, customRole} = require('../middlewares/user')

const {signup, login, logout, forgotPassword, resetPassword, updatePassword, getLoggedInUserDetails, updateUserDetails, adminAllUsers, managerAllUsers, adminGetSingleUser, adminUpdateSingleUser, adminDeleteSingleUser} = require('../controllers/user.controller');

router.route('/signup').post(signup);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/forgot/password').post(forgotPassword);
router.route('/reset/password/:token').post(resetPassword);
router.route('/userdashboard').get(isLoggedIn, getLoggedInUserDetails);
router.route('/update/password/').post(isLoggedIn, updatePassword);
router.route('/userdashboard/update').post(isLoggedIn, updateUserDetails);


// admin routes
router.route('/admin/users').get(isLoggedIn, customRole('ADMIN'), adminAllUsers);
router.route('/admin/user/:userId').get(isLoggedIn, customRole('ADMIN'), adminGetSingleUser).put(isLoggedIn, customRole('ADMIN'), adminUpdateSingleUser).delete(isLoggedIn, customRole('ADMIN'), adminDeleteSingleUser)






//manager routes
router.route('/manager/users').get(isLoggedIn, customRole('MANAGER'), managerAllUsers);


module.exports= router;