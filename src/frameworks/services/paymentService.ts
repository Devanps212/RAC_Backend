import configFile from "../../config"
import { partnerDetailInterface } from "../../types/partnerInterface"
import { userInterface } from "../../types/userInterface"
import crypto from 'crypto'
import AppError from "../../utils/appErrors"
import { HttpStatus } from "../../types/httpTypes"
import axios from "axios"
import { partnerRepoInterface } from "../../app/repositories/partnerRepoInterface"
import { partnerDbRepo } from "../database/mongodb/repositories/partnerRepository"

export const paymentService = ()=>{
        const generateTransactionId = ()=>{
            const length = 10
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
            const transactionString = 'RAC-'
            
            let transactionId = ''
            for(let i = 0; i < length; i++)
            {
                const randomIndex = Math.floor(Math.random() * characters.length)
                transactionId +=characters.charAt(randomIndex)
            }

            return transactionString + transactionId
        }

        const paymentMakingService = async(userData:userInterface)=>{
            try
            {
                console.log(userData.role)
                const amountInPaisa = userData.amount ? userData.amount * 100 : 0
                const transactionId = generateTransactionId()
                const data = {
                    merchantId: configFile.MERCHANT_ID,
                    merchantTransactionId: transactionId,
                    merchantUserId: userData._id,
                    amount: amountInPaisa,
                    redirectUrl: `http://localhost:5000/api/${userData.role}/redirect-to/${transactionId}/${userData._id}`,
                    redirectMode: "REDIRECT",
                    mobileNumber: "9999999999",
                    paymentInstrument: {
                    "type": "PAY_PAGE"
                    }
                }
                
                const payload = JSON.stringify(data)
                const mainPayload = Buffer.from(payload).toString('base64')
                const key = configFile.SALT_KEY
                const keyIndex = configFile.SALT_INDEX
                const string = mainPayload + '/pg/v1/pay' + key
                const sha256 = crypto.createHash('sha256').update(string).digest('hex')
                const checksum = sha256 + '###' + keyIndex

                console.log("Authentication key : ", key)
                console.log('sha256 : ', sha256)    
                const url = configFile.PHONEPAY_URL
                console.log("url :", url)

                const options = {
                    method: 'POST',
                    url: url,
                    headers: {
                        accept: 'application/json',
                        'Content-Type': 'application/json',
                        'X-VERIFY' : checksum       },
                    data: {
                        request: mainPayload
                    }
                };
                console.log("options passing : ", options)
                const response = await axios.request(options);
                console.log("response of data : ", response.data);
                return response.data.data.instrumentResponse.redirectInfo.url;
                
            }
            catch(error:any)
            {
                console.log(error.message)
                throw new AppError(error.message, HttpStatus.BAD_GATEWAY)
            }
        }

        return {paymentMakingService, generateTransactionId}
}

export type paymentServiceType = typeof paymentService