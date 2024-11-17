const express= require('express');
const app = express();
const connectDB = require('./config/database');
const e = require('express');
const User = require('./models/user');
const { ConnectionPoolClosedEvent } = require('mongodb');
//const {adminAuth} = require('./middlewares/auth');

// app.use("/admin",adminAuth);

// app.get("/admin/getAllData",(req,res)=> {
//     res.send('All data sent!');
// });
// app.get("/admin/deleteUser",(req,res)=> {
//     res.send('Deleted a user!');
// });

    // app.get("/getUserData",(req,res)=>{
    //         throw new Error("gwqdqaeerg");  
    //     res.send('User data sent!');

    // });
    // app.use("/",(err,req,res,next)=>{
    //     if(err){
    //         res.status(500).send("something went wrong");
    //     }
    // });
    app.use(express.json());
    app.post("/signup", async(req,res)=>{
        const user = new User(req.body);
        try{
            await user.save();
            res.send('User created successfully');
        }catch(err){
            res.status(400).send('error while saving user:' + err.message);
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
