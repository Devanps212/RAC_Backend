"use strict";
// // import { Server, Socket } from 'socket.io';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
let users = [];
const socketConfig = (io) => {
    io.on("connection", (socket) => {
        console.log(`a user connected with socket id: ${socket.id}`);
        socket.on("addUser", (userId) => {
            console.log("adding user");
            console.log("users added: ", users);
            const userExist = users.find((user) => user.userId === userId);
            if (!userExist) {
                console.log("user does not exist");
                const user = { userId, socketId: socket.id };
                users.push(user);
                io.emit("getUsers", users);
            }
        });
        socket.on("sendMessage", ({ senderId, receiverId, message }) => __awaiter(void 0, void 0, void 0, function* () {
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
        }));
        socket.on("disconnect", () => {
            console.log("a user disconnected");
            users = users.filter(user => user.socketId !== socket.id);
            io.emit("getUsers", users);
        });
    });
};
exports.default = socketConfig;
