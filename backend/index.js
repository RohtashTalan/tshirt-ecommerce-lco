const app = require("./app.js")
const config = require("./config/env");
const connectDB = require('./config/db')
const cloudinary = require('cloudinary').v2;


// connect with databases
connectDB();


// cloudinary config goes here
cloudinary.config({ 
    cloud_name: config.CLOUDINARY_CLOUD_NAME,
    api_key: config.CLOUDINARY_API_KEY,
    api_secret: config.CLOUDINARY_API_SECRET
  });



  // app listening
app.listen(config.PORT, ()=>{
    console.log(`server running on port ${config.PORT}`);
})
