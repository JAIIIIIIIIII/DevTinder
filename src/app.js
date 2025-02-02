const express= require("express");
const app = express();
const dbConnect = require("./config/database");

dbConnect()
.then(()=>{
    console.log("Server Connected");
    app.listen(3000,()=>{
        console.log("server running at 3000");
        
    })

})
.catch((err)=>{
    console.log(err);
})
app.use("/",(req,res)=>{
    res.send("hello world");
})

