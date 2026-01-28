const mongoose=require("mongoose");
async function main()
{
    
    if (!process.env.DB_CONNECT_KEY) {
        throw new Error("DB_CONNECT_KEY is not defined in .env file");
    }
    
    await mongoose.connect(process.env.DB_CONNECT_KEY);
    // console.log("MongoDB connected successfully");
    return mongoose.connection;
}
module.exports=main;