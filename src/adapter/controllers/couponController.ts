import { Request, Response } from "express";
import { couponInterfaceType } from "../../app/repositories/couponInterface";
import { couponRepositoryType } from "../../frameworks/database/mongodb/repositories/couponRepository";
import { couponModelType } from "../../frameworks/database/mongodb/models/couponModel";
import expressAsyncHandler from "express-async-handler";
import { findAllCoupon, findCoupon, generatingCoupon, updateCoupon } from "../../app/use_case/coupon/coupon";
import { userDbInterface } from "../../app/repositories/userDbrepository";
import { userRepository } from "../../frameworks/database/mongodb/repositories/userRepositoryMongo";
import { userModelType } from "../../frameworks/database/mongodb/models/userModel";
import { findOneUser } from "../../app/use_case/adminUser/adminUser";
import { couponInterface } from "../../types/couponInetrface";
import { updateUser } from "../../app/use_case/user/user";

const couponController = (
    couponInterface: couponInterfaceType,
    couponRepository: couponRepositoryType,
    couponModel: couponModelType,
    userInterface: userDbInterface,
    userRepository: userRepository,
    userModel: userModelType
)=>{

    const couponService = couponInterface(couponRepository(couponModel))
    const userService = userInterface(userRepository(userModel))

    const generateCoupon = expressAsyncHandler(
        async(req: Request, res: Response)=>{
            
            const data  = req.body.price
            const expiryDate = req.body.expiry
           
            const generate = await generatingCoupon(data, expiryDate, couponService)
            res.json({
                data: generate,
                status: "success"
            })
        }
    )

    const updateCoupons = expressAsyncHandler(
        async(req: Request, res: Response)=>{
            
            const {data} = req.body
            
            const update = await updateCoupon(data, couponService)
            res.json({
                data: update,
                status: "success"
            })
        }
    )
    const findAllCoupons = expressAsyncHandler(
        async(req: Request, res: Response)=>{
            
            
            const allCoupon = await findAllCoupon(couponService)
            res.json({
                data: allCoupon,
                status: "success"
            })
        }
    )

    const couponApply = expressAsyncHandler(
      async (req: Request, res: Response) => {
        const { couponCode, userId } = req.body;
        const user = await findOneUser(userId, userService);
        const couponFind = await findCoupon(couponCode, couponService) as couponInterface[];
        
        if (user!==null  && user.coupons) {
          const updatedCoupons = (user.coupons as couponInterface[]).map((c) => {
            if (c.coupon === couponCode) {
              c.couponUsed = true,
              c.active = false
            }
            return c;
          });

          const updatedUser = { ...user, coupons: updatedCoupons };

          const update = await updateUser(updatedUser, userService)

          
          res.json({
            data: updatedCoupons,
            status: "success"
          })
      } else {
          res.json({
          message:"no coupon found",
          status: "failed"
        })
      }
    })


    return{
        generateCoupon,
        updateCoupons,
        findAllCoupons,
        couponApply,
    }
}

export default couponController