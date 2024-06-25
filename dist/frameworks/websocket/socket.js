"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let users = [];
const socketConfig = (io) => {
    io.on("connection", (socket) => {
        console.log(`a user connected with socket id: ${socket.id}`);
        socket.on("addUser", (userId) => {
            console.log("users added: ", users);
            const userExist = users.find((user) => user.userId === userId);
            if (!userExist) {
                console.log("user does not exist");
                const user = { userId, socketId: socket.id };
                users.push(user);
                io.emit("getUsers", users);
            }
            console.log("users =============== :", users);
        });
        socket.on("sendMessage", async ({ senderId, receiverId, message }) => {
            console.log("senderId: ", senderId);
            console.log("receiverId: ", receiverId);
            console.log("message: ", message);
            console.log("users: ", users);
            const receiver = users.find((user) => user.userId === receiverId);
            const sender = users.find((user) => user.userId === senderId);
            console.log("sender Exists: ", sender);
            console.log("receiver Exists: ", receiver);
            if (receiver && receiver.socketId && sender && sender.socketId) {
                console.log("receiver and sender socket exist");
                console.log(`Emitting message to receiver: ${receiver.socketId} and sender: ${sender.socketId}`);
                io.to(receiver.socketId).emit("getMessage", {
                    senderId,
                    message,
                    receiverId
                });
                io.to(sender.socketId).emit("getMessage", {
                    senderId,
                    message,
                    receiverId
                });
            }
            else if (sender && sender.socketId) {
                console.log("only sender exists");
                console.log(`Emitting message to sender: ${sender.socketId}`);
                io.to(sender.socketId).emit("getMessage", {
                    senderId,
                    message,
                    receiverId
                });
            }
            else {
                console.log(`User with userId ${receiverId} not found.`);
            }
        });
        socket.on("disconnect", () => {
            console.log("a user disconnected");
            users = users.filter(user => user.socketId !== socket.id);
            io.emit("getUsers", users);
        });
    });
};
exports.default = socketConfig;
