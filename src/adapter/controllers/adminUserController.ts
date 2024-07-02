import { Request, Response } from "express";
import { userModelType } from "../../frameworks/database/mongodb/models/userModel";
import { userDbInterface } from "../../app/repositories/userDbrepository";
import { userRepository } from "../../frameworks/database/mongodb/repositories/userRepositoryMongo";
import { bookingInterfaceType } from "../../app/repositories/bookingDBInterface";
import { bookingRepositoryType } from "../../frameworks/database/mongodb/repositories/bookingRepository";
import { BookingModelType } from "../../frameworks/database/mongodb/models/bookingModel";
import expressAsyncHandler from "express-async-handler";
import { getAllUser, blockUnblockUser,findOneUser } from "../../app/use_case/adminUser/adminUser";
import { Booking } from "../../types/bookingInterface";
import { bookingBasedOnRole } from "../../app/use_case/booking/booking";
import { HttpStatus } from "../../types/httpTypes";
import AppError from "../../utils/appErrors";

const adminUserController = (
    userModel: userModelType,
    userInterface: userDbInterface,
    userRepository: userRepository,
    bookingInterface: bookingInterfaceType,
    bookingRepository : bookingRepositoryType,
    bookingModel: BookingModelType
) => {
    const userService = userInterface(userRepository(userModel));
    const bookingService = bookingInterface(bookingRepository(bookingModel))

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
          
          const userId = req.headers['x-user-id'] as string;
          
          const data : Partial<Booking> = {
            userId: userId
          }

          const bookings = await bookingBasedOnRole(data, bookingService);
    
          const hasBookingOngoing = Array.isArray(bookings)
            ? bookings.some((booking) => booking.status === 'Confirmed')
            : bookings?.status === 'Confirmed';

          if (hasBookingOngoing) {
            console.log('User has ongoing booking');
            throw new AppError('User has an ongoing booking', HttpStatus.CONFLICT);
          } else {
            await blockUnblockUser(userId, userService);
            res.json({
              status: 'success',
            });
          }
          
        }
      );

      const findOneuser = expressAsyncHandler(
        async(req: Request, res: Response)=>{
          
          const userId = req.header('x-user-id') as string

          const user = await findOneUser(userId, userService)
          
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