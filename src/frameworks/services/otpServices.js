"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.otpAuth = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const speakeasy_1 = __importDefault(require("speakeasy"));
const appErrors_1 = __importDefault(require("../../utils/appErrors"));
const httpTypes_1 = require("../../types/httpTypes");
// export const otpAuth = () => {
//   const transporter: Transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 587,
//     secure: false, // true for 465, false for other ports
//     auth: {
//       user: "devanps212@gmail.com",
//       pass: "urfz fais vtgj iueu",
//     },
//   });
//   let otp: string | null;
//   let expirationTime: NodeJS.Timeout | null;
//   otp = Math.floor(100000 + Math.random() * 900000).toString();
//   const currentOTP = otp
//   const sendOtp = (email: string) => {
//     console.log("sendOtp reached");
//     console.log(currentOTP)
//     const otpData = {
//       email,
//       currentOTP,
//     };
//     console.log("otpdata: ", otpData);
//     expirationTime = setTimeout(() => {
//       otp = null;
//       expirationTime = null;
//     }, 60000);
//     console.log(otpData);
//     const mailOptions = {
//       from: "devanps212@gmail.com",
//       to: email,
//       subject: "OTP for Login",
//       text: `Your OTP for login is: ${otp}`,
//     };
//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         console.error("Error sending email:", error);
//       } else {
//         console.log("response : ", info.response)
//       }
//     });
//     console.log("currentOtp : ", currentOTP)
//     return currentOTP
//   };
//   const verifyOtp = (OTP: string, VOTP : string) => {
//     console.log(OTP, VOTP)
//     console.log(typeof(OTP), typeof(VOTP))
//     console.log(OTP.length, VOTP.length)
//     if (OTP === VOTP) {
//       console.log("otp success")
//       return { message: "OTP verified" };
//     } else if (otp === null) {
//       return { message: "OTP is expired" };
//     } else {
//       return { message: "OTP is invalid" };
//     }
//   };
//   return {
//     sendOtp,
//     verifyOtp,
//   };
// };
// export type OtpAuth = ReturnType<typeof otpAuth>;
const otpAuth = () => {
    const secret = speakeasy_1.default.generateSecret();
    const totp = speakeasy_1.default.totp({
        secret: secret.base32,
        encoding: "base32",
        step: 60
    });
    const sendOtp = (email) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("email found : ", email);
        try {
            console.log('secret generated =', secret);
            const transporter = nodemailer_1.default.createTransport({
                service: 'gmail',
                auth: {
                    user: 'devanps212@gmail.com',
                    pass: 'urfz fais vtgj iueu'
                }
            });
            const mailOptions = {
                from: 'devanps212@gmail.com',
                to: email,
                subject: 'OTP fro login',
                text: `Your one time password for secure login is ${totp}, dont disclose it to someone`
            };
            const sendOTP = yield transporter.sendMail(mailOptions);
            console.log("OTP sent successfully: ", sendOTP);
            console.log("Generated OTP : ", totp);
            return { status: 'success', message: 'OTP send success', otp: totp };
        }
        catch (error) {
            console.log(error.message);
            return { status: "failed", message: 'OTP cannot send' };
        }
    });
    const verifyOtp = (otp, secret) => {
        try {
            const OTPCheck = speakeasy_1.default.totp.verify({
                secret: secret.base32,
                encoding: 'base32',
                step: 60,
                token: otp
            });
            console.log(OTPCheck);
            if (!OTPCheck) {
                console.log("OTP is not valid");
                throw new appErrors_1.default("Entered OTP is wrong", httpTypes_1.HttpStatus.UNAUTHORIZED);
            }
            else {
                return { status: 'success', message: 'OTP verified' };
            }
        }
        catch (error) {
            console.log("error in verifyOTP");
            throw new appErrors_1.default('Internal server error', httpTypes_1.HttpStatus.BAD_REQUEST);
        }
    };
    return { sendOtp, verifyOtp };
};
exports.otpAuth = otpAuth;
