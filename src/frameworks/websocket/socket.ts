// // import { Server, Socket } from 'socket.io';

// // interface UsersSocketMap {
// //     [userId: string]: string; 
// // }

// // export const getRecieverSocketId = (receieverId: string)=>{
// //     return usersSocketMap[receieverId]
// // }


// // const usersSocketMap: UsersSocketMap = {};

// // const socketConfig = (io: Server) => {
    
// //     io.on('connection', (socket: Socket) => {
// //         console.log(`Socket id created : ${socket.id}`);
        
// //         const senderId = socket.handshake.query.userId as string;
// //         console.log("userId in socket : ", senderId);
// //         console.log("socket object :", usersSocketMap)

// //         if (senderId) {
// //             usersSocketMap[senderId] = socket.id;
// //             io.emit("getOnlineUsers", Object.keys(usersSocketMap));
// //         }

// //         socket.on("disconnect", () => {
// //             console.log("user disconnected : ", socket.id);
// //             if (senderId && usersSocketMap[senderId]) {
// //                 delete usersSocketMap[senderId]; 
// //                 io.emit("getOnlineUsers", Object.keys(usersSocketMap))
// //             }
// //         });
// //     });
// // };

// // export default socketConfig;

// import { Server, Socket } from 'socket.io';

// interface UsersSocketMap {
//     [senderId: string]: string; 
// }

// export const getReceiverSocketId = (receiverId: string) => {
//     return usersSocketMap[receiverId];
// } //in entity it is available

// const usersSocketMap: UsersSocketMap = {};

// const socketConfig = (io: Server) => {
//     io.on('connection', (socket: Socket) => {
//         console.log(`Socket id created: ${socket.id}`);
        
//         const senderId = socket.handshake.query.senderId as string;
//         console.log("userId in socket:", senderId);
//         console.log("socket object:", usersSocketMap);

//         if (senderId) {
//             usersSocketMap[senderId] = socket.id;
//             io.emit("getOnlineUsers", Object.keys(usersSocketMap));
//         }

//         socket.on("disconnect", () => {
//             console.log("User disconnected:", socket.id);
//             if (senderId && usersSocketMap[senderId]) {
//                 delete usersSocketMap[senderId]; 
//                 io.emit("getOnlineUsers", Object.keys(usersSocketMap));
//             }
//         });

//         // Example: Handle other socket events here
//         socket.on("someEvent", (data) => {
//             console.log("Received some event:", data);
//             // Handle the event as needed
//         });
//     });
// };

// export default socketConfig;


//2nd socket

// interface UsersSocketMap {
//     [senderId: string]: string; 
// }

// export const getReceiverSocketId = (receiverId: string) => {
//     console.log("receiver id : ", receiverId)
//     console.log("id present : ", usersSocketMap[receiverId])
//     console.log("whole ids : ", usersSocketMap)
//     return usersSocketMap[receiverId];
// }

// const usersSocketMap: UsersSocketMap = {};

// const socketConfig = (io: Server) => {
//     io.on('connection', (socket: Socket) => {
//         console.log(`Socket id created: ${socket.id}`);
        
//         const senderId = socket.handshake.query.senderId as string;
//         console.log("userId in socket:", senderId);
//         console.log("socket object:", usersSocketMap);

//         if (senderId) {
//             usersSocketMap[senderId] = socket.id;
//             io.emit("getOnlineUsers", Object.keys(usersSocketMap));
//         }

//         socket.on("disconnect", () => {
//             console.log("User disconnected:", socket.id);
//             if (senderId && usersSocketMap[senderId]) {
//                 delete usersSocketMap[senderId]; 
//                 io.emit("getOnlineUsers", Object.keys(usersSocketMap));
//             }
//         });

//         socket.on("sendMessage", ({ receiverId, message }) => {
//             console.log("mesage and id : ", receiverId, message)
//             const receiverSocketId = getReceiverSocketId(receiverId);
//             if (receiverSocketId) {
//                 console.log("receiever Id in socket : ", receiverSocketId )
//                 io.to(receiverSocketId).emit("newMessage", message);
//             } else {
//                 console.error(`Receiver socket id for user ${receiverId} is undefined.`);
//             }
//         });
//     });
// };

// export default socketConfig;

import { text } from 'body-parser';
import { Server, Socket } from 'socket.io';

let users : any[] =[]

const addUser = (userId: string , socketId: string)=>{
    !users.some((user :  any)=>user.userId === userId) && 
    users.push({userId,socketId})
}

const removeUser = (socketId: string)=>{
    users = users.filter((user:any)=>user.socketId !== socketId)
}

const getUser = (userId:string) =>{
    return users.find(user=>user.userId === userId)
}


const socketConfig = (io: Server)=>{
    io.on('connection', (socket)=>{
        console.log(`user connected with socket ID : ${socket.id}`)

        socket.on('addUser', (userId)=>{
            addUser(userId, socket.id)
            io.emit("getUsers", users)
        })

        socket.on("sendMessageUser", ({senderId, receiverId, message})=>{
            const user = getUser(receiverId)
            if(user){
                io.to(user.socketId).emit("getMessagePartner", {
                    senderId,
                    message
                })
            } else {
                console.log(`User with userId ${receiverId} not found`);
            }
        })

        socket.on("sendMessagePartner", ({ senderId, receiverId, message })=>{
            const user = getUser(receiverId)
            if(user){
                io.to(user.socketId).emit("getMessageUser", {
                    senderId,
                    message
                })
            } else {
                console.log(`User with userId ${receiverId} not found.`);
            }
        })

        socket.on("disconnect", ()=>{
            console.log("a user disconnected")
            removeUser(socket.id)
        })

    })
}