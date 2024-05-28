import { Server, Socket } from 'socket.io';

const socketConfig = (io: Server) => {
    let users: Array<any> = [];

    const addUser = (userId: string, socketId: string) => {
        !users.some((user) => user.userId === userId) && users.push({ userId, socketId });
        console.log("user array : ", users)
      };
    const remUser = (socketId: string) => {
        users = users.filter((user) => user.socketId !== socketId);
    };

    const getUser = (userId: string) => {
        console.log("user array : ", users)
        console.log("recieved : ",userId)
        return users.find((user) => user.userId === userId);
      };
      

    io.on('connection', (socket: Socket) => {
        console.log(`Socket id created : ${socket.id}`);

        socket.on('addUser', (userId: string) => {
            try {
                console.log("userId connected : ", userId)
                addUser(userId, socket.id);
                io.emit('getUsers', users);
            } catch (error: any) {
                console.error('Error in addUser event:', error);
                socket.emit('addError', error.message);
            }
        });

        socket.on('sendMessage', ({ senderId, receiverId, text }) => {
            try {
                console.log("checking : ", senderId, receiverId, text)
                console.log("array user  :", users)
                const user = getUser(receiverId);
                console.log("userId in array in sendUser : ", user)
                if (user) {
                    io.to(user.socketId).emit('getMessage', {
                        senderId,
                        text
                    });
                } else {
                    throw new Error(`User with ID ${receiverId} not found`);
                }
            } catch (error: any) {
                console.error('Error in sendMessage event:', error);
                socket.emit('sendError', error.message);
            }
        });

        socket.on('disconnect', () => {
            console.log(`Socket disconnected: ${socket.id}`);
            remUser(socket.id);
            io.emit('getUsers', users);
        });
    });
};

export default socketConfig;
