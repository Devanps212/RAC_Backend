import { io } from "../../..";
import { carInterface } from "../../../types/carInterface";
import { carInterfaceType } from "../../repositories/carRepoInterface";
import { InterfaceAuthService } from "../../services/authServiceInterface";

export const createCar = async(carData: carInterface, carRepInterface: ReturnType<carInterfaceType>, authInterface: ReturnType<InterfaceAuthService>)=>{
    console.log("Data received");
    if (carData.addedById) {
        console.log("reached edit car");
        const tokenData = await authInterface.tokenVerification(carData.addedById);
        if (typeof tokenData === 'object' && tokenData.hasOwnProperty('payload')) {
            console.log(tokenData)
            const payload = tokenData.payload;
            console.log("Token payload:", payload);
            carData.addedById = payload;
        }
    }

    const carCreate = await carRepInterface.createCar(carData)
    return carCreate
}

export const editCar = async (carData : carInterface, carRepoInterface : ReturnType<carInterfaceType>) => {
    console.log("reached edit car")
    const carEdit = await carRepoInterface.editCar(carData);
    return carEdit;
};


export const deleteCar = async(carId : string, carRepoInterface: ReturnType<carInterfaceType>)=>{
    console.log("data receieved from edit :", carId)

    const carDelete = await carRepoInterface.deleteCar(carId)
    return carDelete
}

export const findCar = async(carData: string, carRepoInterface:ReturnType<carInterfaceType>)=>{

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

// export const statusUpdater = async(carId: string, carRepoInterface : ReturnType<carInterfaceType>)=>{
//     const response = await carRepoInterface
//     return response 
// }

export const updateCar = async(carId: string, carData:Partial<carInterface>, carRepoInterface : ReturnType<carInterfaceType>)=>{
    const response = await carRepoInterface.updateCar(carId, carData)
    return response
}

export const carBasedOnRole = async(role: string,  carRepoInterface : ReturnType<carInterfaceType>)=>{
    const response = await carRepoInterface.carBasedOnrole(role)
    return response
}

export const carPartialUpdate = async(data: Partial<carInterface>, carRepoInterface : ReturnType<carInterfaceType>)=>{
    const response = await carRepoInterface.carPartialUpdate(data)
    if(data && data.offer && response){
        console.log("offer updating")
        io.emit('offerUpdate', {
            message:`The offer for the car ${response.name} has been updated: We are excited to inform you that the latest offer for the ${response.name} includes a discount of ${response.offer?.discount || 'No description provided'}. Take advantage of this special deal and enjoy great savings on your rental!`,
            car:response.name,
            carImage:response.thumbnailImg
        })
    }

    console.log("no offer found")

    return response
}

export const carPagination = async(page: number, limit:number, carRepoInterface : ReturnType<carInterfaceType>)=>{
    const response = await carRepoInterface.carPagination(page, limit)
    return response
}

export const carBasedOnInterfaces = async(data: Partial<carInterface>, carRepoInterface : ReturnType<carInterfaceType>)=>{
    const response = await carRepoInterface.carBasedOnInterface(data)
    return response
}