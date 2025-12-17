import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MerChantUserdata } from "../userdata_handel/basicMercahnt_data";
const api = import.meta.env.VITE_API_URL;

export default function MerchantLogin() {
  const nav = useNavigate();
  const [userEmail, setUserName] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const setMerchEmail= MerChantUserdata(state=>state.setMerchEmail);
  const setMerchName= MerChantUserdata(state=>state.setMerchName);


  const LoginCall = async (e: any): Promise<void> => {
    e.preventDefault();
    setErrorMsg(""); // reset before request

    try {
      const res = await axios.post(
        `${api}/api/auth/merch-login`,
        { email: userEmail, password: userPassword },
        { withCredentials: true }
      );

      if (res.data.message === "login sucessful") {
       
        setMerchName(res.data.name);
        setMerchEmail(res.data.email);
        
        nav("/MerchDash");
       
      } else {
        setErrorMsg(res.data.message || "Login failed");
      }
    } catch (err:any) {
      console.log(err.response);
  setErrorMsg(err.response.data.message);
}

  };

  return (
    <>
    <h1>Merchant Login</h1>
      <form onSubmit={LoginCall}>
        <input
          type="text"
          placeholder="user email"
          value={userEmail}
          onChange={(e) => setUserName(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          value={userPassword}
          onChange={(e) => setUserPassword(e.target.value)}
        />

        {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

        <button type="submit">Login</button>
      </form>

      <p>want to create new account?</p>
      <button onClick={() => nav("/m-signup")}>signup</button>
    </>
  );
}
