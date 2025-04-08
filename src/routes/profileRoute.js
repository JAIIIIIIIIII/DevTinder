const express = require('express');
const profileRouter = express.Router();
const userAuth = require('../middlewares/auth');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const validateData = (userData) =>{
    //console.log(userData)   ;
    const validData = ["name","profile","gender","skills","about"];
    
    
     return Object.keys(userData).every(field => validData.includes(field));
}

profileRouter.get("/profile/view",userAuth,async (req,res) => {                                 
try{
    const user = req.user;
    if(!user){
    throw new Error("User not found!");
    }
    
    return res.json({data: user});
   }catch(err){
    res.status(400).send("Error: " + err.message);

}})

profileRouter.get("/viewprofile/:id", userAuth , async (req,res) =>{
    try{
        const userId = req.params.id;
        console.log(userId);
        
        const user = await User.findOne({_id : userId});
        if(!user){
           throw new Error("No user Found");
        }
        return res.json({user});
    }catch(err){
        res.status(400).send("Error: " + err.message);
}})

profileRouter.patch("/profile/edit",userAuth, async(req,res)=>{
    try{
        const loggedInUser = req.user;

        const editedData = req.body;

        const isEditValid = validateData(editedData);
        
        if(!isEditValid){
            throw new Error("Invalid edit request");
        }
        Object.keys(editedData).forEach((key) => {loggedInUser[key] = editedData[key]});
       
        await loggedInUser.save();
        res.json({message : `Edited profile for ${loggedInUser.name}`, data : loggedInUser});
    }
    catch(err){
        res.status(400).send("Error: " + err.message);

    }
    
})
profileRouter.patch("/profile/password",userAuth, async(req,res)=>{
    try{
        const loggedInUser = req.user;
        const {oldPassword,newPassword} = req.body;
        const isOldPassword = await bcrypt.compare(oldPassword,loggedInUser.password);
        
        
        if(!isOldPassword) {
            throw new Error("The Old Password is not correct!!");
        }
        
        const newHashedpassword = await bcrypt.hash(newPassword,10);
        
        loggedInUser.password = newHashedpassword;
        await loggedInUser.save();
        res.json({message : `Password changed for ${loggedInUser.name}`});
    }
    catch(err){
        res.status(400).send("Error: " + err.message);

    }
    
})

 module.exports = profileRouter;