import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const api=import.meta.env.VITE_API_URL;
export default function MerchantSignup(){
  const nav=useNavigate();
  const [userFullName,setFullName]=useState<string>("");
  const [userPhoneNumber,setPhoneNumber]=useState<number>();
  const [userEmail,setUserEmail]=useState<string>("");
  const [userPassword,setUserPassword]=useState<string>("");
  const [userCreation,setUserCreataion]=useState<Boolean>(false);
  const [errorMessage,setErrorMessage]=useState<string>("");
  
  const SignUpCall=async(e:any):Promise<void>=>{
  e.preventDefault();
try{
    setUserCreataion(true);


  const res=await axios.post(`${api}/api/auth/merch-signup`,{
            "email":userEmail,
            "fullName":userFullName,
            "phoneNumber":userPhoneNumber,
            "password":userPassword
            },
            {withCredentials:true});

//   console.log(res);

  if(res.data.message=="user created"){
    nav("/m-login");
  }
  setUserCreataion(false);

}catch(e:any){
    setUserCreataion(false);
   setErrorMessage(e.response.data.message);
  }

  }
  

  return (
    <>
    <h1>MerchantSignup</h1>
    {userCreation?<div><p>please wait user is getting created</p></div>:<div><form onSubmit={SignUpCall}>
      <input type="text"  placeholder="user name" value={userFullName}
      onChange={(e)=>setFullName(e.target.value)}/>
      <input type="number" placeholder="user phone number" value={userPhoneNumber}
      onChange={(e)=>setPhoneNumber(Number(e.target.value))}
      />
      <input type="text" placeholder="user email" value={userEmail}
      onChange={(e)=>setUserEmail(e.target.value)}
      />
      <input type="text" placeholder="password" value={userPassword}
      onChange={(e)=>setUserPassword(e.target.value)}
      />
      <button type="submit">Signup</button>

    </form>
    <p>{errorMessage}</p>
    <p>already have an account ?</p>
    <button onClick={()=>nav("/login")}>login</button>
    </div>}
    </>
  );
}
