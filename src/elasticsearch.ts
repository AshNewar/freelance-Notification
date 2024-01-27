import { winstonLogger } from '@ashnewar/helper-library';
import {Client} from '@elastic/elasticsearch';
import { config } from '@notifications/config';
import { Logger } from 'winston';

const log:Logger = winstonLogger(`${config.ELASTICSEARCH_URL}`,'notificationElasticSearchServer','debug');

const elasticSearchClient = new Client({
    node: `${config.ELASTICSEARCH_URL}`
});

export async function checkConnection():Promise<void>{
    let isConnected = false;
    while (!isConnected) {
        try {
            const health = await elasticSearchClient.cluster.health({});
            log.info(`Notification Elasticsearch health status: ${health.status}`);
            isConnected = true;
        } catch (error) {
            log.error('Elasticsearch cluster is down!');
            log.log('error','NotificationServer checkConnection() Error ');   
        }
    }
}