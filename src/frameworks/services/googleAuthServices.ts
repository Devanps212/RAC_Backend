import admin from 'firebase-admin'
import AppError from '../../utils/appErrors'
import { HttpStatus } from '../../types/httpTypes'

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId:'racars-c3cb8'
})

export const googleAuthService = () =>{
    try
    {
    console.log("reached google auth service")
    const verify = async(token : string) => {
        const user = {
            name: '',
            email: '',
            profilePic: '',
            isGoogleUser: true
        }
        console.log("token")
        console.log("ticket configuring")
        try
        {
            const result = await admin.auth().verifyIdToken(token)
            if(result)
            {
                console.log("result : ", result)

                if(result.name && result.email && result.picture)
                {
                    user.name = result.name,
                    user.email = result.email
                    user.profilePic = result.picture
                    console.log("user details fetched")
                }
            }
            
        }
        catch(error:any)
        {
            console.log(error)
            throw new AppError(error.message, HttpStatus.BAD_REQUEST)       
        }
        return user
    }
    return {verify}
    }
    catch(error:any)
    {
        console.log(error.message)
        throw new Error(error.message)
    }
}

export type googleAuthServices = typeof googleAuthService