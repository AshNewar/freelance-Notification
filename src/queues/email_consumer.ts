import { IEmailLocals, winstonLogger } from '@ashnewar/helper-library';
import { config } from '@notifications/config';
import { Channel, ConsumeMessage } from 'amqplib';
import { Logger } from 'winston';
import { createConnection } from '@notifications/queues/connection';
import { sendEmail } from '@notifications/queues/mail_transport';

const log: Logger = winstonLogger(`${config.ELASTICSEARCH_URL}`, 'NotificationEmailConsumer', 'debug');

export const authEmailMessageConsumer=async(channel:Channel): Promise<void> =>{
    try {
        if(!channel){
            channel=await createConnection() as Channel;
        }
        const exchangeName:string = 'freelance-email-notification';
        const routingKey:string = 'auth-email';
        const queueName:string = 'auth-email-queue';
        await channel.assertExchange(exchangeName,'direct',{durable:true});
        const queue=await channel.assertQueue(queueName,{durable:true ,autoDelete:false});
        await channel.bindQueue(queue.queue,exchangeName,routingKey);
        await channel.consume(queue.queue,async (msg :ConsumeMessage | null)=>{
            const {receiverEmail,username ,template ,verifyLink ,resetLink} = JSON.parse(msg!.content.toString());
            const locals:IEmailLocals ={
                appLink : `${config.CLIENT_URL}`,
                appIcon : 'https://i.ibb.co/VgD4d6n/Leet-Code-Badge.png',
                username : `${username}`,
                verifyLink : `${verifyLink}`,
                resetLink : `${resetLink}`,
            };
            await sendEmail(template,receiverEmail,locals);
            channel.ack(msg!);
        });
    } catch (error) {
        log.log('error','NotificationService authEmailMessageConsumer method error',error);
    }

};

export const orderEmailMessageConsumer=async(channel:Channel): Promise<void> =>{
    try {
        if(!channel){
            channel=await createConnection() as Channel;
        }
        const exchangeName:string = 'freelance-order-notification';
        const routingKey:string = 'order-email';
        const queueName:string = 'order-email-queue';
        await channel.assertExchange(exchangeName,'direct',{durable:true});
        const queue=await channel.assertQueue(queueName,{durable:true ,autoDelete:false});
        await channel.bindQueue(queue.queue,exchangeName,routingKey);
        await channel.consume(queue.queue,async (msg :ConsumeMessage | null)=>{
            const {
                receiverEmail,
                username,
                template,
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
              } = JSON.parse(msg!.content.toString());
              const locals: IEmailLocals = {
                appLink: `${config.CLIENT_URL}`,
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

              if(template === 'orderPlaced') {
                await sendEmail(template, receiverEmail, locals);
                await sendEmail('orderReceipt', receiverEmail, locals);
              }
              else{
                await sendEmail(template, receiverEmail, locals);
              }
              channel.ack(msg!);
        });

    } catch (error) {
        log.log('error','NotificationService orderEmailMessageConsumer method error',error);
    }

};