const mongoose=require("mongoose");
const problem = require("./problem");
const {Schema}=mongoose;
const userschema=new Schema({
    firstname:{
        type:String,
        required:true,
        minLength:3,
        maxLength:20
    },
    lastname:{
        type:String,
        minLength:2,
        maxLength:20
    },
    emailid:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        immutable:true,
        lowercase:true
    },
    age:{
        type:Number,
        min:6,
        max:80
    },
    role:{
        type:String,
        enum:["user","admin"],
        default:"user"
    },
    problemsolved:{
        type:[
            {
                type:Schema.Types.ObjectId,
                ref:"problem"
            }
        ],
        unique:true
    },
    password:{
        type:String,
        required:true
    }
},{
    timestamps:true
})
const user=mongoose.model("user",userschema);
module.exports=user;