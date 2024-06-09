// import { Server, Socket } from 'socket.io';

// interface UsersSocketMap {
//     [userId: string]: string; 
// }

// export const getRecieverSocketId = (receieverId: string)=>{
//     return usersSocketMap[receieverId]
// }


// const usersSocketMap: UsersSocketMap = {};

// const socketConfig = (io: Server) => {
    
//     io.on('connection', (socket: Socket) => {
//         console.log(`Socket id created : ${socket.id}`);
        
//         const senderId = socket.handshake.query.userId as string;
//         console.log("userId in socket : ", senderId);
//         console.log("socket object :", usersSocketMap)

//         if (senderId) {
//             usersSocketMap[senderId] = socket.id;
//             io.emit("getOnlineUsers", Object.keys(usersSocketMap));
//         }

//         socket.on("disconnect", () => {
//             console.log("user disconnected : ", socket.id);
//             if (senderId && usersSocketMap[senderId]) {
//                 delete usersSocketMap[senderId]; 
//                 io.emit("getOnlineUsers", Object.keys(usersSocketMap))
//             }
//         });
//     });
// };

// export default socketConfig;

import { Server, Socket } from 'socket.io';

interface UsersSocketMap {
    [senderId: string]: string; 
}

export const getReceiverSocketId = (receiverId: string) => {
    return usersSocketMap[receiverId];
} //in entity it is available

const usersSocketMap: UsersSocketMap = {};

const socketConfig = (io: Server) => {
    io.on('connection', (socket: Socket) => {
        console.log(`Socket id created: ${socket.id}`);
        
        const senderId = socket.handshake.query.senderId as string;
        console.log("userId in socket:", senderId);
        console.log("socket object:", usersSocketMap);

        if (senderId) {
            usersSocketMap[senderId] = socket.id;
            io.emit("getOnlineUsers", Object.keys(usersSocketMap));
        }

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
            if (senderId && usersSocketMap[senderId]) {
                delete usersSocketMap[senderId]; 
                io.emit("getOnlineUsers", Object.keys(usersSocketMap));
            }
        });

        // Example: Handle other socket events here
        socket.on("someEvent", (data) => {
            console.log("Received some event:", data);
            // Handle the event as needed
        });
    });
};

export default socketConfig;
