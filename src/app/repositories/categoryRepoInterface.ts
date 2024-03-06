import { categoryRepos } from "../../frameworks/database/mongodb/repositories/categoryRepository";
import { categoryInterface } from "../../types/categoryInterface";

export const categoryRepoInterface = ( repository: ReturnType<categoryRepos>)=>{
    const createCateg = async(categoryData: categoryInterface)=>{
        return await repository.createCategory(categoryData)
    }

    const editCateg = async(categoryData: categoryInterface)=>{
        console.log("reached interface edit")
        return await repository.editCateg(categoryData)
    }

    const listCateg = async(categoryId: string)=>{
        return await repository.listCateg(categoryId)
    }

    const unlistCateg = async(categoryId: string)=>{
        return await repository.unListCateg(categoryId)
    }

    const CategoryExist = async(name?: string, categoryId?: string)=>{

        console.log("name : ", name, "id : ", categoryId)
          if(name !== undefined && categoryId === undefined)
            {
                console.log("checking with name")
                const categoryCheck = await repository.checkCategory(name, undefined)
                return categoryCheck
            }
            else if(categoryId !== undefined && name === undefined)
            {
                console.log("checking with id")
                const categoryCheck = await repository.checkCategory(undefined,categoryId)
                return categoryCheck
            }
            else
            {
                console.log("nothing found")
                return null
            }

    }

    const getAllCategory = async()=>{
        console.log("fetching categories")
        const result = await repository.getAllCateg()
        return result
    }

    return{createCateg, editCateg, listCateg, unlistCateg, CategoryExist, getAllCategory}
    

}

export type categoryInterfaces = typeof categoryRepoInterface

//now create controller