const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
        type : String,
        default : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    },
    gender : {
        type : String,
        default : "male",
        enum :{
            values :["male","female","other"],
            message : `{VALUE} is not a valid gender type!`
        }
    },
    skills : {
        type : Array,
    },
    about : {
        type : String,
        default : "Hello ,This field is about the user"
    }
},
{
    timestamps : true,
})

userSchema.methods.getJWT = async function(){
    const user = this;
    const token = await jwt.sign({_id:user._id},process.env.JWT_SECRET,{
        expiresIn: "7d"
    });
    return token;
}
userSchema.methods.validatePassword = async function(passwordByUser) {
    const user = this;
    const {password} = user;
    const isValidPassword = await bcrypt.compare(passwordByUser,password);
    return isValidPassword;
    
}

const User = mongoose.model("User",userSchema)

module.exports = User;