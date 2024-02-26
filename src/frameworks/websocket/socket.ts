// import { Server, Socket } from "socket.io";
// import { usersModel } from "../database/mongodb/models/userModel";

// const socketConfig = (io:Server)=>{
//     let users : Array<any> = []

//     const addUser = (userId: string, socketId: string)=>{
//         !users.some((users)=> users.userId === userId) && users.push({userId, socketId})
//     };
//     const removeUser = (socketId:string)=>{
//         users = users.filter((user)=>user.socketId !== socketId)
//     }
//     const getUser = (userId:string)=>{
//         return users.find((user)=> user.userId == userId)
//     }

//     io.on('connection', (socket: Socket)=>{
//         console.log("User Connected")
//     })
// }


