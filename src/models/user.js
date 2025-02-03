const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        minLength : 3,
        maxLength : 30,
    },
    email : {
        type : String,
        required : true,
        unique : true,
        trim : true,
        validate(val){
            if(!validator.isEmail(val)){
                throw new Error("Not a Vaild Email!")
            }
        }

    },
    password : {
        type : String,
        required : true,
        validate(val){
            if(!validator.isStrongPassword(val)){
                throw new Error("Enter a Strong password!")
            }
        }
    },
    profile :{
        default : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    },
    gender : {
        type : String,
        validate(val){
            if(!["M","F","O"].includes(val)){
                throw new Error("Not a Vaild Gender!")
            }
        }
    },
    skills : {
        type : Array,
    },
},
{
    timestamps : true,
})

const User = mongoose.model("User",userSchema)

module.exports = User;