const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema({    
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email is not valid " + value);
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Please try with strong password " + value);
            }
        }
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
       validate(value){
        if(!["male", "female", "other"].includes(value)){
            throw new Error("Gender data is not valid");
        }
    }
    },
    photoUrl: {
        type: String,
        default: "https://media.istockphoto.com/id/1142192548/vector/man-avatar-profile-male-face-silhouette-or-icon-isolated-on-white-background-vector.jpg?s=612x612&w=0&k=20&c=DUKuRxK9OINHXt3_4m-GxraeoDDlhNuCbA9hp6FotFE=",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("URL is not valid " + value);
            }
        }
    },
    about: {
        type: String,
        default: "This is default description of the user"
    },
    skills: {
        type: [String],
    },
},
{
    timestamps: true
}
);
userSchema.methods.getJWT= async function(){
    const user = this;
    const token = await jwt.sign({_id: user._id},"DEV@TINDER",{expiresIn: "1d"});
    return token;
}
userSchema.methods.validatePassword = async function(passwordInputByUser){
    const user = this;
    const passwordHash = user.password;
    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);
    return isPasswordValid;
}
     
const User = mongoose.model('User', userSchema);
module.exports = User; 