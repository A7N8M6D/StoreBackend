import multer from "multer";

const storage =multer.diskStorage(
    {
    
        destination:function(req , res, cb){
            console.log("Storage Level 0")
        cb(null ,"../../public")
        console.log("Storage Level 1")
        },
        filename:function(req ,file ,cb)
        {
            console.log("File Name Level 0")
            console.log("file.originalname||file.name",file.originalname ,file.name)
            cb(null ,file.originalname)
            console.log("File Name Level 1")
        }   
    }
)
export const upload = multer({storage,})