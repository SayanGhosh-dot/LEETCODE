const {getlanguageById,submitbatch,submittoken}=require("../utilitis/problemutility");
const problem=require("../src/models/problem");
const user=require("../src/models/user");
const submissions = require("../src/models/submission");


const createproblem=async (req,res)=>
{
    const{title,description,difficulty,tags,visibletestcases,hiddentestcases,startcode,referencesolution,problemcreator}=req.body;  
    try{
       for(const {language,completecode} of  referencesolution)
       {
         const languageid=getlanguageById(language);
         //const languageid = getlanguageById(language);
if (!languageid) {
  return res.status(400).send(`Invalid language: ${language}`);
}

         const submissions=  visibletestcases.map((testcase)=>({
            source_code:completecode,
            language_id: languageid,
            stdin: testcase.input,
            expected_output: testcase.output
         }))

         const submitResult=await submitbatch(submissions);
         //console.log(submitResult);
         const resulttoken=submitResult.map((value)=>value.token);
         const testresult=await submittoken(resulttoken);
        // console.log(testresult);
         for(const test of testresult)
         {
            //console.log(test.status_id);
            if(test.status_id!=3)
            {
               return res.status(400).send("Error occured");
            }
         }

        //  for(const element of visibletestcases)
        //  {

        //  }
       }
       //we can store now it our database
      const userproblem= await problem.create({
         ...req.body,
         problemcreator:req.result._id
       })
       res.status(201).send("problem saved successfully");

    }
    catch(err)
    {
     res.status(400).send("Error"+err.message);
    }
}

const updateproblem=async(req,res)=>
{
   const{id}=req.params;
   const{title,description,difficulty,tags,visibletestcases,hiddentestcases,startcode,referencesolution,problemcreator}=req.body;  

   try{
      if(!id)
      {
        return  res.status(401).send("Missing Id");
      }
      const dsaproblem=await problem.findById(id);
      if(!dsaproblem)
      {
         return res.status(401).send("id is not present in server");
      }
       for(const {language,completecode} of  referencesolution)
       {
         const languageid=getlanguageById(language);
         //const languageid = getlanguageById(language);

         const submissions=  visibletestcases.map((testcase)=>({
            source_code:completecode,
            language_id: languageid,
            stdin: testcase.input,
            expected_output: testcase.output
         }))

         const submitResult=await submitbatch(submissions);
         //console.log(submitResult);
         const resulttoken=submitResult.map((value)=>value.token);
         const testresult=await submittoken(resulttoken);
        // console.log(testresult);
         for(const test of testresult)
         {
            //console.log(test.status_id);
            if(test.status_id!=3)
            {
               return res.status(400).send("Error occured");
            }
         }
       }
     const newproblem= await  problem.findByIdAndUpdate(id,{...req.body},{runValidators:true,new:true});
     res.status(200).send(newproblem);

   }
   catch{
      res.status(404).send("Error"+err.message);

   }
}
const deleteproblem=async(req,res)=>
{
   const{id}=req.params;
   if(!id)
      {
        return  res.status(401).send("Missing Id");
      }

   try{
     const deletedproblem=await problem.findByIdAndDelete(id);

     if(!deletedproblem)
     {
      return res.status(404).send("problem is missing");
     }
     res.status(200).send("successfully deleted");

   }
   catch{
      res.status(500).send("Error"+err.message);

   }
}

const getproblembyid=async(req,res)=>
{
   const{id}=req.params;
   if(!id)
      {
        return  res.status(401).send("Missing Id");
      }

   try{
     const getproblem=await problem.findById(id).select(" _id itle description difficulty tags visibletestcases  startcode ");

     if(!getproblem)
     {
      return res.status(404).send("problem is missing");
     }
     res.status(200).send(getproblem);

   }
   catch{
      res.status(500).send("Error"+err.message);

   }
}
const getallproblem=async(req,res)=>
{


   try{
     const getproblem=await problem.find({}).select("_id title difficulty tags");

     if(getproblem.length==0  )
     {
      return res.status(404).send("problem is missing");
     }
     res.status(200).send(getproblem);

   }
   catch{
      res.status(500).send("Error"+err.message);

   }
}
 
const solvedallproblembyuser=async(req,res)=>
{
   try{
    //  const count=req.result.problemsolved.length;
    const userid=req.result._id;
   const User= await user.findById(userid).populate({
      path:"problemsolved",
      select:"_id title difficulty tags"
   });
      res.status(200).send(User.problemsolved);

   }
   catch{
      res.status(500).send("server error");
   }

}
const submittedproblem=async(req,res)=>
{
   try
   {
      const userid=req.result._id;
      const problemid=req.params.id;
     const ans=await submissions.find({userid,problemid});
     if(ans.length==0)
     {
      res.send("no submission");
     }
     res.status(200).send(ans);

   }
   catch{
      res.status(500).send("internal server error");

   }
}


module.exports={createproblem,updateproblem,deleteproblem,getproblembyid,getallproblem,solvedallproblembyuser,submittedproblem};