import { CarRepoType } from "../../frameworks/database/mongodb/repositories/carRepository"
import { carInterface } from "../../types/carInterface"


export const carRepoInterface = (repository:ReturnType<CarRepoType>)=>{

    const createCar = async(carData: carInterface)=>{
        return await repository.createCar(carData)
    }
    
    const editCar = async(carData: carInterface)=>{
        console.log("editiong data")
        return await repository.editCar(carData)
    }
    const deleteCar = async(carId: string)=>{
        return await repository.delteCar(carId)
    }

    const findCar = async(carData:string)=>{
        return await repository.findCar(carData)
    }

    const viewCar = async(carId:string)=>{
        return await repository.viewdetails(carId)
    }

    const checkCar = async(name:string)=>{
        return await repository.carExist(name)
    }

    const updateCar = async(carId: string, carData:Partial<carInterface>)=>{
        return await repository.carUpdate(carId, carData)
    }

    const carBasedOnrole = async(role: string)=>{
        return await repository.carFindBasedOnRole(role)
    }

    const carPartialUpdate = async(data :Partial<carInterface>)=>{
        return await repository.carUpdateBasedOnRole(data)
    }

    const carPagination = async(page: number, limit: number)=>{
        return await repository.carPagination(page, limit)
    }
    return{
        createCar, 
        deleteCar ,
        editCar, 
        findCar, 
        viewCar, 
        checkCar, 
        updateCar, 
        carPagination,
        carBasedOnrole, 
        carPartialUpdate
    }
}

export type carInterfaceType = typeof carRepoInterface