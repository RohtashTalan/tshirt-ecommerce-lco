const mongoose = require('mongoose');
const config = require('./env');


const connectDB = () =>{
    mongoose.connect(config.MONGODB_URL)
    .then(console.log(`DB connected Successfully`))
    .catch((error)=>{
        console.log(`Db failed`);
        console.log(error.message);
    })
}


module.exports = connectDB;