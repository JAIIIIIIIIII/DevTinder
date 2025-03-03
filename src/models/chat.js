const mongoose = require("mongoose");


const MessageSchema = mongoose.Schema({
    senderId: {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref:"User",
    }
    ,
    message : {
        type: String,
        required : true,
    }
},{
    timestamps : true
})

const ChatSchema = mongoose.Schema({

    participants : [  {type : mongoose.Schema.Types.ObjectId , required : true , ref : "User"}  ],
    messages:
        [MessageSchema]


})

const ChatModel = mongoose.model("Chat" , ChatSchema);

module.exports = ChatModel;