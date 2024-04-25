import { carInterfaceType } from "../../app/repositories/carRepoInterface";
import { CarRepoType } from "../../frameworks/database/mongodb/repositories/carRepository";
import { carModelType } from "../../frameworks/database/mongodb/models/carModel";
import { Request, Response } from "express";
import { createCar, editCar, deleteCar, findCar, viewCarDetails, checkCar } from "../../app/use_case/car/car";
import { carInterface } from "../../types/carInterface";
import expressAsyncHandler from "express-async-handler";
import { AuthService } from "../../frameworks/services/authServices";
import { InterfaceAuthService } from "../../app/services/authServiceInterface";


export const carController  = (
    carInterface: carInterfaceType,
    carRepository: CarRepoType,
    carModel : carModelType,
    authService : AuthService,
    interfaceAuthService : InterfaceAuthService
)=>{
    
    const carService = carInterface(carRepository(carModel))
    const authservices = interfaceAuthService(authService())

    const createCars = expressAsyncHandler(
        async(req: Request, res: Response)=>{
            // console.log("Data inside body : ", req.body)
            // console.log("files from frontend :", req.files)

            const files = req.files as { [fieldname: string]: Express.Multer.File[] };
            let interior :String[] = []
            let exterior = []
            let thumbnail : String[]=[] 
            if (files.interior) {
                console.log("Filenames for interior:");
                interior = files.interior.map(data=>data.path)
                console.log("interior :", interior)
            } else {
                throw new Error("No 'interior' files found.");
            }

            if (files.exterior) {
                console.log("\nFilenames for exterior:");
                exterior = files.exterior.map(data=>data.path)
                console.log("exterior :", exterior)
            } else {
                throw new Error("No 'exterior' files found.");
            }

            if(files.thumbnailImg)
            {
                console.log("thumbnail found")
                thumbnail = files.thumbnailImg.map(data=>data.path)
            }

            const carData = req?.body
            const {name }= carData
            console.log(name)
            carData.interior = interior
            carData.exterior = exterior
            carData.thumbnailImg = thumbnail.join(',')
            console.log(carData)
            await checkCar(name, carService)
            console.log("entering controller")
            const carCreate = await createCar(carData, carService, authservices)
            res.json({
                status:"success",
                message:"car added successfully",
                carCreate
            })
        }
    )

    const editsCar = expressAsyncHandler(
        async (req: Request, res: Response) => {
            console.log("reached edits car controller")
            const carData = req.body;
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };
            let interior: string[] = [];
            let exterior: string[] = [];
            let thumbnail : String[]=[] 
    
            if (files.interior) {
                interior = files.interior.map(data => data.path);
                console.log("interior:", interior);
                carData.interior = interior;
                console.log(carData.vehicleNumber)
            }
    
            if (files.exterior) {
                exterior = files.exterior.map(data => data.path); // Corrected this line
                console.log("exterior:", exterior);
                carData.exterior = exterior;
            }
            console.log("files :", req.files)
            
            if(files.thumbnailImg)
            {
                console.log("thumbnail found")
                thumbnail = files.thumbnailImg.map(data=>data.path)
                carData.thumbnailImg = thumbnail.toString()
                console.log("cardata in thumbnail")
                console.log("car Data  :", carData)
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
            console.log("entering viewCar")
            const {carId} = req?.body
            const response = await viewCarDetails(carId, carService)
            res.json({
                status:"success",
                message:"user retreived successfully",
                response
            })
        }
    )

    const deletesCar = expressAsyncHandler(
        async(req: Request, res: Response)=>{
            const carId = req?.header('X-Car-Id') as string
            const carDelete = await deleteCar(carId, carService)
            res.json({
                status:carDelete?.status,
                message:carDelete?.message,
            })
            
        }
    )

    const findsCar = expressAsyncHandler(
        async(req: Request, res: Response)=>{
            console.log("reached car controller for getting cars")
            const carData = req?.query.carData as string
            console.log(carData)
            const response = await findCar(carData, carService)
            res.json({
                status:"success",
                message:"cars retreived",
                response
            })
        }
    )

    return{createCars, editsCar, viewCar, deletesCar, findsCar}
}