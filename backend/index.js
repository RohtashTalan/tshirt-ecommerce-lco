const app = require("./app.js")
const config = require("./config/env");



app.listen(config.PORT, ()=>{
    console.log(`server running on port ${config.PORT}`);
})
