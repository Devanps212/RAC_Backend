import multer from 'multer'
import path from 'path'
import fs from 'fs'

const Userstorage = multer.diskStorage({
    destination: (req, file, cb)=>{
        console.log("reached ")
        console.log(req)
        const userName = req.body.carData?.name
        const folderPath = path.join('uploads', userName)

        if(!fs.existsSync(folderPath))
        {
            fs.mkdirSync(folderPath, { recursive: true });
        }

        cb(null, folderPath)
    },
    filename:(req, file, cb)=>{
        cb(null, Date.now() + path.extname(file.originalname))
    }
})
const productStorage = multer.diskStorage({
    destination:(req, file, cb)=>{
        console.log("entering multer")
        console.log(req.body.name)
        const productName = req.body.name
        console.log(productName)
        const folderPath = path.join('uploads', productName)
        
        if(!fs.existsSync(folderPath))
        {
            fs.mkdirSync(folderPath, {recursive:true})
        }
        cb(null, folderPath)
    },
    filename:(req, file, cb)=>{
        const fileName = Date.now() + path.extname(file.originalname);

        console.log('File saved with name:', fileName);

        cb(null, fileName)
    }
})


const productUpload = multer({storage:productStorage})
const userUpload = multer({storage:Userstorage})

export {productUpload, userUpload}
