import multer from "multer";
import path from "path";


const multerStorage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"/tmp");
    },
    filename:function(req,file,cb){
        const mid=Date.now();
        cb(null,file.fieldname+"-"+mid);
    }
})

export const uploadMulter=multer({storage:multerStorage});