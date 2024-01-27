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
exports.checkConnection = void 0;
const helper_library_1 = require("@ashnewar/helper-library");
const elasticsearch_1 = require("@elastic/elasticsearch");
const config_1 = require("@notifications/config");
const log = (0, helper_library_1.winstonLogger)(`${config_1.config.ELASTICSEARCH_URL}`, 'notificationElasticSearchServer', 'debug');
const elasticSearchClient = new elasticsearch_1.Client({
    node: `${config_1.config.ELASTICSEARCH_URL}`
});
function checkConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        let isConnected = false;
        while (!isConnected) {
            try {
                const health = yield elasticSearchClient.cluster.health({});
                log.info(`Notification Elasticsearch health status: ${health.status}`);
                isConnected = true;
            }
            catch (error) {
                log.error('Elasticsearch cluster is down!');
                log.log('error', 'NotificationServer checkConnection() Error ');
            }
        }
    });
}
exports.checkConnection = checkConnection;
//# sourceMappingURL=elasticsearch.js.map