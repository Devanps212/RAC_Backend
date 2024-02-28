import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import configFile from '../../config'

export const authService = ()=>{
    const encryption = async(password:string)=>{
        const salt = await bcrypt.genSalt(10)
        const passEncrypt = await bcrypt.hash(password, salt)
        return passEncrypt 
    }

    const decryption = async(password:string, hashPass: string)=>{
        const passdcrypt = await bcrypt.compare(password, hashPass)
        return passdcrypt
    }
    const jwtGeneration = (payload:{payload:string, role:string})=>{
        const token = jwt.sign(payload, configFile.JWT_KEY, {
            expiresIn: "4d"
        })
        return token
    }
    const verifyToken = (token:string)=>{
        return jwt.verify(token, configFile.JWT_KEY)
    }
    return{
        encryption,
        decryption,
        jwtGeneration,
        verifyToken
    }
}

export type AuthService = typeof authService
export type authServiceType = ReturnType<AuthService>
