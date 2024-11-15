const express= require('express');
const app = express();
//const {adminAuth} = require('./middlewares/auth');

// app.use("/admin",adminAuth);

// app.get("/admin/getAllData",(req,res)=> {
//     res.send('All data sent!');
// });
// app.get("/admin/deleteUser",(req,res)=> {
//     res.send('Deleted a user!');
// });
    app.get("/getUserData",(req,res)=>{
            throw new Error("gwqdqaeerg");  
        res.send('User data sent!');

    });
    app.use("/",(err,req,res,next)=>{
        if(err){
            res.status(500).send("something went wrong");
        }
    });

app.listen(3000, () => {   
    console.log('Server is running on port 3000');
}); 