// import path from 'path'
// import fs from 'fs'
// import { error } from 'console'

// const Userstorage = multer.diskStorage({
//     destination: (req, file, cb)=>{
//         try
//         {
//             console.log("reached ")
//             console.log(req)
//             const userName = req.body.carData?.name
//             const folderPath = path.join('uploads', 'User', userName)
    
//             if(!fs.existsSync(folderPath))
//             {
//                 fs.mkdirSync(folderPath, { recursive: true });
//             }
    
//             cb(null, folderPath)
//         }
//         catch(error:any)
//         {
//             throw new Error(error.message)
//         }
       
//     },
//     filename:(req, file, cb)=>{
//         try
//         {
//             cb(null, Date.now() + path.extname(file.originalname))
//         }
//         catch(error:any)
//         {
//             throw new Error(error.message)
//         }
//     }
// })
// const productStorage = multer.diskStorage({
//     destination:(req, file, cb)=>{
//         try
//         {
//         console.log("entering multer")
//         console.log(req.files)
//         console.log(req.body)
//         console.log("field name : ",file.fieldname)
//         console.log(req.body.name)
//         if(req.body.name && file.fieldname)
//         {
//             const fieldsName = file.fieldname
//             const productName = req.body.name
//             console.log(productName)
//             const folderPath = path.join('uploads', 'Cars', productName)
            
//             if(!fs.existsSync(folderPath))
//             {
//                 fs.mkdirSync(folderPath, {recursive:true})
//             }

//             const finalDestination = path.join(folderPath, fieldsName)

//             if(!fs.existsSync(finalDestination))
//             {
//                 fs.mkdirSync(finalDestination, {recursive:true})
//             }

            
//             cb(null, finalDestination)
//         }
//         else
//         {
//             throw new Error('')
//         }
        
//       }
//       catch(error:any){
//         throw new Error(error)
//       }
//     },
//     filename:(req, file, cb)=>{
//         try
//         {
//             const fileName = Date.now() + path.extname(file.originalname);

//             console.log('File saved with name:', fileName);

//             cb(null, fileName)
//         }
//         catch(error:any)
//         {
//             throw new Error(error.message)
//         }
//     }
// })


// const productUpload = multer({storage:productStorage})
// const userUpload = multer({storage:Userstorage})

// export {productUpload, userUpload}
import multer from 'multer'
import cloudinary from "../../utils/cloudinary";
import {CloudinaryStorage} from 'multer-storage-cloudinary'
import { Request } from 'express';

const mainFolder = (req:Request)=>{
    console.log('req available : ', req)
    if(req.baseUrl.startsWith('/api/cars'))
        {
            return 'Cars'
        }
    else if(req.baseUrl.startsWith('/api/users'))
        {
            return 'Users'
        }
    else
        {
            return 'Others'
        }
}

const subFolders = (req:Request, file: Express.Multer.File)=>{
    console.log(req.body.name, file.fieldname)
    return `${req.body.name}/${file.fieldname}`
}

const storage = new CloudinaryStorage({
    cloudinary : cloudinary,
    params : async(req: Request, file: Express.Multer.File)=>{
        return{
            folder:`Uploads/${mainFolder(req)}/${subFolders(req, file)}`,
            allowed_formats: ['jpg', 'png', 'gif', 'jpeg']
        }
    }
})


const upload = multer({storage:storage})

export default upload



