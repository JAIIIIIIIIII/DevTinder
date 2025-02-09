const mongoose = require('mongoose');

const connectionRequestSchema = mongoose.Schema({
    sentFrom : {
        type : mongoose.Schema.Types.ObjectId,
        required :true,
    },
    sentTo : {
        type : mongoose.Schema.Types.ObjectId,
        required :true,
    },
    status :{
        type :String,
        enum :{
            values :["intrest","pass","accept","deni"],
            message : `{VALUE} is not a valid status type!`
        }
    }

},{
    timestamps: true,
})

const connectionRequestModel = mongoose.model("Connections",connectionRequestSchema);

module.exports = connectionRequestModel;