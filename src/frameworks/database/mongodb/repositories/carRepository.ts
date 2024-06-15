import { carModelType } from "../models/carModel";
import { carInterface } from "../../../../types/carInterface";
import { carEntity } from "../../../../entities/carEntity";

export const carRepository = (model: carModelType)=>{
     
    const CarEntity = new carEntity(model)

    const createCar = async(carData:carInterface)=>{
        const createdCar = await CarEntity.addCar(carData)
        return createdCar 
    }

    const editCar = async(carData: carInterface)=>{
        console.log("reached repository")
        const carEdit = await CarEntity.editCar(carData)
        return carEdit
    }

    const delteCar = async(carId: string)=>{
        const carDelete = await CarEntity.deleteCar(carId)
        return carDelete
    }

    const findCar = async(carData : string)=>{
        const carFind = await CarEntity.findCar(carData)
        return carFind
    }

    const viewdetails = async(carId: string)=>{
        const carView = await CarEntity.viewCarDetails(carId)
        return carView
    }

    const carExist = async(name:string)=>{
        const ExistCar = await CarEntity.checkCarByName(name)
        return ExistCar
    }

    const carUpdate = async(carId: string, carData: Partial<carInterface>)=>{
        const response = await CarEntity.carUpdater(carId, carData)
        return response
    }
    
    const carFindBasedOnRole = async(role: string)=>{
        const response = await CarEntity.carBasedOnRole(role)
        return response
    }

    const carUpdateBasedOnRole = async(data: Partial<carInterface>)=>{
        const response = await CarEntity.carPartialUpdate(data)
        return response
    }

    const carPagination = async(page: number , limit: number)=>{
        const ExistCar = await CarEntity.carPagination(page, limit)
        return ExistCar
    }

    return {
        createCar, 
        delteCar, 
        editCar, 
        findCar, 
        viewdetails,
        carPagination,
        carExist, 
        carUpdate, 
        carFindBasedOnRole, 
        carUpdateBasedOnRole
    }
}

export type CarRepoType = typeof carRepository