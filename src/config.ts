import dotenv from 'dotenv'
dotenv.config()

const configFile = {
    PORT: process.env.PORT as string,
    MONGO_URL: process.env.MONGODB_URL as string,
    JWT_KEY: process.env.JWT_SECRET as string,
    USER_EMAIL : process.env.USER_EMAIL as string,
    USER_PASS : process.env.USER_EMAIL_PASS as string,
    SESSION_KEY : process.env.SESSION_ID as string,
    GOOGLE_CLIENT_ID :process.env.GOOGLE_CLIENT_ID as string,
    GOOGLE_SECRET_KEY : process.env.GOOGLE_CLIENT_SECRET as string
}

export default configFile