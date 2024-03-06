import { categoryEntity } from "../../../../entities/category";
import { categoryModelType } from "../models/categoryModel";
import { categoryInterface } from "../../../../types/categoryInterface";

export const categoryRepository = (model : categoryModelType) =>{
    
    const CategoryEntity = new categoryEntity(model)

    const createCategory = async(categoryData : categoryInterface)=>{
        const createCateg = await CategoryEntity.createCategory(categoryData)
        return createCateg
    }

    const editCateg = async(categoryData: categoryInterface)=>{
        console.log("reached repository edit")
        const editCateg = await CategoryEntity.editCategory(categoryData)
        return editCateg

    }

    const unListCateg = async(categoryId: string)=>{
        const unListedCateg = await CategoryEntity.unListCategory(categoryId)
        return unListedCateg
    }

    const listCateg = async(categoryId: string)=>{
        const unListedCateg = await CategoryEntity.ListCategory(categoryId)
        return unListedCateg
    }
    
    const checkCategory = async(name?:string, categoryId?:string)=>
    {
        console.log(name, categoryId)
        if(name !== undefined && categoryId === undefined)
        {
            console.log("checking name")
            const categoryCheck = await CategoryEntity.CheckCategory(name, undefined)
            return categoryCheck
        }
        else if(name === undefined && categoryId !== undefined)
        {
            console.log("checking id")
            const categoryCheck = await CategoryEntity.CheckCategory(undefined,categoryId)
            return categoryCheck
        }
    }

    const getAllCateg = async()=>{
        const resposne = await CategoryEntity.getAllCategories()
        return resposne
    }
    return {createCategory, editCateg, listCateg, unListCateg, checkCategory, getAllCateg}
}
export type categoryRepos = typeof categoryRepository
