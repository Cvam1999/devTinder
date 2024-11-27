const express= require('express');
const app = express();
const connectDB = require('./config/database');
const e = require('express');
const { ConnectionPoolClosedEvent } = require('mongodb');
const cookieParser = require('cookie-parser');
const jwt = require("jsonwebtoken");
const { userAuth} = require('./middlewares/auth');



    app.use(express.json());
    app.use(cookieParser());
   
  const authRouter = require('./routes/auth');
  const profileRouter = require('./routes/profile');
  const requestRouter = require('./routes/request');
  const userRouter = require('./routes/user');

  app.use('/', authRouter);
  app.use('/', profileRouter);
  app.use('/', requestRouter);
  app.use('/', userRouter);
   

    // app.get("/user", async(req,res)=>{
    //      try{
    //          const users = await User.find({emailId: req.body.emailId});
    //          if(users.length === 0){
    //                 return res.status(404).send('User not found');
    //          }
    //          else{
    //                 return res.send(users);
    //          }
    //      }catch(err){
    //          res.status(400).send('error while fetching user:' + err.message);
    //      }
    // });

    // app.get("/feed", async(req,res)=>{
    //     try{
    //         const users = await User.find({});
    //         res.send(users);
    //     }catch(err){
    //         res.status(400).send('error while fetching users:' + err.message);
    //     }
    // });
  
    // app.delete("/user", async(req,res)=>{
    //     const userId = req.body.userId;
    //     try{
    //         const users = await User.findByIdAndDelete(userId);
    //         res.send('User deleted successfully');
    //     }catch(err){    
    //         res.status(400).send('error while deleting user:' + err.message);
    //     }
    // });
    // app.patch("/user/:userId", async(req,res)=>{
    //     const userId = req.params?.userId;
    //     const data = req.body;

        
    //     try{
    //         const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];
    //     const isUpdateAllowed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k));

    //     if(!isUpdateAllowed){
    //         throw new Error("update not allowed");
    //     }
    //     if(data?.skills.length> 10){
    //         throw new Error("skills array length should be less than 10");
    //     }

    //         const users = await User.findByIdAndUpdate(userId, data, {
    //             returnDocument: 'after',
    //             runValidators: true
    //         }); 
    //         console.log(users);         
    //         res.send('User updated successfully');
    //     }catch(err){
    //         res.status(400).send('error while updating user: ' + err.message);
    //     }
    // });
    
    connectDB().then(() => {
        console.log("Database connected");
        app.listen(3000, () => {   
            console.log('Server is running on port 3000');
        }); 
    }).catch((err) => {
        console.error("Error connecting database", err);
    });

