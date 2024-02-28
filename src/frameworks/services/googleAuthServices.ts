import { OAuth2Client } from "google-auth-library";
import configFile from "../../config";

const client = new OAuth2Client(configFile.GOOGLE_CLIENT_ID)

export const googleAuthService = () =>{
    const verify = async (token : string) => {
        const user = {
            name: '',
            email: '',
            profilePic: '',
            isGoogleUser: true
        }
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: configFile.GOOGLE_CLIENT_ID
        })
        const payload = ticket.getPayload()
        if(payload?.given_name && payload.email && payload.picture)
        {
            user.name = payload.given_name,
            user.email = payload.email,
            user.profilePic = payload.picture 
        }

        return user
    }
    return {verify}
}

export type googleAuthServices = typeof googleAuthService