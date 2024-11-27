const express = require('express');
const { userAuth } = require('../middlewares/auth');
const userRouter = express.Router();
const ConnectionRequest = require('../models/connectionRequest');

const USER_SAFE_DATA="firstName lastName photoUrl about age gender skills";
//get all the pending connection request for the loggedin user
userRouter.get("/user/requests/received",userAuth, async(req,res)=>{
    try{
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id, 
            status: "interested"
        }).populate("fromUserId",USER_SAFE_DATA);
        res.json({
            message: "Connection requests fetched successfully", 
            data: connectionRequests
        });
    }catch(err){
        res.status(400).send('error while fetching requests:' + err.message);
    }
});
userRouter.get("/user/connections",userAuth, async(req,res)=>{
    try{
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                {
                    toUserId: loggedInUser._id,
                    status: "accepted"
                },
                {
                    fromUserId: loggedInUser._id,
                    status: "accepted"
                }
            ]
        }).populate("fromUserId",USER_SAFE_DATA).populate("toUserId",USER_SAFE_DATA);
        const data = connectionRequests.map((row)=>{
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId;
        });

        res.json({
            message: "Connections fetched successfully", 
            data
        });
    }catch(err){
        res.status(400).send('error while fetching connections:' + err.message);
    }
});
module.exports = userRouter;