const mongoose = require("mongoose");

const dbConnect = async () =>{
  await mongoose.connect("mongodb+srv://jaiganeshh:JAI2005@practice.ya79l.mongodb.net/devTinder");
}
module.exports = dbConnect;
