const express=require("express");
const problemRouter=express.Router();
const adminmiddleware=require("../src/middleware/adminmiddleware");
const {createproblem,updateproblem,deleteproblem,getproblembyid,getallproblem,solvedallproblembyuser,submittedproblem}=require("../controller/userproblem");
const userMiddleware=require("../src/middleware/usermiddleware");
const user = require("../src/models/user");

problemRouter.post("/create",adminmiddleware,createproblem);
problemRouter.put("/update/:id",adminmiddleware,updateproblem);
problemRouter.delete("/delete/:id",adminmiddleware,deleteproblem);

problemRouter.get("/problembyid/:id",userMiddleware,getproblembyid);
problemRouter.get("/getallproblem",userMiddleware,getallproblem);
problemRouter.get("/problemsolvedbyuser",userMiddleware,solvedallproblembyuser);
problemRouter.get("/submittedproblem/:id",userMiddleware,submittedproblem)

module.exports=problemRouter;