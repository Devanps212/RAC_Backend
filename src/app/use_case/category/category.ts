import { categoryInterface } from "../../../types/categoryInterface"
import { categoryInterfaces } from "../../repositories/categoryRepoInterface"

export const createCateg = async(name: string, description: string, categoryDBinterface : ReturnType<categoryInterfaces>)=>{
    const categoryData = {name, description}
    console.log("category data :", categoryData)
    const create = await categoryDBinterface.createCateg(categoryData)
    return create   
}

export const editCategory = async(categoryData: categoryInterface, categoryDBinterface: ReturnType<categoryInterfaces>)=>{
    const editCateg = await categoryDBinterface.editCateg(categoryData)
    return editCateg
}
export const unlistCateg = async(categoryId: string, categoryDBinterface: ReturnType<categoryInterfaces>)=>{
    const unlist = await categoryDBinterface.unlistCateg(categoryId)
    return unlist
}
export const listCateg = async(categoryId:string, categoryDBinterface:ReturnType<categoryInterfaces>)=>{
    const list = await categoryDBinterface.listCateg(categoryId)
    return list
}

export const checkCateg = async(categoryDBinterface:ReturnType<categoryInterfaces>, name?:string, categoryId?:string)=>{
    const categ = await categoryDBinterface.CategoryExist(name, categoryId)
    return categ
}

export const getAllCateg = async(categoryDBinterface:ReturnType<categoryInterfaces>)=>{
    const result = await categoryDBinterface.getAllCategory()
    return result
}