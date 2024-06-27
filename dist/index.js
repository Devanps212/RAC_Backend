"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const cronJob_1 = require("./frameworks/services/cronJob");
const connection_1 = __importDefault(require("./frameworks/database/mongodb/connection"));
const express_2 = __importDefault(require("./frameworks/webserver/express"));
const errorHandling_1 = __importDefault(require("./frameworks/webserver/middlewares/errorHandling"));
const appErrors_1 = __importDefault(require("./utils/appErrors"));
const server_1 = __importDefault(require("./frameworks/webserver/server"));
const routes_1 = __importDefault(require("./frameworks/webserver/routes/routes"));
const socket_1 = __importDefault(require("./frameworks/websocket/socket"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
console.log(process.env.TEST);
app.use((0, cors_1.default)());
exports.io = new socket_io_1.Server(server, {
    cors: {
        origin: "https://easyrentacar.shop"
    }
});
(0, socket_1.default)(exports.io);
(0, connection_1.default)();
(0, cronJob_1.scheduleDeleteExpiredCoupons)();
(0, express_2.default)(app);
(0, routes_1.default)(app);
app.use(errorHandling_1.default);
app.all('*', (req, res, next) => {
    next(new appErrors_1.default('Not found', 404));
});
(0, server_1.default)(server);
