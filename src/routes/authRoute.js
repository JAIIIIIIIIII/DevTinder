const express = require('express');
const authRouter = express.Router();
const bcrypt = require('bcrypt');
const User = require("../models/user");



authRouter.post("/signup", async (req,res) =>{
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
authRouter.post("/login",async (req,res) => {
    try{
        const {email,password} = req.body;
        const user = await User.findOne({email:email});
        
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
authRouter.post("/logout",async(req,res)=>{
    res.cookie("token",null,{
        expires: new Date(Date.now())
    })
    .send("Logout Sucess!");
})

module.exports = authRouter;