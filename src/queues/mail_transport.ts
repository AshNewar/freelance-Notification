import { IEmailLocals, winstonLogger } from '@ashnewar/helper-library';
import { config } from '@notifications/config';
import { emailTemplates } from '@notifications/helpers';
import { Logger } from 'winston';


const log:Logger = winstonLogger(`${config.ELASTICSEARCH_URL}`,'mailTransport','debug');

export const sendEmail=async (template:string,receiverEmail:string,locals:IEmailLocals): Promise<void> =>{
    try {
        emailTemplates(template,receiverEmail,locals);
        log.info('Email Sent Successfully');
        
    } catch (error) {
        log.log('error','NotificationService sendEmail method error',error);
    }

};