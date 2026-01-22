const express=require("express");
const {register,login,logout,adminRegister,deleteprofile}=require("../controller/userAuthent");
const userMiddleware=require("../src/middleware/usermiddleware");
const adminmiddleware=require("../src/middleware/adminmiddleware");
const authrouter=express.Router();

authrouter.post("/register",register);
authrouter.post("/login",login);
authrouter.post("/logout",userMiddleware,logout);
authrouter.post("/admin/register",adminmiddleware,adminRegister);
authrouter.delete("/profile",userMiddleware,deleteprofile);
authrouter.get("/check",userMiddleware,(req,res)=>
{
    const reply={
        firstname:req.result.firstname,
        emailid:req.result.emailid,
        _id:req.result._id
    }
    res.status(200).json({
        user:reply,
        message:"valid user"
    })
})
//authrouter.post("/getprofile",getprofile);
module.exports=authrouter;