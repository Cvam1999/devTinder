const mongoose = require('mongoose');
const validator = require('validator');
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
});
const User = mongoose.model('User', userSchema);
module.exports = User; 