import path from 'path';

import { Logger } from 'winston';
import { IEmailLocals, winstonLogger } from '@ashnewar/helper-library';
import nodemailer from 'nodemailer';
import { config } from '@notifications/config';
import Email from 'email-templates';


const log:Logger = winstonLogger(`${config.ELASTICSEARCH_URL}`,'mailTransportHelper','debug');

export const emailTemplates =async(template:string , reciever : string ,locals : IEmailLocals) =>{
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: config.SENDER_EMAIL,
                pass: config.SENDER_EMAIL_PASSWORD,
            }
        });

        const email:Email = new Email({
            message:{
                from: ` FreeLance <${config.SENDER_EMAIL}>`,
                to: reciever,
            },
            send:true,
            preview:false,
            transport:transporter,
            views:{
                options:{
                    extension:'ejs',
                },
            },
            juice:true,
            juiceResources:{
                preserveImportant:true,
                webResources:{
                    relativeTo:path.join(__dirname,'../build')
                },
            },
        });

        await email.send({
            template:path.join(__dirname,'..','src/emails_templates',template),
            message:{
                to:reciever,
            },
            locals
        
        });
    } catch (error) {
        log.log('error','NotificationService emailTemplates method error',error);
    }
};