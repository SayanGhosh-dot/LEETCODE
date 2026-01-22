const validate=require("../utilitis/validator");
const User=require("../src/models/user");
// const redisClient=require("../src/config/redis");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const submission=require("../src/models/submission");

const register = async (req,res)=>{
    
    try{
        // validate the data;
      validate(req.body); 
      const {firstName, emailid, password}  = req.body;

      req.body.password = await bcrypt.hash(password, 10);
      req.body.role = 'user'
    //
    
     const user =  await User.create(req.body);
     const token =  jwt.sign({_id:user._id , emailid:emailid, role:'user'},process.env.JWT_KEY,{expiresIn: 60*60});
     const reply={
            firstName:user.firstname,
            emailid:user.emailid,
            _id:user._id
        }
     res.cookie('token',token,{maxAge: 60*60*1000});
       res.status(201).json({
            user:reply,
            message:"loggin successfully"

        })
    }
    catch(err){
        res.status(400).send("Error: "+err);
    }
}


const login = async (req,res)=>{

    try{
        const {emailid, password} = req.body;

        if(!emailid)
            throw new Error("Invalid Credentials");
        if(!password)
            throw new Error("Invalid Credentials");

        const user = await User.findOne({emailid});

        const match = await bcrypt.compare(password,user.password);

        if(!match)
            throw new Error("Invalid Credentials");
        const reply={
            firstName:user.firstname,
            emailid:user.emailid,
            _id:user._id
        }

        const token =  jwt.sign({_id:user._id , emailid:emailid, role:user.role},process.env.JWT_KEY,{expiresIn: 60*60});
        res.cookie('token',token,{maxAge: 60*60*1000});  
        res.status(201).json({
            user:reply,
            message:"loggin successfully"

        })
    }
    catch(err){
        res.status(401).send("Error: "+err);
    }
}


// logOut feature

const logout = async(req,res)=>{

    try{
        const {token} = req.cookies;
        const payload = jwt.decode(token);

        // await redisClient.set(`token:${token}`,'Blocked');
        // await redisClient.expireAt(`token:${token}`,payload.exp);
    //    Token add kar dung Redis ke blockList
    //    Cookies ko clear kar dena.....

    res.cookie("token",null,{expires: new Date(Date.now())});
    res.send("Logged Out Succesfully");

    }
    catch(err){
       res.status(503).send("Error: "+err);
    }
}


const adminRegister = async(req,res)=>{
    try{
        // validate the data;
    //   if(req.result.role!='admin')
    //     throw new Error("Invalid Credentials");  
      validate(req.body); 
      const {firstName, emailid, password}  = req.body;

      req.body.password = await bcrypt.hash(password, 10);
    //
     req.body.role = 'admin'
     const user =  await User.create(req.body);
     const token =  jwt.sign({_id:user._id , emailid:emailid, role:user.role},process.env.JWT_KEY,{expiresIn: 60*60});
     res.cookie('token',token,{maxAge: 60*60*1000});
     res.status(201).send("User Registered Successfully");
    }
    catch(err){
        res.status(400).send("Error: "+err);
    }
}

const deleteprofile=async(req,res)=>
{
    try
    {
        const userid=req.result._id;
       await User.findByIdAndDelete(userid);
        await submission.deleteMany({userid});
        res.status(200).send("deleted successfully");


    }
    catch(err){
     res.status(500).send("internal server error");
    }

}


module.exports = {register, login,logout,adminRegister,deleteprofile};