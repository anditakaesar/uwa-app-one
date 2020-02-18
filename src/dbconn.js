import { connect } from 'mongoose';
import env from './env';
import logger from './logger';

const FULLURI = `${env.MONGODB_URI}/${env.MONGODB_NAME}`;
const mongoOpts = { 
    useNewUrlParser: true, 
    useCreateIndex: true, 
    useFindAndModify: false, 
    useUnifiedTopology: true 
};

const connection = connect(FULLURI, mongoOpts,
    err => {
        if (err) {
            logger.error(err.message);
        } else {
            logger.info(`database connected!`);
        }
    }
);

export const dbconn = require('mongoose').connection;
export const checkDbReady = (req, res, next) => {
    if (dbconn.readyState) {
        next();
    } else {
        error.message = `Database not ready`;
        error.request = `${req.method} ${req.originalUrl}`;
        error.status = 500;
        next(error);
    }
}

export default connection;