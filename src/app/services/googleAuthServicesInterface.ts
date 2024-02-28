import { googleAuthServices } from "../../frameworks/services/googleAuthServices";


export const googleAuthInterface = (googleAuthService : ReturnType<googleAuthServices>) =>{
    
    const verify = async(token: string)=> await googleAuthService.verify(token)

    return {verify}
}

export type authGoogleInterface = typeof googleAuthInterface