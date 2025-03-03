const express = require("express");
const chatRouter = express.Router();
const Chat = require("../models/chat");
const userAuth = require("../middlewares/auth");

chatRouter.get("/getchat/:id" ,userAuth, async (req,res)=>{

    const targetUser = req.params.id;
    console.log(targetUser);
    
    
    const user = req.user._id;
    console.log(user);
    

    
    let chat = await Chat.findOne({ participants :{$all : [targetUser,user]}})
                         .populate({path:"messages.senderId" , select :"name profile"}
                         );
                        
   
    
    if(!chat) {
        chat = await new Chat({
            participants :[targetUser,user] , messages:[]
        })
      await chat.save();

     
    }
    res.json({chat});
})


module.exports = chatRouter;