import { carInterfaceType } from "../../app/repositories/carRepoInterface";
import { CarRepoType } from "../../frameworks/database/mongodb/repositories/carRepository";
import { carModelType } from "../../frameworks/database/mongodb/models/carModel";
import { Request, Response } from "express";
import { createCar, editCar, deleteCar, findCar, viewCarDetails, checkCar } from "../../app/use_case/car/car";
import { carInterface } from "../../types/carInterface";
import expressAsyncHandler from "express-async-handler";

export const carController  = (
    carInterface: carInterfaceType,
    carRepository: CarRepoType,
    carModel : carModelType,
)=>{
    
    const carService = carInterface(carRepository(carModel))

    const createCars = expressAsyncHandler(
        async(req: Request, res: Response)=>{
            console.log("Data inside body : ", req.body)
            console.log("files from frontend :", req.files)

            const files = req.files as { [fieldname: string]: Express.Multer.File[] };
            let interior :String[] = []
            let exterior = []
            if (files.interior) {
                console.log("Filenames for interior:");
                interior = files.interior.map(data=>data.filename)
                console.log("exterior :", interior)
            } else {
                console.log("No 'interior' files found.");
            }

            if (files.exterior) {
                console.log("\nFilenames for exterior:");
                exterior = files.exterior.map(data=>data.filename)
                console.log("exterior :", exterior)
            } else {
                throw new Error("No 'exterior' files found.");
            }

            const carData = req?.body
            const {name }= carData
            console.log(name)
            carData.interior = interior
            carData.exterior = exterior
            console.log(carData)
            await checkCar(name, carService)
            console.log("entering controller")
            const carCreate = await createCar(carData, carService)
            res.json({
                status:"success",
                message:"car added successfully",
                carCreate
            })
        }
    )

    const editsCar = expressAsyncHandler(
        async(req: Request, res: Response)=>{
            const {carData} = req?.body
            console.log(carData)
            const response = await editCar(carData, carService)
            res.json({
                status:"success",
                message:"Car edited successfully",
                response
            })
        }
    )

    const viewCar = expressAsyncHandler(
        async(req: Request, res: Response)=>{
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