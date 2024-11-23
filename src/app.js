const express= require('express');
const app = express();
const connectDB = require('./config/database');
const e = require('express');
const User = require('./models/user');
const { ConnectionPoolClosedEvent } = require('mongodb');
const {validateSignUpData} = require('./utils/validation');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require("jsonwebtoken");
const { userAuth} = require('./middlewares/auth');

// app.use("/admin",adminAuth);

    app.use(express.json());
    app.use(cookieParser());
    app.use("/login", async(req,res)=> {
        try{
            const{emailId, password} = req.body;
            const user = await User.findOne({emailId: emailId});
            if(!user){
                throw new Error("Email ID not present in DB");
            }
            const isPasswordValid = await user.validatePassword(password);
            if(isPasswordValid){

                //create a JWT token
                const token = await user.getJWT();
              
                //add the token to the cookie and send the response back to user
                res.cookie("token",token, {expires: new Date(Date.now() + 86400000)});
                res.send('Login successful!');
                
            }else{
                throw new Error("Password is not valid");
            }
        }catch(err){
            res.status(400).send('error while login:' + err.message);
        }
    });
    app.post("/sendConnectionRequest",userAuth, async(req,res)=> {
        //sending a connection request
        console.log("sending a connection request");
        res.send('connection request sent');
    });
    app.use("/profile", userAuth, async(req,res)=>{
        try{
            const user = req.user;
            res.send(user);
        }catch(err){
            res.status(400).send('error while login:' + err.message);
        }
    });  

    app.get("/user", async(req,res)=>{
         try{
             const users = await User.find({emailId: req.body.emailId});
             if(users.length === 0){
                    return res.status(404).send('User not found');
             }
             else{
                    return res.send(users);
             }
         }catch(err){
             res.status(400).send('error while fetching user:' + err.message);
         }
    });

    app.get("/feed", async(req,res)=>{
        try{
            const users = await User.find({});
            res.send(users);
        }catch(err){
            res.status(400).send('error while fetching users:' + err.message);
        }
    });
    app.post("/signup", async(req,res)=>{
        try{
            // validation of data
            validateSignUpData(req);
            //encrypt password
            const{password, firstName,lastName,emailId} = req.body;
           const passwordHash = await bcrypt.hash(password, 10);
           console.log(passwordHash);
        const user = new User({firstName,lastName,emailId,password: passwordHash});
            await user.save();
            res.send('User created successfully');
        }catch(err){
            res.status(400).send('ERROR : ' + err.message);
        }
    });
    app.delete("/user", async(req,res)=>{
        const userId = req.body.userId;
        try{
            const users = await User.findByIdAndDelete(userId);
            res.send('User deleted successfully');
        }catch(err){    
            res.status(400).send('error while deleting user:' + err.message);
        }
    });
    app.patch("/user/:userId", async(req,res)=>{
        const userId = req.params?.userId;
        const data = req.body;

        
        try{
            const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];
        const isUpdateAllowed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k));

        if(!isUpdateAllowed){
            throw new Error("update not allowed");
        }
        if(data?.skills.length> 10){
            throw new Error("skills array length should be less than 10");
        }

            const users = await User.findByIdAndUpdate(userId, data, {
                returnDocument: 'after',
                runValidators: true
            }); 
            console.log(users);         
            res.send('User updated successfully');
        }catch(err){
            res.status(400).send('error while updating user: ' + err.message);
        }
    });
    
    connectDB().then(() => {
        console.log("Database connected");
        app.listen(3000, () => {   
            console.log('Server is running on port 3000');
        }); 
    }).catch((err) => {
        console.error("Error connecting database", err);
    });

