import Product from "../../../models/Products.js";

export const ListAllProducts=async(req,res)=>{
    try{
        const prodcut=await Product.find();
        return res.status(200).json({prodcut})

    }catch(e){
        console.log(e);
        return res.status(404).json({message:"no products found , probably an internal error"})
    }
}

export const ListProducts=async(req,res)=>{
   try{ const filter={};
    const {search ,rating, MaxPrice ,MinPrice,catagory}=req.body;
    if(!search && !rating && !MaxPrice && !MinPrice && !catagory) return res.status(404).json({message:"please enter anyhting to filter"});

    if(search){
        filter.name= { $regex: search, $options: "i" };
    }
    if(rating){
        filter.rating={$gte:Number(rating)};
    }
    if(catagory){
        filter.catagory=catagory;
    }
    if(MinPrice){
        filter.price={};
        filter.price.$gte=Number(MinPrice);
        if(MaxPrice)filter.price.$lte=Number(MaxPrice);
    }
    const prodcuts= await Product.find(filter);

    return res.status(202).json({prodcuts})
    }
    catch(e){
        console.log(e);
        return res.status(400).json({message:"searching failed due to internal errors"});
    }
}