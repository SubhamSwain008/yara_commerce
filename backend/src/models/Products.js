import mongoose from "mongoose";


const productSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    picture:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,

    },
    catogory:{
        type:String,
        required:true,
    },
    rating:{
        type:Number,
        
    },
    ratingCount:{
        type:Number,
    },
    seller:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Merchants",
        required:true,
    },
    stock:{
        type:Number
    },
    description:{
        type:String,
        required:true,
    },
    specification:{
        type:String,
        required:true
    },
    reviews:[{
        type:String,
        
    }]
},{timestamps:true});


const Product=mongoose.model("Product",productSchema);
export default Product;