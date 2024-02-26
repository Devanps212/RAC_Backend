import mongoose from 'mongoose'
import configFile from '../../../config'


mongoose.set('strictQuery', true)

const connectDb = async()=>{    
    try
    {
        await mongoose.connect(configFile.MONGO_URL || '')
        .then(()=>{
            console.log('Database connected')
        })
        .catch((error:any)=>{
            console.log(error.message)
        })
    }
    catch(error:any)
    {
        console.log(error.message)
        process.exit(1)
    }
}
export default connectDb