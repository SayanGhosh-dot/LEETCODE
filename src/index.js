const express=require("express");
const app=express();
const main=require("./config/db");
const cookieParser = require('cookie-parser');
require('dotenv').config();
const authrouter=require("../routes/userAuth")
const redisclient=require("../src/config/redis");
const problemRouter=require("../routes/problemcreator");
const submitrouter=require("../routes/submit");




app.use(express.json());
app.use(cookieParser());

app.use('/user',authrouter);
app.use("/problem",problemRouter);
app.use("/submission",submitrouter)


const InitalizeConnection = async ()=>{
    try{
        await redisclient.connect();
        console.log("Redis Connected");
        
        await main();
        console.log("DB Connected");
        
        app.listen(process.env.PORT_NUMBER, ()=>{
            console.log("Server listening at port number: "+ process.env.PORT_NUMBER);
        })
    }
    catch(err){
        console.log("Error:"+err.message);
    }
}

InitalizeConnection();