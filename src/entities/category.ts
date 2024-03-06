import { categoryModelType } from "../frameworks/database/mongodb/models/categoryModel";
import { categoryInterface } from "../types/categoryInterface";
import { HttpStatus } from "../types/httpTypes";
import AppError from "../utils/appErrors";


export class categoryEntity{
    private model : categoryModelType

    constructor(model : categoryModelType)
    {
        this.model = model
    }

    public async createCategory(categoryData: categoryInterface): Promise<categoryInterface | null> {
        try 
        {
          const category:categoryInterface = await this.model.create(categoryData);
          return category;
        } 
        catch(error: any) 
        {
          console.error("Error creating category:", error.message);
          throw new AppError(error.message, HttpStatus.BAD_REQUEST)
        }
      }
      
    public async editCategory(categoryData: categoryInterface):Promise<{status : string} | undefined>
    {
        try 
        {
          console.log("reached interface edit")
          const {_id,name, description} = categoryData
          const existingCategory = await this.model.findOne({ name });

          if (existingCategory) 
          {
            console.log("Category with the same name already exists");
            throw new AppError('Category with the same name already exists', HttpStatus.BAD_REQUEST);
          }

          const editCateg = await this.model.updateOne({_id:_id}, {$set:{name, description}})
          if (editCateg.matchedCount > 0 && editCateg.modifiedCount > 0) 
          {
            console.log("Category edited");
            return { status: "success" };
          } 
          else if (editCateg.matchedCount > 0 && editCateg.modifiedCount === 0) 
          {
            console.log("No changes made to the category");
            throw new AppError('Please make some changes for edit', HttpStatus.BAD_REQUEST)
          } 
          else 
          {
            console.log("No category found for the given ID");
            throw new AppError('no category found', HttpStatus.BAD_REQUEST)
          }
        } 
        catch (error:any) 
        {
          console.error("Error editing category name:", error.message);
          throw new AppError(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
    public async unListCategory (categoryId : string) :Promise<{status: string} | undefined>
    {
      try
      {
        console.log("categoryId recieved : ", categoryId)
        const categoryList = await this.model.updateOne({_id:categoryId}, {$set:{isListed : false}})
        if(categoryList.modifiedCount > 0)
        {
          console.log("category updated")
          return {status:"success"}
        }
        console.log(categoryList)
        console.log("cant unlist category")
        throw new AppError("can't unlist the category", HttpStatus.NOT_MODIFIED) 
      }
      catch(error:any)
      {
        console.log(error.message)
        throw new AppError(error.message, HttpStatus.INTERNAL_SERVER_ERROR) 
      }

    } 
    public async ListCategory (categoryId : string) :Promise<{status: string} | undefined>
    {
      try
      {
        const categoryList = await this.model.updateOne({_id:categoryId}, {isListed : true})
        if(categoryList.modifiedCount > 0)
        {
          console.log("category updated")
          return {status:"success"}
        }
        console.log("cant list category")
        throw new AppError("error listing category", HttpStatus.NOT_MODIFIED)
      }
      catch(error:any)
      {
        console.log(error.message)
        throw new AppError(error.message, HttpStatus.INTERNAL_SERVER_ERROR) 
      }

    } 
    public async CheckCategory(name?: string, categoryId?: string) 
    {
      try {
        let checkUser;

        console.log("came to entity")
        if (name !== undefined && categoryId === undefined) 
        {
          console.log("checking category with name in entity ")
          const checkname = new RegExp(`^${name}$`, 'i');
         
          checkUser = await this.model.findOne({ name: checkname });
          console.log(checkUser)
        }
    
        if (name === undefined && categoryId !== undefined) 
        {
          console.log("checking category with id in entity ")
          checkUser = await this.model.findOne({ _id: categoryId });
          console.log(checkUser)
        }
        console.log("check use  in entity :", checkUser)
    
        if (checkUser === null) 
        {
          console.log("Category does not exist");
          return null;
        }
    
        console.log("found category : ",checkUser);
        return checkUser;
      } catch (error: any) {
        console.error(error.message);
        throw new AppError(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
    public async getAllCategories()
    {
      try
      {
        const allCateg = await this.model.find({})
        return allCateg
      }
      catch(error:any)
      {
        console.log(error.message)
        throw new AppError(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
      }
    }
}