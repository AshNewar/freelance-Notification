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
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderEmailMessageConsumer = exports.authEmailMessageConsumer = void 0;
const helper_library_1 = require("@ashnewar/helper-library");
const config_1 = require("@notifications/config");
const connection_1 = require("@notifications/queues/connection");
const mail_transport_1 = require("@notifications/queues/mail_transport");
const log = (0, helper_library_1.winstonLogger)(`${config_1.config.ELASTICSEARCH_URL}`, 'NotificationEmailConsumer', 'debug');
const authEmailMessageConsumer = (channel) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!channel) {
            channel = (yield (0, connection_1.createConnection)());
        }
        const exchangeName = 'freelance-email-notification';
        const routingKey = 'auth-email';
        const queueName = 'auth-email-queue';
        yield channel.assertExchange(exchangeName, 'direct', { durable: true });
        const queue = yield channel.assertQueue(queueName, { durable: true, autoDelete: false });
        yield channel.bindQueue(queue.queue, exchangeName, routingKey);
        yield channel.consume(queue.queue, (msg) => __awaiter(void 0, void 0, void 0, function* () {
            const { receiverEmail, username, template, verifyLink, resetLink } = JSON.parse(msg.content.toString());
            const locals = {
                appLink: `${config_1.config.CLIENT_URL}`,
                appIcon: 'https://i.ibb.co/VgD4d6n/Leet-Code-Badge.png',
                username: `${username}`,
                verifyLink: `${verifyLink}`,
                resetLink: `${resetLink}`,
            };
            yield (0, mail_transport_1.sendEmail)(template, receiverEmail, locals);
            channel.ack(msg);
        }));
    }
    catch (error) {
        log.log('error', 'NotificationService authEmailMessageConsumer method error', error);
    }
});
exports.authEmailMessageConsumer = authEmailMessageConsumer;
const orderEmailMessageConsumer = (channel) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!channel) {
            channel = (yield (0, connection_1.createConnection)());
        }
        const exchangeName = 'freelance-order-notification';
        const routingKey = 'order-email';
        const queueName = 'order-email-queue';
        yield channel.assertExchange(exchangeName, 'direct', { durable: true });
        const queue = yield channel.assertQueue(queueName, { durable: true, autoDelete: false });
        yield channel.bindQueue(queue.queue, exchangeName, routingKey);
        yield channel.consume(queue.queue, (msg) => __awaiter(void 0, void 0, void 0, function* () {
            const { receiverEmail, username, template, sender, offerLink, amount, buyerUsername, sellerUsername, title, description, deliveryDays, orderId, orderDue, requirements, orderUrl, originalDate, newDate, reason, subject, header, type, message, serviceFee, total } = JSON.parse(msg.content.toString());
            const locals = {
                appLink: `${config_1.config.CLIENT_URL}`,
                appIcon: 'https://i.ibb.co/Kyp2m0t/cover.png',
                username,
                sender,
                offerLink,
                amount,
                buyerUsername,
                sellerUsername,
                title,
                description,
                deliveryDays,
                orderId,
                orderDue,
                requirements,
                orderUrl,
                originalDate,
                newDate,
                reason,
                subject,
                header,
                type,
                message,
                serviceFee,
                total
            };
            if (template === 'orderPlaced') {
                yield (0, mail_transport_1.sendEmail)(template, receiverEmail, locals);
                yield (0, mail_transport_1.sendEmail)('orderReceipt', receiverEmail, locals);
            }
            else {
                yield (0, mail_transport_1.sendEmail)(template, receiverEmail, locals);
            }
            channel.ack(msg);
        }));
    }
    catch (error) {
        log.log('error', 'NotificationService orderEmailMessageConsumer method error', error);
    }
});
exports.orderEmailMessageConsumer = orderEmailMessageConsumer;
//# sourceMappingURL=email_consumer.js.map