import { userModelType } from "../frameworks/database/mongodb/models/userModel";
import { createUserInterface, userInterface } from "../types/userInterface";

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
}
