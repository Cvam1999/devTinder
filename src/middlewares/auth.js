const jwt=require('jsonwebtoken');
const User = require('../models/user');

const userAuth= async(req,res,next)=>{
   //Read the token from req cookies
   try{
    const {token} = req.cookies;
    if(!token){
       return res.status(401).send('Unauthorized user Please login');  
    }
   const decodedObj = await jwt.verify(token,"DEV@TINDER");
   const { _id} = decodedObj;
   const user = await User.findById(_id);
    if(!user){
         throw new Error("user not found");
    }
    req.user = user;
    next();
    }catch(err){
        res.status(400).send('error while login:' + err.message);
    }

   //validate the token
   //find the user
}
module.exports={userAuth};