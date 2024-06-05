import { Server, Socket } from 'socket.io';

interface UsersSocketMap {
    [userId: string]: string; 
}

export const getRecieverSocketId = (receieverId: string)=>{
    return usersSocketMap[receieverId]
}


const usersSocketMap: UsersSocketMap = {};

const socketConfig = (io: Server) => {
    
    io.on('connection', (socket: Socket) => {
        console.log(`Socket id created : ${socket.id}`);
        
        const userId = socket.handshake.query.userId as string;
        console.log("userId in socket : ", userId);
        console.log("socket object :", usersSocketMap)

        if (userId) {
            usersSocketMap[userId] = socket.id;
            io.emit("getOnlineUsers", Object.keys(usersSocketMap));
        }

        socket.on("disconnect", () => {
            console.log("user disconnected : ", socket.id);
            if (userId && usersSocketMap[userId]) {
                delete usersSocketMap[userId]; 
                io.emit("getOnlineUsers", Object.keys(usersSocketMap))
            }
        });
    });
};

export default socketConfig;
