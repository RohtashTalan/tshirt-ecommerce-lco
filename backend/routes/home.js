const express = require('express');
const router = express.Router();

// import home controller 
const {home, homeDummy} = require('../controllers/homeController');


//
router.route('/').get(home)


module.exports = router;