"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const server_1 = require("@notifications/server");
function intialize() {
    const app = (0, express_1.default)();
    (0, server_1.start)(app);
}
intialize();
//# sourceMappingURL=app.js.map