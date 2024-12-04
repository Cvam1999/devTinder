const express = require("express");
const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");

authRouter.post("/signup", async (req, res) => {
  try {
    // validation of data
    validateSignUpData(req);
    //encrypt password
    const { password, firstName, lastName, emailId } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    const savedUser = await user.save();
    const token = await savedUser.getJWT();

    res.cookie("token", token, { expires: new Date(Date.now() + 86400000) });
    res.json({ message: "User created successfully", data: savedUser });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Email ID not present in DB");
    }
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      //create a JWT token
      const token = await user.getJWT();

      //add the token to the cookie and send the response back to user
      res.cookie("token", token, { expires: new Date(Date.now() + 86400000) });
      res.send(user);
    } else {
      throw new Error("Password is not valid");
    }
  } catch (err) {
    res.status(400).send("error while login:" + err.message);
  }
});
authRouter.post("/logout", async (req, res) => {
  try {
    res.cookie("token", null, { expires: new Date(Date.now()) });
    res.send("Logout successful!");
  } catch (err) {
    res.status(400).send("error while logout:" + err.message);
  }
});
module.exports = authRouter;
