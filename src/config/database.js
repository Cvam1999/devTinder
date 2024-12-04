const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://shivamgupta27101999:kSJtgEnzGzXS3VD2@namastenodejs.4ycpg.mongodb.net/devTinder"
  );
};
module.exports = connectDB;
