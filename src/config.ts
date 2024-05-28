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
    GOOGLE_SECRET_KEY : process.env.GOOGLE_CLIENT_SECRET as string,

    HOST_URL : process.env.HOST_URL as string,
    MERCHANT_ID : process.env.MERCHANT_ID as string,
    SALT_INDEX : process.env.SALT_INDEX as string,
    SALT_KEY : process.env.SALT_KEY as string,
    PHONEPAY_URL :process.env.PHONPAY_URL as string,

    LOCATION_ACCESS_TOKEN : process.env.LOCATION_ACCESS_TOKEN as string,

    STRIPE_SECRET_KEY : process.env.STRIPE_SECRET_KEY as string,

    ORIGIN_PORT: process.env.ORIGIN_PORT as string,
}

export default configFile