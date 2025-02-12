const express = require('express');
const userAuth = require('../middlewares/auth');
const userRoute = express.Router();
const connectionRequest = require('../models/connections');
const User = require('../models/user');

userRoute.get("/user/requests",userAuth, async (req,res) =>{
    try{
        const loggedInUser = req.user._id;

        const requests = await connectionRequest.find({
            sentTo : loggedInUser,
            status : "intrest",
        })
        .populate("sentFrom", "name profile gender skills about ");

        if(!requests){
            return res.status(404).send("No requests found!");
        }
        
        return res.json({data:requests});
    }
    catch(err){
        return res.status(400).send("Error:" + err.message);
      }

})

userRoute.get("/user/connections",userAuth, async (req,res)=>{
    const loggedInUser = req.user._id;

    const connections = await connectionRequest.find({
        $or : [
            {sentTo : loggedInUser , status : "accept"},
            {sentFrom : loggedInUser , status : "accept"}
        ]
    })
    .populate("sentFrom" ,"name profile gender skills about ")
    .populate("sentTo" , "name profile gender skills about ");

    const correctData = connections.map((value) =>{
        const valid = value.sentFrom._id.toString() === loggedInUser.toString();
        if(valid){
            return value.sentTo;
        }
        return value.sentFrom;
    })

    return res.json({data:correctData});
})

userRoute.get("/user/feed",userAuth , async (req,res)=>{
    try{
        const loggedInUser = req.user._id;
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 3;

        const skip = (page-1)*limit;
        limit = limit>20 ? 20 : limit;

        const relatedUsers = await connectionRequest.find({
            $or : [
                {sentFrom : loggedInUser},
                {sentTo : loggedInUser},
            ]
        }).select("sentFrom sentTo");
        

        const hiddenUserSet= new Set();
       relatedUsers.forEach((val)=>{
            hiddenUserSet.add(val.sentFrom.toString());
            hiddenUserSet.add(val.sentTo.toString());

        })
        
    const otherUser = await User.find({
        $and : [
            { _id : { $nin : Array.from(hiddenUserSet)}},
            { _id : { $ne : loggedInUser} },
        ]
    })
    .select("name profile gender skills about")
    .skip(skip)
    .limit(limit);

        res.json({data : otherUser});
    }
    catch(err){
        return res.status(400).send("Error:" + err.message);
      }
})
module.exports = userRoute;