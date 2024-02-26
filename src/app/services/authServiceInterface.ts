import { authServiceReturn } from "../../frameworks/services/authServices";

export const interfaceAuthService = (service: authServiceReturn)=>{
    const encryptPassword = (password: string)=>{
        return service.encryption(password);
    }
    const decryptPassword = (password: string, hashPassword: string)=>{
        return service.decryption(password, hashPassword)
    }

    const jwtGeneration = (payload: string, role: string)=>{
        return service.jwtGeneration({payload, role})
    }
    const tokenVerification = (token:string)=>{
        return service.verifyToken(token)
    }

    return{
        encryptPassword,
        decryptPassword,
        jwtGeneration,
        tokenVerification
    }
}

export type InterfaceAuthService = typeof interfaceAuthService