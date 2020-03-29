import winston, { format } from 'winston';
import moment from 'moment';
import { Loggly } from 'winston-loggly-bulk';
import env from './env';

const { combine, timestamp, label, printf, metadata } = format;
const myFormat = printf(info => {
    let metas = [];
    Object.keys(info).forEach(e => {
        let value = '';
        if (e !== 'timestamp' && e !== 'label' && e !== 'level' && e !== 'message') {
            value = info[e];
            if (value !== '' && value !== undefined) {
                metas.push(`${e}:${value}`);
            }
        }
    });
    
    return `${info.timestamp} [${info.label}] ${info.level.toUpperCase()} ${info.message} | ${metas.join(' | ')}`;
});

const dateStr = moment().format('YYYY-MM-DD');
let logger = null;

if (process.env.NODE_ENV === 'development') {
    logger = new winston.createLogger({
        transports: [
            new winston.transports.File({ 
                filename: `./logs/${dateStr}.log`, 
                level: 'debug',
                format: combine(
                    label({ label: 'DEVELOP' }),
                    timestamp(),
                    myFormat
                )
            }),
            // new winston.transports.Console({
            //     level: 'debug',
            //     format: combine(
            //         label({ label: 'DEVELOP' }),
            //         timestamp(),
            //         myFormat
            //     )
            // }),
        ]
    });
} else {
    logger = new winston.createLogger({
        transports: [
            new Loggly({
                token: env.LOGGLY_TOKEN,
                subdomain: env.LOGGLY_SUBDOMAIN,
                tags: ['production', env.LOGGLY_TAG],
                json: true
            })
        ]
    });
}

export default logger;