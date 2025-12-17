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
    catagory:{
        type:String,
        required:true,
        enum: ["men-tshirts",
                "men-shirts",
                "men-jeans",
                "men-kurtas",
                "women-tops",
                "women-kurtis",
                "women-sarees",
                "women-dresses",
                "kids-wear",
                "ethnic-wear",
                "winter-wear",
                "activewear",
                "accessories",
                "footwear"],

    },
    rating:{
        type:Number,
        default:0,
        
    },
    ratingCount:{
        type:Number,
        default:0,
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