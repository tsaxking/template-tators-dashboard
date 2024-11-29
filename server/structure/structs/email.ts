import { DB } from '../../utilities/database';
import { Struct } from './struct';
import nodemailer from 'nodemailer';
import { sgTransport } from '@neoxia-js/nodemailer-sendgrid-transport';
import env from '../../utilities/env';
import { Constructor } from 'node-html-constructor/versions/v4';
import { attemptAsync } from '../../../shared/check';
import { getTemplateSync } from '../../utilities/files';

class EmailError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'EmailError';
    }
}

export namespace Email {
    const transporter = nodemailer.createTransport(
        sgTransport({
            auth: {
                apiKey: env.SENDGRID_API_KEY || ''
            }
        })
    );

    export type EmailOptions = {
        type: 'link' | 'text' | 'error';
        to: string[] | string;
        subject: string;
        attachments?: {
            filename: string;
            path: string;
        }[];
        constructor: Constructor & {
            link?: string;
            linkText?: string;
            title: string;
            message: string;
        };
    };

    export const Email = new Struct({
        database: DB,
        name: 'Email',
        structure: {
            type: 'text',
            to: 'text', // string[]
            clicked: 'boolean',
            link: 'text'
        }
    });

    export const send = (data: EmailOptions) => {
        return attemptAsync(async () => {
            const { type, to, attachments, constructor, subject } = data;

            let template = '';

            switch (type) {
                case 'link':
                    template = getTemplateSync(
                        'emails/link',
                        constructor
                    ).unwrap();
                    break;
                case 'text':
                    template = getTemplateSync(
                        'emails/text',
                        constructor
                    ).unwrap();
                    break;
                case 'error':
                    template = getTemplateSync(
                        'emails/error',
                        constructor
                    ).unwrap();
                    break;
            }

            if (!template) throw new EmailError('Template not found');

            return await transporter.sendMail({
                from: env.SENDGRID_DEFAULT_FROM,
                to,
                subject,
                html: template,
                attachments
            });
        });
    };
}
