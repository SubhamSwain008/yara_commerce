import mongoose from "mongoose";

const merchantSchema= new mongoose.Schema({
   
    email:{
        type:String,
        unique:true,
        required:true,
    },
    fullName:{
        type:String,
        required:true,
    },
    isAdmin:{
        type:Boolean,
        default:false,

    },
    isApprovedByAdmin:{
        type:Boolean,
        default:false,
    },
    phoneNumber:{
        type:Number,
        unique:true,
        require:true,
    },
    Products:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        default:[],
    }],
    emailVerified:{
        type:Boolean,
        default:false,
    },
    otp:{
        type:Number,
        default:null,
        
    },
    password:{
        type:String,
        required:true,
    }


},{timestamps:true}) ;

const Merchants= mongoose.model("Merchants",merchantSchema);

export default Merchants;