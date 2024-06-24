import mongoose from 'mongoose'
import configFile from '../../../config'


// mongoose.set('strictQuery', true)

const connectDb = async()=>{ 
    console.log('hi');
       
    try
    {
        console.log(configFile.MONGO_URL,'------')
    
        await mongoose.connect(configFile.MONGO_URL)
        
            console.log('Database connected')
        
        
    }
    catch(error:any)
    {
        console.log(error,'error from db ')
        process.exit(1)
    }
}
export default connectDb