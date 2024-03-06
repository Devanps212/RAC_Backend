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
    return {createCar, delteCar, editCar, findCar, viewdetails}
}

export type CarRepoType = typeof carRepository