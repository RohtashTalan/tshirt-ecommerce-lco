const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');

const app = express();
const home =  require('./routes/home');

// morgan middleware
app.use(morgan('tiny'))

// regular middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// cookies and file middleware
app.use(cookieParser())
app.use(fileUpload())


// import all routes here
app.use('/api/v1', home)



// export express app
module.exports= app;