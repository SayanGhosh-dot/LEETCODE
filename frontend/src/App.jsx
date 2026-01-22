import { Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Homepage from "./pages/homepage";
import { checkAuth } from "../authslice"; 
import { useDispatch,useSelector } from "react-redux";
import { useEffect } from "react";

function  App()
{
  const {isAuthenticated}=useSelector((state)=>state.auth);
  const dispatch=useDispatch();
  useEffect(()=>
  {
    dispatch(checkAuth);
  },)
  return (
    <>
   <Routes>
    <Route path="/" element={<Homepage></Homepage>}></Route>
    <Route path="/login" element={<Login></Login>}></Route>
    <Route path="/signup" element={<Signup></Signup>}></Route>
   </Routes>
    </>
  )
}

export default App;
