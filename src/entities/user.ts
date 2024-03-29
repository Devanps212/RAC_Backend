import { userModelType } from "../frameworks/database/mongodb/models/userModel";
import { HttpStatus } from "../types/httpTypes";
import { createUserInterface, userInterface, userAdminInterface } from "../types/userInterface";
import AppError from "../utils/appErrors";

export class UserEntity {
  private model: userModelType;

  constructor(model: userModelType) {
    this.model = model;
  }

  public async createUser(userData: createUserInterface): Promise<userInterface | null> {
    const newUser: any = await this.model.create(userData);
    console.log(newUser)
    return newUser;
  }
  
  public async getUserByEmail(email:string): Promise<userInterface | null> {
    const user :any = await this.model.findOne({email})
    return user;
  }

  public async allUser(): Promise<userAdminInterface[] | null> {
    try
    {
      const users = await this.model.find({}, {name: 1, email: 1, isActive: 1, profilePic: 1, mobile: 1})
      const userDetails = users.map((user)=>({
        _id: user._id,
        name: user.name,
        email: user.email,
        isActive: user.isActive,
        profilePic: user.profilePic,
        mobile: user.mobile || undefined,
      }))

      console.log(userDetails)
      return userDetails
    }
    catch(error:any)
    {
      console.log(error)
      throw new AppError(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  public async blockUnblockUser (userId:string){
    try
    {
      if(userId === undefined)
      {
        console.log("user not found")
        throw new AppError('userId is Invalid', HttpStatus.NOT_FOUND)
      }
      const user = await this.model.findOne({_id:userId})
      if(user && user.isActive)
      {
        await this.model.findOneAndUpdate({_id:userId}, {$set:{isActive:false}})
      }
      else
      {
        await this.model.findOneAndUpdate({_id:userId}, {$set:{isActive:true}})
      }
    }
    catch(error:any)
    {
      throw new AppError(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  public async userFindOne(userId: string): Promise<userInterface | null> {
    try {
      console.log("userId in findOneUser : ", userId);
  
      const user: userModelType | null = await this.model.findOne({ _id: userId }).lean();
  
      if (!user) 
      {
        throw new AppError('user not found', HttpStatus.NOT_FOUND)
      }
  
      return user as userInterface;
    } 
    catch (error:any) 
    {
      console.error(error);
      throw new AppError(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
