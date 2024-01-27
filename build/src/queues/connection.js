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
exports.closeConnections = exports.createConnection = void 0;
const helper_library_1 = require("@ashnewar/helper-library");
const config_1 = require("@notifications/config");
const amqplib_1 = __importDefault(require("amqplib"));
const log = (0, helper_library_1.winstonLogger)(`${config_1.config.ELASTICSEARCH_URL}`, 'NotificationMQConnection', 'debug');
function createConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const connections = yield amqplib_1.default.connect(`${config_1.config.RABBITMQ_URL}`);
            const channel = yield connections.createChannel();
            log.info('NotificationService RabbitMQ connection created');
            closeConnections(channel, connections);
            return channel;
        }
        catch (error) {
            log.log('error', 'NotificationService RabbitMQ connection error', error);
            return undefined;
        }
    });
}
exports.createConnection = createConnection;
function closeConnections(channel, connection) {
    process.once('SIGINT', () => __awaiter(this, void 0, void 0, function* () {
        yield channel.close();
        yield connection.close();
    }));
}
exports.closeConnections = closeConnections;
//# sourceMappingURL=connection.js.map