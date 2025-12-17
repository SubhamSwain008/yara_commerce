import { create } from 'zustand';


interface MerChantUserState{
    name:string;
    email:string;
    setMerchEmail:(email:string)=>void;
    setMerchName:(name:string)=>void

}

export const MerChantUserdata=create<MerChantUserState>((set)=>({
    name:"jane doe",
    email:"example@email.com",
    setMerchEmail:(email)=>{
        set(()=>({email}));
        console.log(email)
    
    },
    setMerchName:(name)=>set(()=>({name})),
}));