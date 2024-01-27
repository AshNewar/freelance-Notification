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
exports.sendEmail = void 0;
const helper_library_1 = require("@ashnewar/helper-library");
const config_1 = require("@notifications/config");
const helpers_1 = require("@notifications/helpers");
const log = (0, helper_library_1.winstonLogger)(`${config_1.config.ELASTICSEARCH_URL}`, 'mailTransport', 'debug');
const sendEmail = (template, receiverEmail, locals) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, helpers_1.emailTemplates)(template, receiverEmail, locals);
        log.info('Email Sent Successfully');
    }
    catch (error) {
        log.log('error', 'NotificationService sendEmail method error', error);
    }
});
exports.sendEmail = sendEmail;
//# sourceMappingURL=mail_transport.js.map