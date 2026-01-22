const validator=require("validator");
const validate=(data)=>
{
    const mandatoryfield=["firstname","emailid","password"];
    const isallowed=mandatoryfield.every((k)=>Object.keys(data).includes(k));
    if(!isallowed)
    {
        throw new Error("some field missing");
    }
    if(!validator.isEmail(data.emailid))
    {
        throw new Error("Invalid email");
    }
    if(!validator.isStrongPassword(data.password))
    {
        throw new Error("Invalid password");
    }
}
module.exports=validate;