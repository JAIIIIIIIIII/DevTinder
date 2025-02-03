const express= require("express");
const app = express();
const dbConnect = require("./config/database");
const User = require("./models/user");

app.use(express.json());

app.post("/signup", async (req,res) =>{
    const user = req.body;
    const newUser = new User(user);
    try{
        await newUser.save();
        res.send("User Added");
    }
    catch(err){
            res.status(400).send("Error : ", err.message);
    }
})

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

