const mongoose = require('mongoose');

const connectionRequestSchema = mongoose.Schema({
    sentFrom : {
        type : mongoose.Schema.Types.ObjectId,
        required :true,
        ref:"User",
    },
    sentTo : {
        type : mongoose.Schema.Types.ObjectId,
        required :true,
        ref:"User",
    },
    status :{
        type :String,
        enum :{
            values :["intrest","pass","accept","reject"],
            message : `{VALUE} is not a valid status type!`
        }
    }

},{
    timestamps: true,
})

const connectionRequestModel = mongoose.model("Connections",connectionRequestSchema);

module.exports = connectionRequestModel;