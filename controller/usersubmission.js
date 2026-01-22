const  problem=require("../src/models/problem");
const submission=require("../src/models/submission");
const {getlanguageById,submitbatch,submittoken}=require("../utilitis/problemutility");

const submitcode=async(req,res)=>
{
    try{
        const userid=req.result._id;
        const problemid=req.params.id;
        const {code,language}=req.body;
        if(!userid || !code || !problemid || !language)
        {
           return res.status(400).send("some field missing");
        }
        const problemdoc=await problem.findById(problemid);
        //console.log(problemdoc);
       const submittedresult=await  submission.create({
        userid,
        problemid,
        code,
        language,
        testcasespassed:0,
        status:"pending",
        testcasestotal:problemdoc.hiddentestcases.length

        })
        //submit the code to judge0
      const languageid=getlanguageById(language);
         
     const submissions=  problemdoc.hiddentestcases.map((testcase)=>({
            source_code:code,
            language_id: languageid,
            stdin: testcase.input,
            expected_output: testcase.output
         }))
          const submitResult=await submitbatch(submissions);
           const resulttoken=submitResult.map((value)=>value.token);
         const testresult=await submittoken(resulttoken);
       
         //update the submitresult
         let testcasespassed=0;
         let runtime=0;
         let memory=0;
         let status="accepted";
         let errormessage=null;
         for(const test of testresult)
         {
            if(test.status_id==3)
            {
                testcasespassed++;
                runtime=runtime+parseFloat(test.time);
                memory=Math.max(memory,test.memory);

            }
            else{
                if(test.status_id==4)
                {
                    status="error";
                    errormessage=test.stderr;
                }
                else
                {
                    status="wrong";
                     errormessage=test.stderr;
                }

            }

         }
       //store the result of submission
       submittedresult.status=status;
       submittedresult.testcasespassed=testcasespassed;
       submittedresult.errormessage=errormessage;
       submittedresult.runtime=runtime;
       submittedresult.memory=memory;
       await submittedresult.save();
       res.status(201).send(submittedresult);
       //insert the problem id into problemsolved of user
      if(! req.result.problemsolved.includes(problemid))
      {
        req.result.problemsolved.push(problemid);
        await req.result.save();
      }

    }
    catch{
        res.status(500).send("internal server error");

    }

}
const runcode=async(req,res)=>
{
  try{
        const userid=req.result._id;
        const problemid=req.params.id;
        const {code,language}=req.body;
        if(!userid || !code || !problemid || !language)
        {
           return res.status(400).send("some field missing");
        }
        const problemdoc=await problem.findById(problemid);
        //console.log(problemdoc);
   
        //submit the code to judge0
      const languageid=getlanguageById(language);
         
     const submissions=  problemdoc.hiddentestcases.map((testcase)=>({
            source_code:code,
            language_id: languageid,
            stdin: testcase.input,
            expected_output: testcase.output
         }))
          const submitResult=await submitbatch(submissions);
           const resulttoken=submitResult.map((value)=>value.token);
         const testresult=await submittoken(resulttoken);
         res.status(201).send(testresult);
        }
        catch{
           res.status(500).send("internal server error");

        }
       
         //update the submitresult
       


}


module.exports={submitcode,runcode};