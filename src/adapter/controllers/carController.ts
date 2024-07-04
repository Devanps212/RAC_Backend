import { carInterfaceType } from "../../app/repositories/carRepoInterface";
import { CarRepoType } from "../../frameworks/database/mongodb/repositories/carRepository";
import { carModelType } from "../../frameworks/database/mongodb/models/carModel";
import { Request, Response } from "express";
import { createCar, editCar, deleteCar, findCar, viewCarDetails, checkCar, carBasedOnRole, carPartialUpdate, updateCar, carPagination } from "../../app/use_case/car/car";
import expressAsyncHandler from "express-async-handler";
import { AuthService } from "../../frameworks/services/authServices";
import { InterfaceAuthService } from "../../app/services/authServiceInterface";
import { reviewInterface } from "../../types/reviewInterface";
import AppError from "../../utils/appErrors";
import { HttpStatus } from "../../types/httpTypes";
import { bookingInterfaceType } from "../../app/repositories/bookingDBInterface";
import { bookingRepositoryType } from "../../frameworks/database/mongodb/repositories/bookingRepository";
import { BookingModelType } from "../../frameworks/database/mongodb/models/bookingModel";
import { Booking } from "../../types/bookingInterface";
import { bookingBasedOnRole } from "../../app/use_case/booking/booking";
import { io } from "../..";


export const carController  = (
    carInterface: carInterfaceType,
    carRepository: CarRepoType,
    carModel : carModelType,
    authService : AuthService,
    interfaceAuthService : InterfaceAuthService,
    bookingInterface: bookingInterfaceType,
    bookingRepository: bookingRepositoryType,
    bookingModel: BookingModelType
)=>{
    
    const carService = carInterface(carRepository(carModel))
    const authservices = interfaceAuthService(authService())
    const bookingService = bookingInterface(bookingRepository(bookingModel))

    const createCars = expressAsyncHandler(
        async(req: Request, res: Response)=>{

            const files = req.files as { [fieldname: string]: Express.Multer.File[] };
            let interior :String[] = []
            let exterior = []
            let thumbnail : String[]=[] 
            if (files.interior) {
                
                interior = files.interior.map(data=>data.path)
            } else {
                throw new Error("No 'interior' files found.");
            }

            if (files.exterior) {
                console.log("\nFilenames for exterior:");
                exterior = files.exterior.map(data=>data.path)
            } else {
                throw new Error("No 'exterior' files found.");
            }

            if(files.thumbnailImg)
            {
                
                thumbnail = files.thumbnailImg.map(data=>data.path)
            }

            const carData = req?.body
            const {name }= carData
            
            carData.interior = interior
            carData.exterior = exterior
            carData.thumbnailImg = thumbnail.join(',')
            
            await checkCar(name, carService)
            
            const carCreate = await createCar(carData, carService, authservices)
            io.emit('carCreation', {
                message: `New Car Added: The car ${carData.name} has been added by our ${carCreate?.owner} ${carCreate?.addedBy} and is now available for rent. Check it out in our listings!`,
                picture: carCreate?.thumbnailImg
            })
            res.json({
                status:"success",
                message:"car added successfully",
                carCreate
            })
        }
    )

    const editsCar = expressAsyncHandler(
        async (req: Request, res: Response) => {
            
            const carData = req.body;
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };
            let interior: string[] = [];
            let exterior: string[] = [];
            let thumbnail : String[]=[] 
    
            if (files.interior) {
                interior = files.interior.map(data => data.path);
                
                carData.interior = interior;
                
            }
    
            if (files.exterior) {
                exterior = files.exterior.map(data => data.path); 
                
                carData.exterior = exterior;
            }
            
            
            if(files.thumbnailImg)
            {
                
                thumbnail = files.thumbnailImg.map(data=>data.path)
                carData.thumbnailImg = thumbnail.toString()
               
            }

        


            
            const response = await editCar(carData, carService);
    
            res.json({
                status: "success",
                message: "Car edited successfully",
                response
            });
        }
    );
    

    const viewCar = expressAsyncHandler(
        async(req: Request, res: Response)=>{
            
            const {carId} = req?.body
            const response = await viewCarDetails(carId, carService)
            if(response && 'message' in response){
                res.json({
                    status:"failed",
                    message:response.message,
                })
            }
            else{
                res.json({
                    status:"success",
                    message:"user retreived successfully",
                    response
                })
            }
        }
    )

    const deletesCar = expressAsyncHandler(
        async(req: Request, res: Response)=>{
            
            const carId = req?.header('X-Car-Id') as string

            const data : Partial<Booking> = {
                carId: carId
            }

            const booking = await bookingBasedOnRole(data, bookingService)

            const hasOngoingBooking = Array.isArray(booking) 
            ? booking.some(bookings=>bookings.status === "Confirmed")
            : booking?.status === "Confirmed"
            
            if(hasOngoingBooking){
                
                throw new AppError(`Unable to delete the car. There is an ongoing booking associated with it.`, HttpStatus.CONFLICT);
            } else {
                
                const carDelete = await deleteCar(carId, carService)
                res.json({
                    status:carDelete?.status,
                    message:carDelete?.message,
                })     
            }
            
        }
    )

    const findsCar = expressAsyncHandler(
        async(req: Request, res: Response)=>{
            const carData = req?.query.carData as string
            
            const response = await findCar(carData, carService)
            res.json({
                status:"success",
                message:"cars retreived",
                response
            })
        }
    )

    const findCarsBasedOnRole = expressAsyncHandler(
        async(req: Request, res: Response)=>{

            const role = req.query.role as string
            
            const cars = await carBasedOnRole(role, carService)
            res.json({
                data: cars,
                status: 'success'
            })
        }
    )

    const carUpdateBasedOnRole = expressAsyncHandler(
        async(req: Request, res: Response)=>{
            const data = req.body        
            
            const updateCar = await carPartialUpdate(data, carService)
            
            res.json({
                data: updateCar,
                status: "success"
            })
        }
    )

    const updateRating = expressAsyncHandler(
        async(req: Request, res: Response)=>{
            const { data , carId, userId } = req.body
            const car = await findCar(carId, carService)
            if(Array.isArray(car) || car === null){
                throw new AppError("car isn't availbale", HttpStatus.EXPECTATION_FAILED)
            }
            const ratingDetail : reviewInterface = data
            
            const totalRatings = car.ratingsCount || 0;
            const currentRating = car.rating || 0;
            const newRating = (ratingDetail.car + ratingDetail.valueForMoney + ratingDetail.comfort + ratingDetail.performance) / 4;
            const updatedRating = ((currentRating * totalRatings) + newRating) / (totalRatings + 1);

            car.rating = updatedRating;
            car.ratingsCount = totalRatings + 1;


            if (ratingDetail.review && car.comments !== undefined && Array.isArray(car.comments)) {
                car.comments.push({
                    userId: userId,
                    comment: ratingDetail.review,
                    userRating: newRating,
                });
            }

            const update = await updateCar(car._id?.toString() ?? '', car, carService)

            res.json({
                data: update,
                message: 'success fully submitted review'
            })
        }
    )

    const carPaginations = expressAsyncHandler(
        async (req: Request, res: Response) => {
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 10
    
        const carPage = await carPagination(page, limit, carService);
    
        res.json({
            cars: carPage.cars,
            totalCount: carPage.totalCount,
            status: "success"
        });
    });

    return{
        createCars, 
        editsCar, 
        viewCar, 
        deletesCar, 
        findsCar,
        updateRating,
        findCarsBasedOnRole, 
        carUpdateBasedOnRole,
        carPaginations,
    }
}