const express= require("express");
const app = express();
const cookieParser = require('cookie-parser');
const dbConnect = require("./config/database");
const bcrypt = require('bcrypt');
const User = require("./models/user");
const userAuth = require("./middlewares/auth");
const authRouter = require("./routes/authRoute");
const profileRouter = require("./routes/profileRoute");
const connectionRouter = require("./routes/connectionRoute");
const userRoute = require("./routes/userscreen");
const cors = require('cors');

require('dotenv').config();
app.use(express.json());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}))
app.use(cookieParser());

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",connectionRouter);
app.use("/",userRoute);
dbConnect()
.then(()=>{
    console.log("Server Connected");
    app.listen(3000,()=>{
        console.log("server running at 3000");
        
    })

})
.catch((err)=>{
    console.log(err);
})

