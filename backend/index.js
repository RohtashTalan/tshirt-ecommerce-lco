const app = require("./app.js")
const config = require("./config/env");
const connectDB = require('./config/db')

connectDB();

app.listen(config.PORT, ()=>{
    console.log(`server running on port ${config.PORT}`);
})
