import mongoose  from "mongoose";


const UserSchema=new mongoose.Schema({
    FullName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        unique:true,
        required:true,
    },
    phoneNumber:{
        type:Number,
        unique:true,
        require:true,
    },
    password:{
        type:String,
        required:true,
    },
    gender:{
        type:String,
        enum:["male","female","other"],
    },
    dateOfBirth:{
        type:Date,
    },
    address:[{
        type:String,
        required:true,
    }]
},{timestamps:true});

export const Users= mongoose.model("Users",UserSchema);