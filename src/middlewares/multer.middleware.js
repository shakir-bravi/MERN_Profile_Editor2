import multer from "multer"


// Multer Configuration
const storage = multer.diskStorage({
    destination: function (req,_,cb) {
        cb(null , "public/temp")
        
    },
    filename:function (_,file,cb) {
        cb(null , `(${Math.floor(Math.random()*999)})_${file.originalname}`)

        
    }
})

export const upload = multer({storage})