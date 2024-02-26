import nodemailer, { Transporter } from "nodemailer";
import speakseasy from 'speakeasy'
import configKeys from "../../config";

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

export const otpAuth = ()=>{

  const secret = speakseasy.generateSecret()
  const totp = speakseasy.totp({
    secret:secret.base32,
    encoding:"base32",
    step:60
  })

  const sendOtp = async(email:string) =>{
    try
    {
       const transporter = nodemailer.createTransport({
        service:'gmail',
        auth:{
          user : 'devanps212@gmail.com',
          pass : 'urfz fais vtgj iueu'
        }
       })

       const mailOptions = {
        from: 'devanps212@gmail.com',
        to: email,
        subject:'OTP fro login',
        text:`Your one time password for secure login is ${totp}, dont disclose it to someone`
       }
       const sendOTP = await transporter.sendMail(mailOptions)
       console.log("OTP sent successfully: ", sendOTP);
       console.log("Generated OTP : ", totp)
       return {status:'success', message:'OTP send success', genOTp: totp}
       
    }
    catch(error:any)
    {
      console.log(error.message)
      return {status : "failed", message:'OTP cannot send'}
    }
  }
  const verifyOtp = (otp:string, votp: string)=>{

  }
  return {sendOtp, verifyOtp}

}