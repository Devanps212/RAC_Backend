import { Request, Response } from "express";
import { userModelType } from "../../frameworks/database/mongodb/models/userModel";
import { userDbInterface } from "../../app/repositories/userDbrepository";
import { userRepository } from "../../frameworks/database/mongodb/repositories/userRepositoryMongo";
import expressAsyncHandler from "express-async-handler";
import { getAllUser, blockUnblockUser,findOneUser } from "../../app/use_case/adminUser/adminUser";

const adminUserController = (
    userModel: userModelType,
    userInterface: userDbInterface,
    userRepository: userRepository 
) => {
    const userService = userInterface(userRepository(userModel));

    const getAllUsers = expressAsyncHandler(
        async (req: Request, res: Response) => {
            const users = await getAllUser(userService);
            res.json({
                status: "success",
                message: "successfully retrieved",
                users,
            });
        }
    );

    const unblockBlockUser = expressAsyncHandler(
        async (req: Request, res: Response) => {
          console.log(req.headers);
          const userId = req.headers['x-user-id'] as string
          console.log(userId)
          try {
            await blockUnblockUser(userId, userService);
      
            res.json({
              status: 'success',
            });
          } catch (error:any) {
            console.log(error.message)
            throw new Error(error)
          }
        }
      );

      const findOneuser = expressAsyncHandler(
        async(req: Request, res: Response)=>{
          console.log(req.headers)
          const userId = req.header('x-user-id') as string
          const user = await findOneUser(userId, userService)
          console.log(user)
          res.json({
            status:"success",
            user
          })
        }
      )
    return { 
      getAllUsers , 
      unblockBlockUser, 
      findOneuser
    };
};

export default adminUserController;