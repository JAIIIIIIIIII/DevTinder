const mongoose = require("mongoose");

const dbConnect = async () =>{
  //console.log(process.env.DB_CONNECTION);
  
  await mongoose.connect(process.env.DB_CONNECTION);
}
module.exports = dbConnect;
