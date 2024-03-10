import { carInterface } from "../../../types/carInterface";
import { carInterfaceType } from "../../repositories/carRepoInterface";

export const createCar = async(carData: carInterface, carRepInterface: ReturnType<carInterfaceType>)=>{
    console.log("Data recieved")

    const carCreate = await carRepInterface.createCar(carData)
    return carCreate
}

export const editCar = async(carData: carInterface, carRepoInterface: ReturnType<carInterfaceType>)=>{
    console.log("data receieved from edit :", carData)

    const carEdit = await carRepoInterface.editCar(carData)
    return carEdit
}

export const deleteCar = async(carId : string, carRepoInterface: ReturnType<carInterfaceType>)=>{
    console.log("data receieved from edit :", carId)

    const carDelete = await carRepoInterface.deleteCar(carId)
    return carDelete
}

export const findCar = async(carData: string, carRepoInterface:ReturnType<carInterfaceType>)=>{
    console.log("data receieved to find :", carData)

    const carFind = await carRepoInterface.findCar(carData)
    return carFind
}

export const viewCarDetails = async(carId:string, carRepoInterface: ReturnType<carInterfaceType>)=>{
    console.log("data receieved from edit :", carId)

    const carView = await carRepoInterface.viewCar(carId)
    return carView
}

export const checkCar = async(name: string, carRepoInterface: ReturnType<carInterfaceType>)=>{
    console.log("car checking")
    
    const carExist = await carRepoInterface.checkCar(name)
    return carExist
}