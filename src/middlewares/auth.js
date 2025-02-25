const jwt = require('jsonwebtoken');
const User = require("../models/user");

const userAuth = async (req,res,next) =>{
   try{ 
    const {token} = req.cookies;
    if(!token){
        throw new Error("Token not found!");
    }
    const isTokenValid = await jwt.verify(token,process.env.JWT_SECRET);
    if(!isTokenValid){
        throw new Error("Invalid Token!");
    }
    const userId = isTokenValid._id;
    //console.log(userId);
    
    const user = await User.findById(userId);
    req.user = user;
    next();
    }
   catch(err){
    res.status(400).send("Error: " + err.message);

}
   
}
module.exports = userAuth;