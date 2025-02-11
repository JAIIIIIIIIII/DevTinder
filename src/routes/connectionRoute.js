const express = require('express');
const userAuth = require('../middlewares/auth');
const connectionRouter = express.Router();
const connectionRequest = require("../models/connections");
const User = require('../models/user');

connectionRouter.post("/connection/send/:status/:receiver", userAuth, async (req,res)=>{
    try{
       const sentFrom = req.user._id;
       const sentTo = req.params.receiver;
       const connectionStatus = req.params.status;
       
       const isBothSame = sentFrom.toString() === sentTo;
       
       if(isBothSame){
      throw new Error("Cannot send request to Yourself!");
       }
        
       const isValidReceiver = await User.findById(sentTo);
       if(!isValidReceiver){
         return res.status(404).json({
            message:"Invalid receiver!"
        })
       }
       
       const validStatus = ["intrest","pass"];
       if(!validStatus.includes(connectionStatus)){
         throw new Error("Invalid connection status");
       }
       
       const validRequest = await connectionRequest.findOne({
        $or : [
            {sentFrom,sentTo},
            {sentFrom:sentTo,sentTo:sentFrom},
        ]
       })
       if(validRequest){
       throw new Error("Request already sent or received");
       }

       const newConnection = new connectionRequest ({
         sentFrom,sentTo,status:connectionStatus
       });
       const data = await newConnection.save();
       res.json({
        message: "Connection request sent",
        data: data,
       })
    }
    catch(err){
       return  res.status(400).send("Error: " + err.message);
    
    }
})

connectionRouter.post("/connection/review/:status/:reqId", userAuth , async(req,res)=>{
  try{
     const loggedInUser = req.user._id;
     const {status} = req.params;
     const {reqId} = req.params;

     const validStatus = ["accept","reject"];
     if(!validStatus.includes(status)){
      throw new Error("Not a valid Status!");
     }

     const data  =  await connectionRequest.findOne({
      _id: reqId,
      sentTo : loggedInUser,
      status : "intrest"

     })
     if(!data){
      return res.status(404).send("No request found!");
     }

     data.status = status;

     data.save();
     return res.json({message:"Reequest reviewed", data:data});
     

  }
  catch(err){
    return res.status(400).send("Error:" + err.message);
  }
})
module.exports = connectionRouter;