import AppError from "../../../utils/appErrors"
import { HttpStatus } from "../../../types/httpTypes"
import configFile from "../../../config"
import axios from "axios"

export const locationFinder = async(data: string)=>{
    try
    {
        console.log("Data ===>",data)
        const response = await axios.get(`https://api.mapbox.com/search/searchbox/v1/suggest?q=${data}&access_token=${configFile.LOCATION_ACCESS_TOKEN}&session_token=ce8adf6d-f635-415e-ad83-7597a752bdfc&language=en&limit=10&types=country%2Cregion%2Cdistrict%2Cpostcode%2Clocality%2Cplace%2Cneighborhood%2Caddress%2Cpoi%2Cstreet%2Ccategory&proximity=76.3218144%2C9.9380786`)
        return response.data.suggestions
    }
    catch(error:any)
    {
        console.log(error)
        throw new AppError(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
}