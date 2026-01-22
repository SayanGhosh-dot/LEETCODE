const mongoose=require("mongoose");
async function main()
{
    console.log("Connecting to MongoDB...");
    console.log("DB_CONNECT_KEY:", process.env.DB_CONNECT_KEY ? "Set" : "Not set");
    await mongoose.connect(process.env.DB_CONNECT_KEY);
}
module.exports=main;