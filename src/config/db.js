const mongoose=require("mongoose");
async function main()
{
    console.log("Connecting to MongoDB...");
    console.log("DB_CONNECT_KEY:", process.env.DB_CONNECT_KEY ? "Set" : "Not set");
    
    if (!process.env.DB_CONNECT_KEY) {
        throw new Error("DB_CONNECT_KEY is not defined in .env file");
    }
    
    await mongoose.connect(process.env.DB_CONNECT_KEY);
    console.log("MongoDB connected successfully");
    return mongoose.connection;
}
module.exports=main;