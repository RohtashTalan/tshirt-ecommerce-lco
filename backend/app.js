const express = require('express');
const home =  require('./routes/home');

const app = express();

// m middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));



// import all routes here
app.use('/api/v1', home)




module.exports= app;