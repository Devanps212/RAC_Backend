import mongoose from 'mongoose';
import configFile from '../../../config';


const connectDb = async () => {
  console.log('Attempting to connect to the database...');
  

  try {

    await mongoose.connect(configFile.MONGO_URL);

    console.log('Database connected successfully');
    
  } catch (error: any) {
    console.error('Error connecting to the database:', error);
    process.exit(1); 
  }
};

export default connectDb;
