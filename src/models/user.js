const mongoose = require('mongoose');
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
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true,
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