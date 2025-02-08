const express= require("express");
const app = express();
const cookieParser = require('cookie-parser');
const dbConnect = require("./config/database");
const bcrypt = require('bcrypt');
const User = require("./models/user");

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req,res) =>{
    try{
    const {name,email,password} = req.body;
    const hashedPassword = await bcrypt.hash(password,10);
    const newUser = new User({name,email,password:hashedPassword});
    
        await newUser.save();
        res.send("User Added");
    }
    catch(err){
        res.status(400).send("Error: " + err.message);

    }
})
app.post("/login",async (req,res) => {
    try{
        const {email,password} = req.body;
        const user = await User.findOne({email:email});
        console.log(user);
        
        if(!user){
            throw new Error ("Invalid password or User!");
        }
        const passwordCheck = await user.validatePassword(password);
        if(passwordCheck){
            const token = await user.getJWT();
            res.cookie("token" , token , {expiresIn : "7d"});
            res.send("Login Sucess!");
        }
        else{
            throw new Error("Invalid password or User!");
        }

    } catch(err){
        res.status(400).send("Error: " + err.message);

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

