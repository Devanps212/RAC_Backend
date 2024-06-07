import multer from 'multer'
import cloudinary from "../../utils/cloudinary";
import {CloudinaryStorage} from 'multer-storage-cloudinary'
import { Request } from 'express';

const mainFolder = (req:Request)=>{
    if(req.baseUrl.startsWith('/api/cars'))
        {
            return 'Cars'
        }
    else if(req.baseUrl.startsWith('/api/user-auth'))
        {
            return 'Users'
        }
    else if(req.baseUrl.startsWith('/api/admin-auth'))
        {
            return 'Admin'
        }
    else
        {
            return 'Others'
        }
}

const subFolders = (req: Request, file: Express.Multer.File) => {
    console.log("reached subfolder")
    console.log("files : ", req.files)
    console.log("fieldName : ", file.fieldname)
    console.log("body data :", req.body)
    let folderPath = '';
    if (req.body.name && file.fieldname) {
        const { name } = req.body;
        const { fieldname } = file;
        console.log("field Names : -------------------",fieldname)
        const deletedInteriorIndex = parseInt(req.body.deletedInteriorIndex);
        const deletedExteriorIndex = parseInt(req.body.deletedExteriorIndex);

        if (fieldname === 'interior' && !isNaN(deletedInteriorIndex)) {
            folderPath = `${name}/${fieldname}/${deletedInteriorIndex}`;
        } else if (fieldname === 'exterior' && !isNaN(deletedExteriorIndex)) {
            folderPath = `${name}/${fieldname}/${deletedExteriorIndex}`;
        }
        else if(fieldname === 'thumbnailImg') {
            folderPath = `${name}/Thumbnail`
        }
        else {
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
        console.log("no field name recieved")
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
            allowed_formats: ['jpg', 'png', 'gif', 'jpeg'],
            max_filemax_file_size_kb: 1024,
            max_dimensions: {
                width: 1920,
                height: 1080
            }
        }
    }
})


const upload = multer({storage:storage})

export default upload



