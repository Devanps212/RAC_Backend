import { Request, Response } from "express"
import { categoryModelType } from "../../frameworks/database/mongodb/models/categoryModel"
import { categoryInterfaces } from "../../app/repositories/categoryRepoInterface"
import { categoryRepos } from "../../frameworks/database/mongodb/repositories/categoryRepository"
import expressAsyncHandler from "express-async-handler"
import { createCateg, editCategory, listCateg, unlistCateg, checkCateg, getAllCateg } from "../../app/use_case/category/category"

const categoryController = (
    categoryInterface: categoryInterfaces,
    categoryImpl : categoryRepos,
    categoryModel: categoryModelType,
)=>{

    const categoryDatabase = categoryInterface(categoryImpl(categoryModel))

    const categoryCreation = expressAsyncHandler(
        async(req: Request, res: Response)=>{
            const{name, description} = req?.body
            console.log(name, description)
            const categoryExist = await checkCateg(categoryDatabase, name)
            console.log("category data retreived :", categoryExist)
            if (categoryExist === null) 
            {
                console.log("vrwating a new category")
                const addCategory = await createCateg(name, description, categoryDatabase);
                res.json({
                    status: "success",
                    message: "Category created",
                    addCategory,
                });
            } 
            else 
            {
                res.status(400).json({
                    status: "error",
                    message: "Category already exists",
                });
            }
        }
    )

    const editsCategory = expressAsyncHandler(
        async(req:Request, res:Response)=>{
            console.log("reached edit category")
            const {formData} = req?.body
            console.log("categoryData :", formData)
            const EditCategory = await editCategory(formData, categoryDatabase)
            console.log(EditCategory)
            res.json({
                status:EditCategory?.status,
                message:"category edited successfully",
            })
        }
    )

    const list = expressAsyncHandler(
        async(req: Request, res:Response)=>{
            const {categoryId} = req?.body
            const categList = await listCateg(categoryId , categoryDatabase)
            console.log(categList)
            res.json({
                status:"success",
                message:"category listed"
            })
        }
    )

    const Unlist = expressAsyncHandler(
        async(req: Request, res:Response)=>{
            const {categoryId} = req?.body
            console.log("categoryId : ",categoryId)
            const categUnlist = await unlistCateg(categoryId , categoryDatabase)
            console.log(categUnlist)
            res.json({
                status:"success",
                message:"category Unlisted"
            })
        }
    )

    const categoryRetrieve = expressAsyncHandler(
        async(req:Request, res:Response)=>{
            console.log("reached signgle retrieve")
            const name: string | undefined = req.query.name as string | undefined;
            const categoryId: string | undefined = req.query.categoryId as string | undefined;
            console.log("name:",name,"category : ", categoryId)
            const categoryExist = await checkCateg(categoryDatabase, name, categoryId)
            res.json({
                status:"success",
                message:"category retreived successfully",
                categoryExist
            })
        }
    )

    const getAllCategory = expressAsyncHandler(
        async(req:Request, res:Response)=>{
            const allData = await getAllCateg(categoryDatabase)
            res.json({
                status:"success",
                message:"Data retreived successfully",
                allData
            })
        }
    )

    return {categoryCreation , editsCategory, list, Unlist, categoryRetrieve, getAllCategory}
}

export default categoryController