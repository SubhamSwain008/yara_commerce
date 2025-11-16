import { useState } from "react";
import axios from "axios";

const api=import.meta.env.VITE_API_URL;
export default function Login(){
  
  const [userEmail,setUserName]=useState<string>("");
  const [userPassword,setUserPassword]=useState<string>("");
  
  const LoginCall=async(e:any):Promise<void>=>{
  e.preventDefault();

  const res=await axios.post(`${api}/api/auth/merch-login`,{"email":userEmail,
            "password":userPassword},{withCredentials:true});

  console.log(res);

  }
  

  return (
    <>
    <form onSubmit={LoginCall}>
      
      <input type="text" placeholder="user email" value={userEmail}
      onChange={(e)=>setUserName(e.target.value)}
      />
      <input type="text" placeholder="password" value={userPassword}
      onChange={(e)=>setUserPassword(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
    </>
  );
}
