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
exports.start = void 0;
const http_1 = __importDefault(require("http"));
const helper_library_1 = require("@ashnewar/helper-library");
require("express-async-errors");
const config_1 = require("@notifications/config");
const route_1 = require("@notifications/route");
const elasticsearch_1 = require("@notifications/elasticsearch");
const connection_1 = require("@notifications/queues/connection");
const email_consumer_1 = require("@notifications/queues/email_consumer");
const SERVER_PORT = 4001;
const log = (0, helper_library_1.winstonLogger)(`${config_1.config.ELASTICSEARCH_URL}`, 'notificationServer', 'debug');
const start = (app) => {
    startServer(app);
    app.use('', route_1.healthRoute);
    startQueues();
    startElasticSearch();
};
exports.start = start;
const startQueues = () => __awaiter(void 0, void 0, void 0, function* () {
    const emailChannel = yield (0, connection_1.createConnection)();
    yield (0, email_consumer_1.authEmailMessageConsumer)(emailChannel);
    yield (0, email_consumer_1.orderEmailMessageConsumer)(emailChannel);
    const verifyLink = 'http://localhost:3000/verify';
    const message = {
        receiverEmail: `${config_1.config.SENDER_EMAIL}`,
        verifyLink: verifyLink,
        template: 'verifyEmail'
    };
    yield emailChannel.assertExchange('freelance-email-notification', 'direct', { durable: true });
    const msg = JSON.stringify(message);
    emailChannel.publish('freelance-email-notification', 'auth-email', Buffer.from(msg));
});
const startElasticSearch = () => {
    (0, elasticsearch_1.checkConnection)();
};
const startServer = (app) => {
    try {
        const httpServer = new http_1.default.Server(app);
        log.info(`Worker with process id ${process.pid} started`);
        httpServer.listen(SERVER_PORT, () => {
            log.info(`Notification server listening on port ${SERVER_PORT}`);
        });
    }
    catch (error) {
        log.log('error', 'Notification server failed to start');
    }
};
//# sourceMappingURL=server.js.map