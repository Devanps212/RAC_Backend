import multer from 'multer'
import cloudinary from "../../utils/cloudinary";
import {CloudinaryStorage} from 'multer-storage-cloudinary'
import { Request } from 'express';

const mainFolder = (req:Request)=>{
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

const subFolders = (req: Request, file: Express.Multer.File) => {
    console.log("reached subfolder")
    let folderPath = '';
    if (req.body.name && file.fieldname) {
        const { name } = req.body;
        const { fieldname } = file;
        const deletedInteriorIndex = parseInt(req.body.deletedInteriorIndex);
        const deletedExteriorIndex = parseInt(req.body.deletedExteriorIndex);

        if (fieldname === 'interior' && !isNaN(deletedInteriorIndex)) {
            folderPath = `${name}/${fieldname}/${deletedInteriorIndex}`;
        } else if (fieldname === 'exterior' && !isNaN(deletedExteriorIndex)) {
            folderPath = `${name}/${fieldname}/${deletedExteriorIndex}`;
        } else {
            folderPath = `${name}/${fieldname}`;
        }

        const basePath = folderPath.substring(0, folderPath.lastIndexOf('/'));
        const index = parseInt(folderPath.substring(folderPath.lastIndexOf('/') + 1));

        if (!isNaN(index)) {
            const replacedFolderPath = `${basePath}/${index}`;
            return replacedFolderPath;
        } else {
            return folderPath;
        }
    } else {
        throw new Error('Name or fieldname is missing');
    }
}





const storage = new CloudinaryStorage({
    cloudinary : cloudinary,
    params : async(req: Request, file: Express.Multer.File)=>{
        const folderPath = `Uploads/${mainFolder(req)}/${subFolders(req, file)}`;
        console.log("sub Folder : ", subFolders(req, file))
        console.log("Folder path:", folderPath);
        return{
            folder:folderPath,
            allowed_formats: ['jpg', 'png', 'gif', 'jpeg']
        }
    }
})


const upload = multer({storage:storage})

export default upload



