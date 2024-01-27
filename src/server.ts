import http from 'http';

import { Application } from 'express';
import { IEmailMessageDetails, winstonLogger } from '@ashnewar/helper-library';
import 'express-async-errors';
import { Logger } from 'winston';
import { config } from '@notifications/config';
import { healthRoute } from '@notifications/route';
import { checkConnection } from '@notifications/elasticsearch';
import { createConnection } from '@notifications/queues/connection';
import { Channel } from 'amqplib';
import { authEmailMessageConsumer, orderEmailMessageConsumer } from '@notifications/queues/email_consumer';


const SERVER_PORT=4001;

const log:Logger = winstonLogger(`${config.ELASTICSEARCH_URL}`,'notificationServer','debug');

export const start=(app : Application): void =>{
    startServer(app);
    app.use('',healthRoute);
    startQueues();
    startElasticSearch();
};


const startQueues=async(): Promise<void> =>{
    const emailChannel : Channel = await createConnection() as Channel;
    await authEmailMessageConsumer(emailChannel);
    await orderEmailMessageConsumer(emailChannel);
    const verifyLink = 'http://localhost:3000/verify';
    const message :IEmailMessageDetails ={
        receiverEmail : `${config.SENDER_EMAIL}`,
        verifyLink : verifyLink,
        template:'verifyEmail'
    };

    await emailChannel.assertExchange('freelance-email-notification','direct',{durable:true});
    const msg =JSON.stringify(message);
    emailChannel.publish('freelance-email-notification','auth-email',Buffer.from(msg));

};

const startElasticSearch=(): void =>{
    checkConnection();

};

const startServer=(app:Application): void =>{
    try {
        const httpServer:http.Server =new http.Server(app);
        log.info(`Worker with process id ${process.pid} started`);
        httpServer.listen(SERVER_PORT,() => {
            log.info(`Notification server listening on port ${SERVER_PORT}`);
        });
        
    } catch (error) {
        log.log('error','Notification server failed to start');
    }

};